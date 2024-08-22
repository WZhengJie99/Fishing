const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const fishButton = document.getElementById('fish-button');
const fishingMessage = document.getElementById('fishing-message');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];
const jellyfish = [];
const fishes = [];

function drawFish(fish) {
    context.beginPath();
    
    // Draw the fish body
    context.moveTo(fish.x - fish.size, fish.y); // Start at the left side of the fish
    context.lineTo(fish.x, fish.y - fish.size / 2); // Top fin
    context.lineTo(fish.x + fish.size, fish.y); // Right side
    context.lineTo(fish.x, fish.y + fish.size / 2); // Bottom fin
    context.closePath(); // Close the path to create the fish body

    // Draw the tail based on direction
    const tailWidth = fish.size * 1.5; // Tail width relative to fish size
    const tailHeight = fish.size / 2; // Tail height relative to fish size

    if (fish.direction === 1) {
        // Fish moving right
        context.lineTo(fish.x - fish.size, fish.y); // Continue from the end of the fish body
        context.lineTo(fish.x - fish.size - tailWidth, fish.y - tailHeight); // Top of the tail
        context.lineTo(fish.x - fish.size - tailWidth, fish.y + tailHeight); // Bottom of the tail
        context.lineTo(fish.x - fish.size, fish.y); // Back to the end of the fish body
    } else {
        // Fish moving left
        context.lineTo(fish.x + fish.size, fish.y); // Continue from the end of the fish body
        context.lineTo(fish.x + fish.size + tailWidth, fish.y - tailHeight); // Top of the tail
        context.lineTo(fish.x + fish.size + tailWidth, fish.y + tailHeight); // Bottom of the tail
        context.lineTo(fish.x + fish.size, fish.y); // Back to the end of the fish body
    }

    context.closePath();
    context.fillStyle = fish.color;
    context.fill();
}

function drawJellyfish(j) {
    context.beginPath();
    
    // Bell
    const capHeight = j.bellRadius * 0.6;
    context.arc(j.x, j.y - capHeight / 2, j.bellRadius, 0, Math.PI, true);

    const waves = 10;
    const waveAmplitude = 5;
    for (let i = 0; i <= waves; i++) {
        const waveX = j.x - j.bellRadius + (j.bellRadius * 2 * i) / waves;
        const waveY = j.y - capHeight / 2 + Math.sin(i / waves * Math.PI) * waveAmplitude;
        if (i === 0) {
            context.moveTo(waveX, waveY);
        } else {
            context.lineTo(waveX, waveY);
        }
    }
    context.lineTo(j.x + j.bellRadius, j.y - capHeight / 2);
    context.closePath();
    context.fillStyle = j.color;
    context.fill();

    // Tentacles
    context.strokeStyle = j.color;
    context.lineWidth = 2;
    for (let i = 0; i < j.tentacles; i++) {
        context.beginPath();
        const angle = (i / j.tentacles) * Math.PI * 2;
        const x = j.x + Math.cos(angle) * j.bellRadius;
        const y = j.y + Math.sin(angle) * j.bellRadius;

        // Curly effect
        const tentacleLength = j.tentacleLength;
        const numWaves = 5;
        const waveAmplitude = 5;
        const waveLength = tentacleLength / numWaves;
        
        context.moveTo(x, y);
        for (let t = 0; t < tentacleLength; t++) {
            const waveX = x + Math.sin(t / waveLength * Math.PI) * waveAmplitude;
            const waveY = y + t;
            context.lineTo(waveX, waveY);
        }
        context.stroke();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // bubbles
    for (const bubble of bubbles) {
        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.4)';
        context.fill();
    }

    // jellyfish
    for (const j of jellyfish) {
        drawJellyfish(j);
    }
    
    // Draw fishes
    for (const fish of fishes) {
        drawFish(fish);
    }

    const bucketRect = document.getElementById('bucket').getBoundingClientRect();
    const bucketX = bucketRect.left;
    const bucketY = bucketRect.top;
    const bucketWidth = bucketRect.width;
    const bucketHeight = bucketRect.height;

    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.fillRect(bucketX, bucketY, bucketWidth, bucketHeight);
}

function animateBubbles() {
    for (const bubble of bubbles) {
        bubble.y -= bubble.speed;
        if (bubble.y + bubble.radius < 0) {
            bubble.y = canvas.height + bubble.radius;
        }
    }
}

function createBubble() {
    const radius = Math.random() * 5 + 2;
    bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + radius,
        radius: radius,
        speed: Math.random() * 2 + 1
    });
}

function createJellyfish() {
    const bellRadius = Math.random() * 20 + 10;
    const minTentacles = 6;
    const maxTentacles = 12;
    const minTentacleLength = 60;
    const maxTentacleLength = 90;
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`;

    jellyfish.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        bellRadius: bellRadius,
        tentacleLength: Math.random() * (maxTentacleLength - minTentacleLength) + minTentacleLength,
        tentacles: Math.floor(Math.random() * (maxTentacles - minTentacles + 1)) + minTentacles,
        speed: Math.random() * 1 + 0.5,
        color: color
    });
}


function animateJellyfish() {
    for (const j of jellyfish) {
        j.y -= j.speed;
        if (j.y + j.bellRadius < 0) {
            j.y = canvas.height + j.bellRadius;
            j.x = Math.random() * canvas.width;
        }
    }
}

function createFish() {
    const size = Math.random() * 10 + 10; // Random size for the fish
    const speed = Math.random() * 2 + 1; // Random speed for the fish
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const direction = Math.random() > 0.5 ? 1 : -1; // Random direction (left or right)
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`;

    fishes.push({
        x: x,
        y: y,
        size: size,
        color: color,
        speed: speed,
        direction: direction
    });
}

function animateFish() {
    for (const fish of fishes) {
        fish.x += fish.speed * fish.direction;
        if (fish.x > canvas.width + fish.size) {
            fish.x = -fish.size;
            fish.y = Math.random() * canvas.height;
        } else if (fish.x < -fish.size) {
            fish.x = canvas.width + fish.size;
            fish.y = Math.random() * canvas.height;
        }
    }
}

function fish() {
    fishButton.style.display = 'none';
    fishingMessage.innerText = 'Fishing...';
    fishingMessage.style.display = 'block';

    // fishing rod concept
    /*
    const startX = getRandomIntInclusive(canvas.width / 3, canvas.width / 2);
    const startY = 0;
    const endX = canvas.width / 2;
    const endY = canvas.height / 2;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    context.beginPath();
    context.arc(endX, endY, 2, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.arc(endX, endY + 10, 10, -Math.PI, Math.PI/15);
    context.lineTo(endX - 10, endY + 10);
    context.lineTo(endX + 10, endY + 10);
    context.fillStyle = 'red';
    context.fill();
    */

    setTimeout(() => {
        fishingMessage.innerText = 'You caught nothing.';

        setTimeout(() => {
            fishingMessage.style.display = 'none';
            fishButton.style.display = 'block';
            draw();
        }, 1500);
    }, 3000);
}

function animate() {
    draw();
    animateBubbles();
    animateJellyfish();
    animateFish();
    requestAnimationFrame(animate);
}

fishButton.addEventListener('click', fish);

setInterval(createBubble, 4000);
setInterval(createJellyfish, 9000);
setInterval(createFish, 8000);

animate();

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

let idleSeconds = 0;

function updateIdleSeconds() {
    idleSeconds++;
    document.getElementById('idle-count').textContent = idleSeconds;
}

// Update idle seconds every second
setInterval(updateIdleSeconds, 1000);