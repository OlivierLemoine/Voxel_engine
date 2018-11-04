import './gpu.js';
export let create = (canvas, imageSize) => {
    //@ts-ignore
    const gpu = new GPU({
        canvas,
        webGl: canvas.getContext('webgl')
    });
    return gpu
        .createKernel(function (cameraPos, pixels, voxels, nbVoxel) {
        let pixel_x = pixels[this.thread.x][this.thread.y][0];
        let pixel_y = pixels[this.thread.x][this.thread.y][1];
        let pixel_z = pixels[this.thread.x][this.thread.y][2];
        let distance = Math.sqrt(pixel_x * pixel_x + pixel_y * pixel_y + pixel_z * pixel_z);
        pixel_x /= distance;
        pixel_y /= distance;
        pixel_z /= distance;
        let closest = this.constants.max_value;
        for (let i = 0; i < nbVoxel; i++) {
            let tx_a = this.constants.max_value;
            let tx_b = this.constants.max_value;
            let ty_a = this.constants.max_value;
            let ty_b = this.constants.max_value;
            if (pixel_x !== 0)
                tx_a = voxels[i][0] / pixel_x - cameraPos[0];
            if (pixel_x !== 0)
                tx_b = (voxels[i][0] + 1) / pixel_x - cameraPos[0];
            if (tx_b < tx_a) {
                let tmp = tx_a;
                tx_a = tx_b;
                tx_b = tmp;
            }
            if (pixel_y !== 0)
                ty_a = voxels[i][1] / pixel_y - cameraPos[1];
            if (pixel_y !== 0)
                ty_b = (voxels[i][1] + 1) / pixel_y - cameraPos[1];
            if (ty_b < ty_a) {
                let tmp = ty_a;
                ty_a = ty_b;
                ty_b = tmp;
            }
            let is_good = 0;
            let t_low = 0;
            let t_high = 0;
            if (tx_a <= ty_a && ty_a <= tx_b) {
                is_good++;
                t_low = ty_a;
            }
            if (tx_a <= ty_b && ty_b <= tx_b) {
                is_good++;
                t_high = ty_b;
            }
            if (ty_a <= tx_a && tx_a <= ty_b) {
                is_good++;
                t_low = tx_a;
            }
            if (ty_a <= tx_b && tx_b <= ty_b) {
                is_good++;
                t_high = tx_b;
            }
            if (is_good < 2)
                continue;
            let tz_a = this.constants.max_value;
            let tz_b = this.constants.max_value;
            if (pixel_z !== 0)
                tz_a = voxels[i][0] / pixel_z - cameraPos[2];
            if (pixel_z !== 0)
                tz_b = (voxels[i][0] + 1) / pixel_z - cameraPos[2];
            if (tz_b < tz_a) {
                let tmp = tz_a;
                tz_a = tz_b;
                tz_b = tmp;
            }
            is_good = 0;
            let t_pos = 0;
            if (t_low <= tz_a && tz_a <= t_high) {
                is_good++;
                t_pos = tz_a;
            }
            if (t_low <= tz_b && tz_b <= t_high) {
                is_good++;
            }
            if (tz_a <= t_low && t_low <= tz_b) {
                is_good++;
                t_pos = t_low;
            }
            if (tz_a <= t_high && t_high <= tz_b) {
                is_good++;
            }
            2;
            if (is_good > 1) {
                closest = t_pos;
                this.color(voxels[i][3], voxels[i][4], voxels[i][5], 1);
            }
        }
    }, {
        constants: { max_value: Number.MAX_VALUE },
        loopMaxIterations: 10000000
    })
        .setOutput([imageSize[0], imageSize[1]])
        .setGraphical(true);
};
