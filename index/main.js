import { Camera, Cube, setResolution } from './engine.js';
import { Vect3, Axis } from './utils.js';

let canvas = document.createElement('canvas');

let resolution = 10;

canvas.width = 50 * resolution;
canvas.height = 50 * resolution;
setResolution(resolution);
canvas.style.width = '300px';
canvas.style.height = '300px';
document.body.appendChild(canvas);
let obj = new Cube(new Vect3(1, 2, 2), false);
obj.position.x = resolution;
obj.position.z = 0;
obj.position.y = 0;
// obj.position.z = -30;
// obj.position.y = -30;
let camera = new Camera(new Vect3(40, canvas.width, canvas.height), canvas);
camera.position = new Vect3(0, 0, 0);
camera.render();

function step() {
    camera.render();
    window.requestAnimationFrame(step);
}
// step();

canvas.addEventListener('mousemove', (e) => {
    obj.rotateTo(new Vect3(e.x, e.y, 0));
    camera.render();
});
