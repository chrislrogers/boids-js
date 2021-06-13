const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const cohesionSlider = document.getElementById("cohesion");
const separationSlider = document.getElementById("separation");
const alignSlider = document.getElementById("align");

let boidAmount = 50;

let cohesionRadius = 100;
let separationRadius = 50;
let alignRadius = 100;

class Boid {
    constructor(x, y, dx, dy, ax, ay, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.ax = ax;
        this.ay = ay;
        this.radius = radius;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = 'white';
        c.fill();
    }

    flock(boids) {
        let align = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        this.ax += align[0];
        this.ay += align[1];
        this.ax += cohesion[0];
        this.ay += cohesion[1];
        this.ax += separation[0];
        this.ay += separation[1];
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dx += this.ax;
        this.dy += this.ay;
        this.ax = 0;
        this.ay = 0;
    }

    limit() {
        let vlim = 2;
        if (this.dx > vlim) {
            this.dx = (this.dx / this.dx) * vlim;
        }
        if (this.dx < -vlim) {
            this.dx = (this.dx / this.dx) * -vlim;
        }
        if (this.dy > vlim) {
            this.dy = (this.dy / this.dy) * vlim;
        }
        if (this.dy < -vlim) {
            this.dy = (this.dy / this.dy) * -vlim;
        }
    }

    wrap() {
        if (this.x > window.innerWidth) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = window.innerWidth;
        }
        if (this.y > window.innerHeight) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = window.innerHeight;
        }
    }

    cohesion(boids) {
        let avgX = 0, avgY = 0;
        let neighbours = 0;

        for (let other of boids) {
            if (dist(this.x, this.y, other.x, other.y) < cohesionRadius) {
                avgX += other.dx;
                avgY += other.dy;
                neighbours++;
            }
        }
        if (neighbours > 0) {
            avgX = avgX / neighbours;
            avgY = avgY / neighbours;
            return [(avgX - this.dx), (avgY - this.dy)];
        }
    }

    separation(boids) {
        let avgX = 0, avgY = 0;
        let neighbours = 0;

        for (let other of boids) {
            if (dist(this.x, this.y, other.x, other.y) < separationRadius) {
                let diffx, diffy;
                diffx = this.x - other.x;
                diffy = this.y - other.y;
                let d = dist(this.x, this.y, other.x, other.y);
                if (d !== 0) {
                    diffx = diffx / d;
                    diffy = diffy / d;
                    avgX += diffx;
                    avgY += diffy;
                }
                neighbours++;
            }
        }
        if (neighbours > 0) {
            avgX = avgX / neighbours;
            avgY = avgY / neighbours;
            return [avgX, avgY];
        }
    }

    align(boids) {
        let avgX = 0, avgY = 0;
        let neighbours = 0;

        for (let other of boids) {
            if (dist(this.x, this.y, other.x, other.y) < alignRadius) {
                avgX += other.x;
                avgY += other.y;
                neighbours++;
            }
        }
        if (neighbours > 0) {
            avgX = avgX / neighbours;
            avgY = avgY / neighbours;
            return [(avgX - this.x) / 100, (avgY - this.y) / 100];
        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

alignSlider.oninput = function () {
    alignRadius = this.value;
}

cohesionSlider.oninput = function () {
    cohesionRadius = this.value;
}

separationSlider.oninput = function () {
    separationRadius = this.value;
}

let boidArray = [];

for (let i = 0; i < boidAmount; i++) {
    boidArray.push(new Boid(Math.random() * innerWidth, Math.random() * innerHeight, Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1, 0, 0, 10));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let boid of boidArray) {
        boid.wrap();
        boid.flock(boidArray);
        boid.update();
        boid.limit();
        boid.draw();
    }
}

animate();
