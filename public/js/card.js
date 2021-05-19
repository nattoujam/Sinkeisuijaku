'use strict';

// const socket = io.connect();

var clickedElement = null;

window.addEventListener('load', () => {
  const forEach = Array.forEach || Array.prototype.forEach.call;

  const onthe = (s1, s2) => {
    var rect1 = s1.getBoundingClientRect();
    var rect2 = s2.getBoundingClientRect();

    var w1 = rect1.width;
    var h1 = rect1.height;
    var cx1 = rect1.left + w1/2;
    var cy1 = rect1.top + h1/2;

    var w2 = rect2.width;
    var h2 = rect2.height;
    var cx2 = rect2.left + w2/2;
    var cy2 = rect2.top + h2/2;

    return (Math.abs(cx1 - cx2) <= w1/2 + w2/2) && (Math.abs(cy1 - cy2) <= h1/2 + h2/2);
  };

  const onto = s => {
    return Array.from(document.getElementsByClassName("waku"))
      .filter(w => onthe(s, w))
    ;
  };

  const setCenter = (s, w) => {
    var swidth = s.offsetWidth;
    var sheight = s.offsetHeight;
    var wr = w.getBoundingClientRect();
    var x = wr.left;
    var y = wr.top;
    var width = w.offsetWidth;
    var height = w.offsetHeight;
    s.style.top = y + (height / 2) - (sheight / 2) + "px";
    s.style.left = x + (width / 2) - (swidth / 2) + "px";
  };

  const onMouseMove = e => {
    const bounding = clickedElement.getBoundingClientRect();
    const x = Math.floor(bounding.x + e.movementX);
    const y = Math.floor(bounding.y + e.movementY);

    clickedElement.style.top = y + "px";
    clickedElement.style.left = x + "px";

    // console.log('send: ', x, y, clickedElement.id);
    socket.emit('move_img', x, y, clickedElement.id, player_id);
  };

  const onMouseUp = e => {
    if(clickedElement === null) return;

    let w = onto(clickedElement);
    if (w.length != 0) {
      // console.log("on to " + w);
      setCenter(clickedElement, w[0]);
    }
    document.removeEventListener("mousemove", onMouseMove);
    clickedElement = null;
  };

  const main = () => {
    document.addEventListener('mouseup', onMouseUp);

    Array.from(document.getElementsByClassName('card'))
      .forEach(c => {
        // console.log("card: " + c);
        c.style.position = "absolute";
        c.onmousedown = e => {
          //console.log("tapped");
          //console.log(c);
          clickedElement = c;
          document.addEventListener("mousemove", onMouseMove);
          // console.log(clickedElement);
        };
        c.ondragstart = e => {
          return false;
        };
        c.addEventListener('dblclick', e => {
          // swap
          // const src = c.getAttribute('src');
          // const reverse = c.getAttribute('reverse');
          // c.setAttribute('src', reverse);
          // c.setAttribute('reverse', src);
          const face = c.getAttribute('face');

          socket.emit('reverse', c.id, face);
        });
      })
    ;
  };

  main();
});
