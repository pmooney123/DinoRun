//Canvas set up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800;
canvas.height = 700;
const C = {
    gravity: -0.02,
}
let score = 0;
let gameFrame = 0;
let gameSpeed = 0;
ctx.font = '50px Georgia';

//Mouse and Key position
var leftPressed = false
var rightPressed = false
var upPressed = false
var downPressed = false

function keyDownHandler(e) {
    if ("code" in e) {
        switch(e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = true;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = true;
                return;
            case "ArrowUp":
            case "Up": // IE <= 9 and FF <= 36
            case "KeyW":
                upPressed = true;
                return;
            case "ArrowDown":
            case "Down": // IE <= 9 and FF <= 36
            case "KeyS":
                downPressed = true;
                return;
            case "KeyX":
                xPressed = true;
                return;
            case "Space":
                spacePressed = true;
                return;

            default:
                return;
        }
    }

    if(e.keyCode == 32) {
        spacePressed = true;
    }
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    if(e.keyCode == 40) {
        downPressed = true;
    }
    else if(e.keyCode == 38) {
        upPressed = true;
    }
}
function keyUpHandler(e) {
    if ("code" in e) {
        switch(e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = false;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = false;
                return;
            case "ArrowUp":
            case "Up": // IE <= 9 and FF <= 36
            case "KeyW":
                upPressed = false;
                return;
            case "ArrowDown":
            case "Down": // IE <= 9 and FF <= 36
            case "KeyS":
                downPressed = false;
                return;
            case "KeyX":
                xPressed = false;
                return;
            case "Space":
                spacePressed = false;
                return;
            default:
                return;
        }
    }

    if(e.keyCode == 32) {
        spacePressed = false;
    }
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    if(e.keyCode == 40) {
        downPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event) {
    let canvasPosition = canvas.getBoundingClientRect();
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse.x + ' ' + mouse.y)

})
canvas.addEventListener('mouseup', function(event) {
    mouse.click = false;
})
//Player
const playerLeft = new Image();
playerLeft.src = 'src/fish_sprite_left.png';

const floorPieceArray = [];
class FloorPiece {
    constructor() {
        this.x1 = 0;
        this.x2 = 500;

        this.y1 = 400;
        this.y2 = 500;

        this.color = 'green';
    }
    update() {

    }
    isCollided(x, y) {
        let slope = (this.y2 - this.y1)/(this.x2 - this.x1);
        let yHere = (slope * (x - this.x2)) + this.y2;
        if (this.x1 < player.x && this.x2 > player.x) {
            if (yHere - player.height/2 < y) {
                return true;
            } else {
                return false;
            }
        }

    }
    draw () {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.moveTo((this.x1 - camera.x - 1), canvas.height - camera.y);
        ctx.lineTo((this.x1 - camera.x - 1), this.y1 - camera.y);
        ctx.lineTo(this.x2 - camera.x, this.y2 - camera.y);
        ctx.lineTo(this.x2 - camera.x, canvas.height - camera.y);
        ctx.closePath();
        ctx.fill();
    }
}
const floor = new FloorPiece();
class Camera {
    constructor() {
        this.x = 100;
        this.y = 100;

    }
    moveTo(x, y) {
        this.x = x - canvas.width/2;
        this.y = y - canvas.height/2;
        if (this.y > 0) {
            this.y = 0;
        }
    }
    moveBy(x, y) {
        this.x += x;
        this.y += y;
    }
}
const camera = new Camera();
class Player {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;

        this.motionX = 5;
        this.motionY = 0;

        this.width = 20;
        this.height = 20;

        this.radius = 30;
        this.angle = 100;

        this.grounded = true;

        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;

        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        if (rightPressed) {
            this.motionX = 3;
        } else
        if (leftPressed) {
            this.motionX = -3;
        } else {
            this.motionX = 0;
        }


        const dx = this.x - (mouse.x + camera.x);
        const dy = this.y - (mouse.y + camera.y);
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        if (upPressed && this.grounded) {
            this.motionY = 2;
        }
        this.motionY += C.gravity;

