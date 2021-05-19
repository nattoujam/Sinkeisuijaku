'use strict'

const fs = require('fs');
const path = require('path');

const ext_filter = ['.jpeg', '.png'];

const shuffle = function(input) {
  let array = input;
  for(let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i-1]] = [array[i-1], array[k]];
  }
  return array
}

let cache = null;
let card_dict = {};

exports.load_card = function(model_path) {
  if (cache !== null) return cache;

  console.log('load: ', model_path);
  const img_list = fs.readdirSync(model_path, {withFileTypes: true})
    .filter(f => f.isFile())
    .filter(f => ext_filter.includes(path.extname(f.name).toLowerCase()))
    .filter(f => f.name !== 'card.png') // カード裏の画像は除外
  ;

  // let img_tag_a = img_list.map(({name}, index, array) => `<li><img src='img/card/card.png' class='card' id='img_${index}_a' width='200px' face='down'></li>\n`)
  // let img_tag_b = img_list.map(({name}, index, array) => `<li><img src='img/card/card.png' class='card' id='img_${index}_b' width='200px' face='down'></li>\n`)

  const img_tag = [];
  for(const index in img_list){
    const name = img_list[index].name;
    console.log('load:', img_list[index]);

    img_tag.push(`<li><img src='img/card/card.png' class='card' id='img_${index}1' width='200px' face='down'></li>\n`);
    img_tag.push(`<li><img src='img/card/card.png' class='card' id='img_${index}2' width='200px' face='down'></li>\n`);
    card_dict[`img_${index}1`] = name;
    card_dict[`img_${index}2`] = name;
  }

  // const img_tag = shuffle(img_tag_a.concat(img_tag_b));
  // cache = img_tag.join('');
  cache = shuffle(img_tag).join('');

  console.log(card_dict);

  return cache;
};

exports.load_card_dict = function() {
  if(card_dict == null) return {};
  
  card_dict['test_card'] = 'anago.png';
  return card_dict;
}

exports.clear = function() {
  cache = null;
  card_dict = [];
}
