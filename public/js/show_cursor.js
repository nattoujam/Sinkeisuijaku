'use strict';

let ignore = false;

window.addEventListener('load', () => {
  const cursor = document.getElementById('my_cursor');
  document.addEventListener('mousemove', e => {
    // if(ignore) return;

    // console.log(cursor);

    const x = event.clientY;
    const y = event.clientX;
    // cursor.style.top = x + 'px';
    // cursor.style.left = y + 'px';

    // 1秒後ごとにのみ，カーソル位置を共有
    // ignore = true;
    // setTimeout(reset, 1000, 'funky');
    socket.emit('cursor', x, y, player_id); 
  });
});

function reset() {
  console.log('mouse move acceptable');
  ignore = false;
}
