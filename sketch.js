var wallWidth = 20;
var ballSize = 20;
var paddleWidth = 16;
var paddleHeight;
var totalSpeed; //total speed for the ball
var ball;
var paddles = []; //array of paddles
var theCanvas;

var gameState = "start";

//these variables are associated with the paddle
var accel;
var decel;
var dir = 0;

var scores = [0,0];
var goalScore = 10;

function preload() { //preload the image
	// star = loadImage("images/star.png"); //Star by Setyo Ari Wibowo from the Noun Project
	// basso = loadSound("sounds/Basso.mp3");
	// tink = loadSound("sounds/Tink.mp3");
	// pop = loadSound("sounds/Pop.mp3");
}

function setup() {
	theCanvas = createCanvas(windowWidth,windowHeight);
	theCanvas.parent("#pongContainer");
	paddleHeight = height/5;
	totalSpeed = width/160;
	accel = width / 3300;
	decel = accel / 3;
	noStroke();
	ellipseMode(CENTER);
	rectMode(CENTER);
	angleMode(DEGREES);
	textAlign(CENTER, CENTER);
}

function draw() {
	switch (gameState) {
		case "start":
			gameStart();
			break;
		case "play":
			gamePlay();
			break;
		case "end":
			gameEnd();
			break;
	}
}

function gamePlay() {
	background(0);
	drawWalls();
	ball.do();
	for (var i = 0; i < paddles.length; i++) {
		paddles[i].do();
	}
	textSize(32);
	text(scores[0], 50, paddles[0].y);
	text(scores[1], width - 50, paddles[1].y);

	if (scores[0] == goalScore || scores[1] == goalScore) {
		gameState = "end"
	}
}

function gameStart() {
	background(0);
	drawWalls();
	rectMode(CENTER);

	fill(255);
	rect(width/3, height/3, 200, 200);
	rect(2*width / 3, height / 3, 200, 200);

	fill(0);
	textSize(32);
	text("1\nPlayer\n(W,S)", width / 3, height / 3);
	text("2\nPlayers\n(UP,DOWN)", 2*width / 3, height / 3);
	fill(255);
	text("Choose a mode to play", width/2, 2*height/3);
}

function gameEnd() {
	gameStart();
	text(scores[0], 50, height/2);
	text(scores[1], width - 50, height/2);
}

function mousePressed() {
	if (gameState != "play") {
		if (mouseY >= height / 3 - 100 && mouseY <= height / 3 + 100) {
			if (mouseX >= width/3 - 100 && mouseX <= width/3 + 100) {
				console.log("one player");
				scores = [0,0];
				paddles[0] = new Paddle(1);
				paddles[1] = new Paddle(0);
				ball = new Ball();
				gameState = "play";
			}
			if (mouseX >= 2*width / 3 - 100 && mouseX <= 2*width / 3 + 100) {
				console.log("two player");
				scores = [0,0];
				paddles[0] = new Paddle(1);
				paddles[1] = new Paddle(2);
				ball = new Ball();
				gameState = "play";
			}
		}
	}
}

class Ball {
	constructor() {
		this.setBall();
		this.size = ballSize;
	}

	do() {
		ellipse(this.x, this.y, this.size);
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.x < this.size/2 || this.x > width - this.size/2) {
			if (this.x < this.size/2) {
				scores[1]++;
			} else {
				scores[0]++;
			}
			this.setBall();
		}
		if (this.y < wallWidth + this.size/2 || this.y > height - wallWidth - this.size/2) {
			this.speedY *= -1;
		}

		//collision for left paddle
		if (this.x - this.size / 2 < paddleWidth && this.y > paddles[0].y - paddleHeight / 2 && this.y < paddles[0].y + paddleHeight / 2) {
			var angle = (this.y - paddles[0].y) * 70 / (paddleHeight / 2);
			this.speedY = this.totalSpeed * sin(angle);
			this.speedX = this.totalSpeed * cos(angle);
			this.x = paddleWidth + this.size / 2;
		}

		//collision for right paddle
		if (this.x + this.size / 2 > width - paddleWidth && this.y > paddles[1].y - paddleHeight / 2 && this.y < paddles[1].y + paddleHeight / 2) {
			var angle = (this.y - paddles[1].y) * 70 / (paddleHeight / 2);
			this.speedY = this.totalSpeed * sin(angle);
			this.speedX = this.totalSpeed * cos(angle) * -1;
			this.x = width - paddleWidth - this.size / 2;
		}
	}

	setBall() {
		this.totalSpeed = totalSpeed;
		var angle = random(-60, 60);
		while (angle <= 20 && angle >= -20) {
			angle = random(-60, 60);
		}
		var chooseDirection = (random()>=0.5 && paddles[1].mode == 2) ? 1 : -1; //TODO: maybe direct this towards the player if in one-player mode
		this.speedX = cos(angle) * this.totalSpeed * chooseDirection;
		this.speedY = sin(angle) * this.totalSpeed;
		this.x = width / 2;
		this.y = height / 2;
	}
}

class Paddle {
	constructor(playerNum) {
		this.mode = playerNum; // 0 is auto, 1 is player one, 2 is player 2
		switch (playerNum) {
			case 0:
			case 2:
				this.x = width - paddleWidth / 2;
				break;
			case 1:
				this.x = paddleWidth / 2;
				break;
		}
		this.y = height/2;
		this.speed = 0;
	}

	do() {
		fill(255);
		rectMode(CENTER);
		rect(this.x, this.y, paddleWidth, paddleHeight);

		switch (this.mode) {
			case 1:
				if (keyIsDown(87)) {
					this.speed -= accel;
				}
				if (keyIsDown(83)) {
					this.speed += accel;
				}
				break;
			case 2:
				if (keyIsDown(UP_ARROW)) {
					this.speed -= accel;
				}
				if (keyIsDown(DOWN_ARROW)) {
					this.speed += accel;
				}
				break;
			case 0:
				if (ball.speedX > 0) {
					if (ball.y < this.y - paddleHeight / 3) {
						this.speed -= accel / 1.3;
					}
					if (ball.y > this.y + paddleHeight / 3) {
						this.speed += accel / 1.3;
					}
				}
				break;
		}

		this.y += this.speed; //move the paddle by the current speed

		//these 2 if statements allow bouncing
		if (this.y - paddleHeight / 2 < wallWidth) {
			this.speed *= -0.35
			this.y = wallWidth + paddleHeight / 2;
		}
		if (this.y + paddleHeight / 2 > height - wallWidth) {
			this.speed *= -0.35
			this.y = height - wallWidth - paddleHeight / 2;
		}

		//the following lines determine decelleration
		if (this.speed > 0) {
			this.speed -= decel;
		} else {
			this.speed += decel;
		}
		if (abs(this.speed) <= decel) {
			this.speed = 0;
		}
	}
}

function drawWalls() { //this function draws the walls every frame
	rectMode(CORNER);
	fill(215)
	rect(0, 0, width, wallWidth);
	rect(0, height-wallWidth, width, height);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	paddleHeight = height / 5;
}

//preventing scrolling with arrow keys
window.addEventListener("keydown", function (e) {
	// space and arrow keys
	if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);