import { Camera, Cube } from './engine.js';
import { Vect3 } from './utils.js';

let canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
canvas.style.width = '200px';
canvas.style.height = '200px';
document.body.appendChild(canvas);

let obj = new Cube(new Vect3(1, 100, 100));
obj.position.x = 11;
obj.position.z = -1;
obj.position.y = -1;
let camera = new Camera(new Vect3(10, canvas.width, canvas.height), canvas);
camera.position = new Vect3(-10, 0, 0);
camera.render();
let beginning = Date.now();
let steps = 0;
function step() {
    // obj.position.y += 0.05;
    // obj.position.z += 0.05;
    camera.render();
    window.requestAnimationFrame(step);
    steps++;
    let diff = Date.now() - beginning;
    if (diff > 1000) {
        console.log(steps / diff * 1000);
        steps = 0;
        beginning = Date.now();
    }
}
step();