        this.x += this.motionX;
        this.y -= this.motionY;

        let hitGround = false;
        for (let i = 0; i < floorPieceArray.length; i++) {
            while (floorPieceArray[i].isCollided(this.x, this.y)) {
                this.y -= .01;
                this.motionY = 0;
                hitGround = true;
            }
        }
        if (hitGround) {
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        gameSpeed = this.motionX;
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x- camera.x, this.y - camera.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x - player.width/2 - camera.x, player.y - player.height/2 - camera.y, player.width, player.height);
                /*
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);
        ctx.rotate(this.angle);

        if (this.x <= (mouse.x + camera.x)) {
            ctx.drawImage(playerRight,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 60,
                0 - 45,
                this.spriteWidth/4,
                this.spriteHeight/4,
                )
        } else {
            ctx.drawImage(playerLeft,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0 - 60,
                0 - 45,
                this.spriteWidth/4,
                this.spriteHeight/4,
                )
        }
        ctx.restore();
        */
    }

}
const player = new Player();
class Meteor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.motionY = getRandomIntBtwn(2, -6);
        this.motionX = getRandomIntBtwn(3, 5);
        this.width = 40;
        this.height = 40;
        this.color = 'black';
    }
    update() {
        this.motionY += C.gravity;
        this.x += this.motionX;
        this.y -= this.motionY;
    }
    isCollided() {
        let rect1 = {
            x: player.x - player.width/2,
            y: player.y - player.height/2,
            w: player.width,
            h: player.height,
        };
        let rect2 = {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            w: this.width,
            h: this.height,
        };
        if (rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.h + rect1.y > rect2.y) {
            this.color = 'white';
        }
    }
    isOutOfBounds() {

    }
    draw() {
        this.isCollided();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2 - camera.x, this.y - this.height/2 - camera.y, this.width, this.height);
    }
}
class Layer {
    constructor(speedModifier, color, maxHeight, minHeight, maxWidth, minWidth, maxDeltaHeight, minDeltaHeight) {
        this.speedModifier = speedModifier;
        this.color = color;
        this.pieceArray = [];
        let numberOfFloors = 150;
        let oldx2 = 0;
        let oldy2 = minHeight;

        for (let i = 0; i < numberOfFloors; i++) {
            this.pieceArray.push(new FloorPiece());
            this.pieceArray[i].x1 = oldx2;
            this.pieceArray[i].y1 = oldy2;

            let diffy = getRandomIntBtwn(maxDeltaHeight, minDeltaHeight);
            if (oldy2 + diffy > maxHeight || oldy2 - diffy < minHeight) {
                diffy *= -1;
            }

            this.pieceArray[i].x2 = oldx2 + getRandomIntBtwn(maxWidth, minWidth);
            this.pieceArray[i].y2 = oldy2 + diffy;

            oldx2 = this.pieceArray[i].x2;
            oldy2 = this.pieceArray[i].y2;
        }

    }
    update() {
        for (let i = 0; i < this.pieceArray.length; i++) {
            this.pieceArray[i].x1 -= gameSpeed * this.speedModifier;
            this.pieceArray[i].x2 -= gameSpeed * this.speedModifier;
        }
    }
    draw() {
        for (let i = 0; i < this.pieceArray.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.moveTo((this.pieceArray[i].x1 - 1), canvas.height);
            ctx.lineTo((this.pieceArray[i].x1 - 1), this.pieceArray[i].y1);
            ctx.lineTo(this.pieceArray[i].x2, this.pieceArray[i].y2);
            ctx.lineTo(this.pieceArray[i].x2, canvas.height);
            ctx.closePath();
            ctx.fill();
        }

    }
}
//speedmod, color, maxheight, minheight, maxwidth, minwidth, maxdheight, mindheigt
const layer1 = new Layer(0.05, '#7FFFD4', canvas.height - 350, canvas.height - 450, 100, 50, 50, -50);
const layer2 = new Layer(0.1, '#556B2F', canvas.height - 250, canvas.height - 350, 100, 75, 50, -50);
const layer3 = new Layer(0.5, '#009900', canvas.height - 150, canvas.height - 250, 200, 100, 50, -50);
const meteorArray = [];
//Bubble behavior
const bubbleArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 40;
        this.speed = Math.random() * 5 + 1;
        this.distance = 0;
        this.counted = false;
        this.sound = Math.random() > 0.5 ? 'sound1' : 'sound2';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw() {
        ctx.drawImage(bubbleImg,
            this.x - 25,
            this.y - 25,
            50,
            50,
        )
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'src/bubbles-single1.wav';

function getRandomIntBtwn(max, min) {
    return (Math.floor(Math.random() * (max - min)) + min);
}
function createFloors() {
    let numberOfFloors = 50;
    let maxHeight = canvas.height - 20;
    let minHeight = canvas.height - 100;
    let maxWidth = 800;
    let minWidth = 200;
    let maxDeltaHeight = 100;
    let minDeltaHeight = -100;

    let oldx2 = 0;
    let oldy2 = minHeight;

    for (let i = 0; i < numberOfFloors; i++) {
        floorPieceArray.push(new FloorPiece());
        floorPieceArray[i].x1 = oldx2;
        floorPieceArray[i].y1 = oldy2;

        let diffy = getRandomIntBtwn(maxDeltaHeight, minDeltaHeight);
        if (oldy2 + diffy > maxHeight || oldy2 - diffy < minHeight) {
            diffy *= -1;
        }

        floorPieceArray[i].x2 = oldx2 + getRandomIntBtwn(maxWidth, minWidth);
        floorPieceArray[i].y2 = oldy2 + diffy;

        oldx2 = floorPieceArray[i].x2;
        oldy2 = floorPieceArray[i].y2;
    }
}
function handleBubbles() {
    if (gameFrame % 50 == 0) {
        //bubbleArray.push(new Bubble());
    }
}
function spawnMeteors() {
    if (gameFrame % 30 == 0) {
        meteorArray.push(new Meteor(player.x - canvas.width/2, player.y- canvas.height/2));
    }
}
//Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //refresh screen
    ctx.fillStyle ='blue';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    gameFrame++;

    //layers
    layer1.update();
    layer1.draw();

    layer2.update();
    layer2.draw();

    layer3.update();
    layer3.draw();

    player.update();
    camera.moveTo(player.x, player.y);

    for (let i = 0; i < meteorArray.length; i++) {
        meteorArray[i].update();
        meteorArray[i].draw();

        if (meteorArray[i].y > canvas.height) {
            meteorArray.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < floorPieceArray.length; i++) {
        floorPieceArray[i].update();
        floorPieceArray[i].draw();

    } //draw and update floor pieces

    spawnMeteors();


    handleBubbles(); //spawn bubbles

    for (let i = 0; i < bubbleArray.length; i++) {
        bubbleArray[i].update();
        bubbleArray[i].draw();
        if ((bubbleArray[i].distance < bubbleArray[i].radius + player.radius) && !bubbleArray[i].counted) {
            if (bubbleArray[i].sound == 'sound1') {
                bubblePop1.play();
            } else {
                bubblePop2.play();
            }
            console.log('collission1!!');
            bubbleArray[i].counted = true;
            score++;
        }
        if (bubbleArray[i].y < 0 || bubbleArray[i].counted) {
            bubbleArray.splice(i, 1);
            i--;
        }
    }//draw and update BUBBLES

    player.draw();
    //GUI
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + gameSpeed, 10, 50);
    requestAnimationFrame(animate);
}

createFloors();
animate();

//added floor, floor collision detection and response, and arrow-key movement.

//to do: (Decor): Parallax backgrounds, sky, water. Particles. Sprites.
//to do: (GUI): Score, stats, minimap, rendering
//to do: (Game): Enemies, Meteor wall, Lava, Trees, fruits, bonuses, eggs, levels.
//to do: (controls): pause, sprinting, attack/eat.
