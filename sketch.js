var wallWidth = 20;
var ballSize = 20;

var ball;

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
	ball = new Ball();
}

function draw() {
	background(0);
	drawWalls();
	ball.do();
}

class Ball {
	constructor() {
		this.speedX = random(-3, 3); //this randomizes the X and Y speed of the ball
		this.speedY = -1 * (5 - Math.abs(this.speedX)); //this statement makes sure the total speed of the ball will add up to an absolute value of 5 (regardless of direction) and that the ball always starts travelling upwards
		this.x = width/2;
		this.y = height/2;
		this.size = ballSize;
		this.totalSpeed = 5;
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