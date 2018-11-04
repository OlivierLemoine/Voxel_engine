export class Vect3 {
    x: number;
    y: number;
    z: number;

    constructor(x?: number | number[], y?: number, z?: number) {
        if (typeof x === 'number' || typeof x === 'undefined') {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        } else {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
    }

    toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    apply(vect3: Vect3) {
        this.x = vect3.x;
        this.y = vect3.y;
        this.z = vect3.z;
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

    rotate(axis: Axis, angle: number): Vect3 {
        let res = new Vect3(this.x, this.y, this.z);
        switch (axis) {
            case Axis.x:
                res.y = this.magnitude() * Math.cos(angle);
                res.z = this.magnitude() * Math.sin(angle);
                break;
            case Axis.y:
                res.z = this.magnitude() * Math.cos(angle);
                res.x = this.magnitude() * Math.sin(angle);
                break;
            default:
                res.x = this.magnitude() * Math.cos(angle);
                res.y = this.magnitude() * Math.sin(angle);
                break;
        }
        return res;
    }

    rotateDeg(axis: Axis, angle: number): Vect3 {
        return this.rotate(axis, (angle / 180) * Math.PI);
    }

    floor(): Vect3 {
        return new Vect3(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.z)
        );
    }

    // rotateBase(vect3: Vect3): Vect3 {}
}

export enum Axis {
    x = 0,
    y = 1,
    z = 2
}
