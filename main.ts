import * as Engine from './engine.js';

let canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
canvas.style.width = '100px';
canvas.style.height = '100px';
document.body.appendChild(canvas);
let ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();
ctx.imageSmoothingEnabled = false;

let obj = new Engine.Cube(new Engine.Vect3(1, 2, 2));
obj.position.x = 3;

let camera = new Engine.Camera();
camera.viewField = [canvas.width, canvas.height];
camera.backPoint = new Engine.Vect3(-100, canvas.width / 2, canvas.height / 2);
camera.position = new Engine.Vect3(0, 1, 1);
setInterval(() => {
    obj.position.x += 0.1;
    // obj.position.y += 0.05;
    let res = camera.render(ctx);
    ctx.putImageData(res, 0, 0);
}, 100);
