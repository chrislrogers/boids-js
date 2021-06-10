const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

class Boid {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = 'white';
        c.fill();
    }

    update() {
        this.x += (this.dx);
        this.y += (this.dy);
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
        let viewRadius = 10;
        let avgX = 0, avgY = 0;
        let neighbours = 0;

        for (let other of boids) {
            if (dist(this.x, this.y, other.x, other.y) < viewRadius) {
                avgX += other.dx;
                avgY += other.dy;
                neighbours++;
            }
        }
        if (neighbours > 0) {
            avgX = avgX / neighbours;
            avgY = avgY / neighbours;
            this.dx += (avgX - this.dx);
            this.dy += (avgY - this.dy);
        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

let boidArray = [];

for (let i = 0; i < 25; i++) {
    boidArray.push(new Boid(Math.random() * innerWidth, Math.random() * innerHeight, Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1, 10));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let boid of boidArray) {
        boid.wrap();
        boid.cohesion(boidArray);
        boid.update();
        boid.draw();
    }
}

animate();
