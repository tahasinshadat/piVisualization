const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const center = { x: canvas.width / 2, y: canvas.height / 2 };
let angle1 = 0;
let angle2 = 0;
let radius1 = 200;
let radius2 = 200; // Set the initial radius for the second line to match the first line
let point1X, point1Y, point2X, point2Y;
const trail = []; // Store the trail positions of the blue point

// Nav Style
document.getElementById('dp').style.border = '1px solid white';

// GUI parameters
const gui = new dat.GUI({ autoPlace: false });
const guiContainer = document.getElementById('gui');
guiContainer.appendChild(gui.domElement);

const parameters = {
  speed: 0.1
};

gui.add(parameters, 'speed', 0.1, 1).name('Speed');

function vizualize() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Adjust alpha value to control trail fading effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate the position of the first moving point
    point1X = center.x + radius1 * Math.cos(angle1);
    point1Y = center.y + radius1 * Math.sin(angle1);

    // Calculate the position of the second moving point
    point2X = point1X + radius2 * Math.cos(angle2);
    point2Y = point1Y + radius2 * Math.sin(angle2);

    // Calculate the angle between the two lines
    const angleDiff = Math.atan2(point2Y - point1Y, point2X - point1X);

    // Calculate the corrected position of the second moving point based on the angle difference
    point2X = point1X + radius2 * Math.cos(angle2 + angleDiff);
    point2Y = point1Y + radius2 * Math.sin(angle2 + angleDiff);

    // Store the current position in the trail array
    trail.push({ x: point2X, y: point2Y });

    // Draw the trail for the blue point
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
    }
    ctx.stroke();

    // Draw the second moving point
    ctx.fillStyle = '#00cafb';
    ctx.fillRect(point2X - 2, point2Y - 2, 4, 4);

    // Update angles for both lines
    angle1 += parameters.speed * 2 * 0.01;
    angle2 += parameters.speed * 2 * 0.05; // Adjust speed using parameters.speed

    // Check if the circular pattern is about to complete
    const diff = Math.abs(angle1 - angle2) % (Math.PI); // THIS CHECKS THE RATIONALITY
    if (diff < 0.05) {
        angle1 -= parameters.speed * 2 * 0.01; // Stop the first line just before completing the circle
    }

    // Draw the central point
    ctx.fillStyle = 'white';
    ctx.fillRect(center.x - 2, center.y - 2, 4, 4);

    // Draw the line from the center to the first moving point
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(point1X, point1Y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();

    // Draw the first moving point
    ctx.fillStyle = 'red';
    ctx.fillRect(point1X - 2, point1Y - 2, 4, 4);

    // Draw the line from the first moving point to the second moving point
    ctx.beginPath();
    ctx.moveTo(point1X, point1Y);
    ctx.lineTo(point2X, point2Y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.stroke();

    requestAnimationFrame(vizualize);
}

// Initiate animation
vizualize();
