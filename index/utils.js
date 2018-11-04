export class Vect3 {
    constructor(x, y, z) {
        if (typeof x === 'number' || typeof x === 'undefined') {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        else {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    apply(vect3) {
        this.x = vect3.x;
        this.y = vect3.y;
        this.z = vect3.z;
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
    rotate(axis, angle) {
        let res = new Vect3(this.x, this.y, this.z);
        switch (axis) {
            case Axis.x:
                res.y += res.y * Math.cos(angle);
                res.z += res.z * Math.sin(angle);
                break;
            case Axis.y:
                res.x += res.x * Math.sin(angle);
                res.z += res.z * Math.cos(angle);
                break;
            default:
                res.x += res.x * Math.cos(angle);
                res.y += res.y * Math.sin(angle);
                break;
        }
        return res;
    }
    rotateDeg(axis, angle) {
        return this.rotate(axis, (angle / Math.PI) * 180);
    }
    floor() {
        return new Vect3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }
}
export var Axis;
(function (Axis) {
    Axis[Axis["x"] = 0] = "x";
    Axis[Axis["y"] = 1] = "y";
    Axis[Axis["z"] = 2] = "z";
})(Axis || (Axis = {}));
