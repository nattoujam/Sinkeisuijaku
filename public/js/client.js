'use strict'

const socket = io.connect();
let nickname = null;
let player_id = null;

socket.on('connect', () => {
  // console.log('connect');
  nickname = document.getElementById('nickname').getAttribute('nickname');
});

socket.on('userdata', (si, pi) => {
  if(si !== socket.id) return;

  // console.log('userdata: ', pi);
  player_id = pi;
  document.getElementById(`cursor_${pi}`).setAttribute('style', 'display: none');

  const cursor_color = document.getElementById('cursor_color');
  socket.emit('change_cursor_color', cursor_color.getAttribute('color'), pi);
});

socket.on('syn_move_img', (x, y, id, pi) => {
  // console.log('synchronize move img: ', id);
  if(player_id === pi) return;

  let card = document.getElementById(id);
  card.style.top = y + 'px';
  card.style.left = x + 'px';
});

socket.on('syn_reverse', (id, new_face, reversed_image_name) => {
  // console.log(`synchronize reverse img: ${id}:${new_face} -> ${reversed_image_name}`);

  let card = document.getElementById(id);

  // swap
  // const src = card.getAttribute('src');
  // const reverse = card.getAttribute('reverse');
  card.setAttribute('src', `img/card/${reversed_image_name}`);
  card.setAttribute('face', new_face);
  // card.setAttribute('reverse', src);
});

socket.on('syn_cursor', (x, y, pi) => {
  if(player_id === pi) return;

  // console.log(`cursor_${pi}`);
  const cursor = document.getElementById(`cursor_${pi}`);

  const new_x = y;
  const new_y = x;
  cursor.style.top = new_y + 'px';
  cursor.style.left = new_x + 'px';
});

socket.on('syn_change_cursor_color', dict => {
  for(let d in dict) {
    // console.log(`${player_id} <=> ${d}`);
    if(player_id == d) continue;

    console.log(`cursor_${d}`);
    const cursor = document.getElementById(`cursor_${d}`);
    console.log(`${cursor}, ${d} <- ${dict[d]}`);
    cursor.setAttribute('src', `img/cursor/cursor_${dict[d]}.png`);
    cursor.setAttribute('style', 'position: absolute;');
  }
});
