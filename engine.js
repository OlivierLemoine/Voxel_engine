export class Object {
    constructor() {
        this.shape = [];
        this.position = new Vect3();
        this.id = GameEngine.add(this);
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
    constructor() {
        this.position = new Vect3();
        this.viewField = [100, 100];
        this.backPoint = new Vect3(-100, 50, 50);
    }
    render(context) {
        context.imageSmoothingEnabled = false;
        let obj = GameEngine.objectsList();
        let img = context.createImageData(this.viewField[0], this.viewField[1]);
        for (let pixel = 0; pixel < img.data.length; pixel += 4) {
            let pixelPos = new Vect3(0, (pixel / 4) % this.viewField[0], Math.floor(pixel / 4 / this.viewField[0]));
            let directionVector = pixelPos
                .sub(this.backPoint)
                .normalize();
            let closest = Infinity;
            for (let object = 0; object < obj.length; object++) {
                for (let voxel = 0; voxel < obj[object].shape.length; voxel++) {
                    let voxelPos = obj[object].shape[voxel].getPosition();
                    let tx = [
                        voxelPos.x / directionVector.x - this.position.x || 0,
                        (voxelPos.x + 1) / directionVector.x -
                            this.position.x || 0
                    ];
                    let ty = [
                        voxelPos.y / directionVector.y - this.position.y || 0,
                        (voxelPos.y + 1) / directionVector.y -
                            this.position.y || 0
                    ];
                    let txy = [NaN, NaN];
                    if (tx[0] <= ty[0] && ty[0] <= tx[1])
                        txy[0] = isNaN(txy[0])
                            ? ty[0]
                            : Math.max(ty[0], txy[0]);
                    if (tx[0] <= ty[1] && ty[1] <= tx[1])
                        txy[1] = isNaN(txy[1])
                            ? ty[1]
                            : Math.max(ty[1], txy[1]);
                    if (ty[0] <= tx[0] && tx[0] <= ty[1])
                        txy[0] = isNaN(txy[0])
                            ? tx[0]
                            : Math.max(tx[0], txy[0]);
                    if (ty[0] <= tx[1] && tx[1] <= ty[1])
                        txy[1] = isNaN(txy[1])
                            ? tx[1]
                            : Math.max(tx[1], txy[1]);
                    if (isNaN(txy[0]) || isNaN(txy[1])) {
                        continue;
                    }
                    let tz = [
                        voxelPos.z / directionVector.z - this.position.z || 0,
                        (voxelPos.z + 1) / directionVector.z -
                            this.position.z || 0
                    ];
                    let txyz = [NaN, NaN];
                    if (txy[0] <= tz[0] && tz[0] <= txy[1])
                        txyz[0] = isNaN(txy[0])
                            ? tz[0]
                            : Math.max(tz[0], txy[0]);
                    if (txy[0] <= tz[1] && tz[1] <= txy[1])
                        txyz[1] = isNaN(txy[1])
                            ? tz[1]
                            : Math.max(tz[1], txy[1]);
                    if (tz[0] <= txy[0] && txy[0] <= tz[1])
                        txyz[0] = isNaN(txy[0])
                            ? txy[0]
                            : Math.max(txy[0], txy[0]);
                    if (tz[0] <= txy[1] && txy[1] <= tz[1])
                        txyz[1] = isNaN(txy[1])
                            ? txy[1]
                            : Math.max(txy[1], txy[1]);
                    if (!isNaN(txyz[0]) && !isNaN(txyz[1])) {
                        const min = Math.min(txy[0], txyz[0]);
                        if (closest === Infinity || closest > min) {
                            closest = min;
                            img.data[pixel + 0] =
                                obj[object].shape[voxel].color.x;
                            img.data[pixel + 1] =
                                obj[object].shape[voxel].color.y;
                            img.data[pixel + 2] =
                                obj[object].shape[voxel].color.z;
                            img.data[pixel + 3] = 255;
                        }
                    }
                }
            }
        }
        return img;
    }
}
class Voxel {
    constructor(parent, pos) {
        this.color = new Vect3(255, 255, 255);
        this.parent = parent;
        this.position = pos || new Vect3();
    }
    getPosition() {
        return this.position.add(this.parent.position);
    }
}
class NestedVoxel {
}
export class Vect3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    add(vect3) {
        let res = new Vect3(this.x + vect3.x, this.y + vect3.y, this.z + vect3.z);
        return res;
    }
    sub(vect3) {
        let res = new Vect3(this.x - vect3.x, this.y - vect3.y, this.z - vect3.z);
        return res;
    }
    dot(vect3) {
        let res = new Vect3(this.x * vect3.x, this.y * vect3.y, this.z * vect3.z);
        return res;
    }
    divide(vect3) {
        vect3 =
            typeof vect3 === 'number' ? new Vect3(vect3, vect3, vect3) : vect3;
        let res = new Vect3(this.x / vect3.x, this.y / vect3.y, this.z / vect3.z);
        return res;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        return this.divide(this.magnitude());
    }
}
let GameEngine = {
    id: 0,
    objects: {},
    camera: new Camera(),
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
