export class Object {
    private id: number;
    readonly shape: Voxel[] = [];
    position: Vect3 = new Vect3();
    constructor() {
        this.id = GameEngine.add(this);
    }
}

export class Cube extends Object {
    constructor(size?: Vect3) {
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
    position: Vect3 = new Vect3();
    viewField: number[] = [100, 100];
    backPoint: Vect3 = new Vect3(-100, 50, 50);

    render(context: CanvasRenderingContext2D): ImageData {
        context.imageSmoothingEnabled = false;
        let obj: Object[] = GameEngine.objectsList();
        let img: ImageData = context.createImageData(
            this.viewField[0],
            this.viewField[1]
        );
        for (let pixel = 0; pixel < img.data.length; pixel += 4) {
            let pixelPos: Vect3 = new Vect3(
                0,
                (pixel / 4) % this.viewField[0],
                Math.floor(pixel / 4 / this.viewField[0])
            );
            let directionVector: Vect3 = pixelPos
                .sub(this.backPoint)
                .normalize();
            let closest: number = Infinity;
            for (let object = 0; object < obj.length; object++) {
                for (let voxel = 0; voxel < obj[object].shape.length; voxel++) {
                    let voxelPos: Vect3 = obj[object].shape[
                        voxel
                    ].getPosition();
                    let tx: number[] = [
                        voxelPos.x / directionVector.x - this.position.x || 0,
                        (voxelPos.x + 1) / directionVector.x -
                            this.position.x || 0
                    ];
                    let ty: number[] = [
                        voxelPos.y / directionVector.y - this.position.y || 0,
                        (voxelPos.y + 1) / directionVector.y -
                            this.position.y || 0
                    ];

                    let txy: number[] = [NaN, NaN];

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

                    let tz: number[] = [
                        voxelPos.z / directionVector.z - this.position.z || 0,
                        (voxelPos.z + 1) / directionVector.z -
                            this.position.z || 0
                    ];

                    let txyz: number[] = [NaN, NaN];

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
    private parent: Object;
    private position: Vect3;
    color: Vect3 = new Vect3(255, 255, 255);
    constructor(parent: Object, pos?: Vect3) {
        this.parent = parent;
        this.position = pos || new Vect3();
    }

    getPosition(): Vect3 {
        return this.position.add(this.parent.position);
    }
}

class NestedVoxel {}

export class Vect3 {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(vect3: Vect3): Vect3 {
        let res: Vect3 = new Vect3(
            this.x + vect3.x,
            this.y + vect3.y,
            this.z + vect3.z
        );
        return res;
    }

    sub(vect3: Vect3): Vect3 {
        let res: Vect3 = new Vect3(
            this.x - vect3.x,
            this.y - vect3.y,
            this.z - vect3.z
        );
        return res;
    }

    dot(vect3: Vect3): Vect3 {
        let res: Vect3 = new Vect3(
            this.x * vect3.x,
            this.y * vect3.y,
            this.z * vect3.z
        );
        return res;
    }

    divide(vect3: Vect3 | number): Vect3 {
        vect3 =
            typeof vect3 === 'number' ? new Vect3(vect3, vect3, vect3) : vect3;
        let res: Vect3 = new Vect3(
            this.x / vect3.x,
            this.y / vect3.y,
            this.z / vect3.z
        );
        return res;
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vect3 {
        return this.divide(this.magnitude());
    }
}

let GameEngine = {
    id: 0,
    objects: {},
    camera: new Camera(),
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
