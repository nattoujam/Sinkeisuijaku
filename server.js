'use strict';

const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const ejs = require('ejs');
const alock = require('async-lock');

const gen = require('./card_generator.js')

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

let player = 0;
// let lock = new alock();
// const default_corsor_color = ['yellow', 'pink', 'green', 'red'];
// const lock_key = 'key';
let card_dict;
let cursor_color_dict = {};

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// routing
// arg1: レンダリングするファイルの拡張子
// arg2: レンダリングに用いる関数
app.engine('ejs', ejs.renderFile);
app.post('/', (req, res) => {
  // console.log(process.cwd());
  const card = gen.load_card('./public/img/card/');
  card_dict = gen.load_card_dict();
  // res.json({'nickname': req.body.nickname});
  console.log(req.body);
  res.render('main.ejs', { nickname:req.body.nickname, card_list:card, color:req.body.cursor_color});
});

io.on('connection', (socket) => {
  console.log('connect');
  player++;
  console.log('connection: No.', player);

  io.emit('userdata', socket.id, player);

  socket.on('disconnect', () => {
    console.log('disconnect');
    player--;
    if(player === 0) {
      console.log('clear card cache');
      gen.clear();
    } 
  });

  socket.on('reverse', (card_id, face) => {
    console.log('reverse: ', card_id, face);

    if(face == "up") {
      // カードを戻す
      io.emit('syn_reverse', card_id, "down", "card.png");
    }
    else if(face == "down") {
      // カードの絵柄を表示
      io.emit('syn_reverse', card_id, "up", card_dict[card_id]);
    }
  });

  socket.on('move_img', (x, y, id, pi) => {
    // console.log(`move image ${pi}: ${x}, ${y}, ${id}`);
    io.emit('syn_move_img', x, y, id, pi);
  });

  socket.on('cursor', (x, y, pi) => {
    // console.log(`cursor ${pi}: ${x}, ${y}`);
    io.emit('syn_cursor', x, y, pi);
  });

  socket.on('change_cursor_color', (color, pi) => {
    console.log(`change color ${pi}: ${color}`);
    cursor_color_dict[pi] = color;
    io.emit('syn_change_cursor_color', cursor_color_dict);
  });
});

app.use(express.static(__dirname + '/public'));

server.listen(PORT, () => {
  console.log(`server starts on: ${PORT}`);
});
