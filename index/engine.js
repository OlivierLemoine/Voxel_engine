import { Vect3, Axis } from './utils.js';
import './gpu_interface.js';
export class Object {
    constructor() {
        this.shape = [];
        this.rotation = new Vect3();
        this.position = new Vect3();
        this.id = GameEngine.add(this);
    }
    rotate(vect3) {
        this.shape.forEach(voxel => {
            voxel.position.apply(voxel.position.rotateDeg(Axis.x, vect3.x));
            voxel.position.apply(voxel.position.rotateDeg(Axis.y, vect3.y));
            voxel.position.apply(voxel.position.rotateDeg(Axis.z, vect3.z));
        });
        return this;
    }
}
export class Cube extends Object {
    constructor(size) {
        super();
        size = size || new Vect3(1, 1, 1);
        for (let vx = 0; vx < size.x; vx++) {
            for (let vy = 0; vy < size.y; vy++) {
                for (let vz = 0; vz < size.z; vz++) {
                    this.shape.push(new Voxel(this, new Vect3(vx, vy, vz)));
                    // if(vx === 0 || vx === size.x){
                    //     this.shape[this.shape.length-1].color.x = 0;
                    // }
                }
            }
        }
    }
}
export class Camera {
    constructor(shape, canvas) {
        this.position = new Vect3();
        this.shape = shape;
        //@ts-ignore
        this.gpuRender = GPU.create(canvas, [shape.y, shape.z]);
    }
    render() {
        let objs = [];
        GameEngine.objectsList().forEach(object => {
            object.shape.forEach(voxel => {
                objs.push(voxel
                    .getPosition()
                    .toArray()
                    .concat(voxel.color.divide(255).toArray()));
            });
        });
        let pixels = [];
        for (let i = -this.shape.y / 2; i < this.shape.y / 2; i++) {
            pixels.push([]);
            for (let j = -this.shape.z / 2; j < this.shape.z / 2; j++) {
                pixels[i + this.shape.y / 2].push([this.shape.x, i, j]);
            }
        }
        this.gpuRender([0, 0, 0], pixels, objs, objs.length);
    }
}
class Voxel {
    constructor(parent, pos) {
        this.color = new Vect3(255, 255, 255);
        this.parent = parent;
        this.position = pos || new Vect3();
    }
    getPosition() {
        let pos = this.position.add(this.parent.position).floor();
        return pos;
    }
}
class NestedVoxel {
}
let GameEngine = {
    id: 0,
    objects: {},
    add: (obj) => {
        // @ts-ignore
        GameEngine.objects[`id${GameEngine.id}`] = obj;
        return GameEngine.id++;
    },
    objectsList: () => {
        let res = [];
        for (const key in GameEngine.objects) {
            if (GameEngine.objects.hasOwnProperty(key)) {
                // @ts-ignore
                res.push(GameEngine.objects[key]);
            }
        }
        return res;
    }
};
