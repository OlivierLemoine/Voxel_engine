import { Camera, Cube } from './engine.js';
import { Vect3 } from './utils.js';
let canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
canvas.style.width = '300px';
canvas.style.height = '300px';
document.body.appendChild(canvas);
let obj = new Cube(new Vect3(5, 10, 10), false);
obj.position.x = 10;
obj.position.z = -30;
obj.position.y = -30;
let camera = new Camera(new Vect3(40, canvas.width, canvas.height), canvas);
camera.position = new Vect3(0, 0, 0);
camera.render();
let beginning = Date.now();
let steps = 0;
let count = 0;
function step() {
    obj.position.y += 0.1;
    obj.position.z += 0.1;
    // obj.rotate(Axis.x, 2*count++);
    camera.render();
    window.requestAnimationFrame(step);
    steps++;
    let diff = Date.now() - beginning;
    if (diff > 1000) {
        console.log((steps / diff) * 1000);
        steps = 0;
        beginning = Date.now();
    }
}
step();
