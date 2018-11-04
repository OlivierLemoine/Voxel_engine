import { Vect3, Axis } from './utils.js';
import * as GPU from './gpu_interface.js';

export class Object {
    private id: number;
    readonly shape: Voxel[] = [];
    readonly rotation: Vect3 = new Vect3();
    position: Vect3 = new Vect3();
    constructor() {
        this.id = GameEngine.add(this);
    }
    rotate(axis: Axis, angle: number): Object {
        this.shape.forEach(voxel => {
            voxel.position.apply(voxel.position.rotateDeg(axis, angle));
        });

        return this;
    }
}

export class Cube extends Object {
    constructor(size?: Vect3, wireframe?: boolean) {
        super();
        size = size || new Vect3(1, 1, 1);
        wireframe = wireframe || false;
        for (let vx = 0; vx < size.x; vx++) {
            for (let vy = 0; vy < size.y; vy++) {
                for (let vz = 0; vz < size.z; vz++) {
                    this.shape.push(new Voxel(this, new Vect3(vx, vy, vz)));
                    if (wireframe) {
                        if (vx === 0 || vz === 0) {
                            this.shape[this.shape.length - 1].color = new Vect3(
                                0,
                                0,
                                0
                            );
                        }
                    }
                    // if(vx === 0 || vx === size.x){
                    //     this.shape[this.shape.length-1].color.x = 0;
                    // }
                }
            }
        }
    }
}

export class Camera {
    position: Vect3 = new Vect3();
    shape: Vect3;
    gpuRender: any;

    constructor(shape: Vect3, canvas: HTMLCanvasElement) {
        this.shape = shape;
        //@ts-ignore
        this.gpuRender = GPU.create(canvas, [shape.y, shape.z]);
    }

    render() {
        let objs: number[][] = [];
        GameEngine.objectsList().forEach(object => {
            object.shape.forEach(voxel => {
                objs.push(
                    voxel
                        .getPosition()
                        .toArray()
                        .concat(voxel.color.divide(255).toArray())
                );
            });
        });
        let pixels: number[][][] = [];
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
    private parent: Object;
    position: Vect3;
    color: Vect3 = new Vect3(255, 255, 255);
    constructor(parent: Object, pos?: Vect3) {
        this.parent = parent;
        this.position = pos || new Vect3();
    }

    getPosition(): Vect3 {
        let pos: Vect3 = this.position.add(this.parent.position).floor();
        return pos;
    }
}

class NestedVoxel {}

let GameEngine = {
    id: 0,
    objects: {},
    add: (obj: Object) => {
        // @ts-ignore
        GameEngine.objects[`id${GameEngine.id}`] = obj;
        return GameEngine.id++;
    },
    objectsList: () => {
        let res: Object[] = [];
        for (const key in GameEngine.objects) {
            if (GameEngine.objects.hasOwnProperty(key)) {
                // @ts-ignore
                res.push(GameEngine.objects[key]);
            }
        }
        return res;
    }
};
