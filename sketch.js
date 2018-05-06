var wallWidth = 20;
var ballSize = 20;
var totalSpeed = 5;
var ball;

var gameState = "play";

//these variables are associated with the paddle
var paddleX = 250;
var speed = 0;
var accel = 0.24;
var decel = 0.08;
var dir = 0;

var points = 0;
var misses = 0;

function preload() { //preload the image
	// star = loadImage("images/star.png"); //Star by Setyo Ari Wibowo from the Noun Project
	// basso = loadSound("sounds/Basso.mp3");
	// tink = loadSound("sounds/Tink.mp3");
	// pop = loadSound("sounds/Pop.mp3");
}

function setup() {
	createCanvas(800,600);
	noStroke();
	ellipseMode(CENTER);
	rectMode(CENTER);
	angleMode(DEGREES);
	ball = new Ball();
}

function draw() {
	switch (gameState) {
		case "play":
			gamePlay();
			break;
	}
}

function gamePlay() {
	background(0);
	drawWalls();
	ball.do();
}

class Ball {
	constructor() {
		this.totalSpeed = totalSpeed;
		var angle = random(-60,60);
		while (angle <= 20 && angle >= -20) {
			angle = random(-60, 60);
		}
		this.speedX = cos(angle) * this.totalSpeed * -1;
		this.speedY = sin(angle) * this.totalSpeed;
		this.x = width/2;
		this.y = height/2;
		this.size = ballSize;
	}

	do() {
		ellipse(this.x, this.y, this.size);
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.x < this.size/2 || this.x > width - this.size/2) {
			this.speedX *= -1;
		}
		if (this.y < wallWidth + this.size/2 || this.y > height - wallWidth - this.size/2) {
			this.speedY *= -1;
		}
	}
}

function drawWalls() { //this function draws the walls every frame
	rectMode(CORNER);
	fill(215)
	rect(0, 0, width, wallWidth);
	rect(0, height-wallWidth, width, height);
}