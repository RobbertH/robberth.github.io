// GAME PARAMETERS 
var fadeTime = 20;
var stepSize = 50;
var threshold = stepSize;

// ENUMS 
var directions = Object.freeze({LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}); // safe enum
var foods = Object.freeze(["banaan", "kers", "patat", "appel"]);
var enemies = Object.freeze(["monster", "slak", "Arne"]);

// GLOBALS
var score = 0;

// TODO:
// add enemy & collision detection for enemy (can eat food and kill human)
// increase amount of monsters/ foods
// enemies should not entirely randomwalk, they should be pushed towards player as well
// fix collision detection for div size instead of upperleft point
// substitute text for low-res pictures (or not? :p)
// hide player2 in a better way (still collides)
// when holding a key down do multiple moves immediately
// food should not spawn in arrowbox or at sides of screen. Players should not leave screen.
// popup with controls that disappears on any button press 

// CLASS DEFINITIONS (js hoisting)
class Character {
	constructor(x=0, y=0, name="") {
		this.htmlElement = document.createElement("div"); // characters are divs
		this.htmlElement.style.position = "fixed";
		this.setName(name);
		this.setX(x);
		this.setY(y);
		this.appendToDocument();
	}

	getX() {
		return this.htmlElement.style.left;
	}

	getY() {
		return this.htmlElement.style.top;	
	}

	setX(x) {
		this.x = x; // need to be able to access the integer as well
		this.htmlElement.style.left = this.x + "px";
	}

	setY(y) {
		this.y = y;
		this.htmlElement.style.top = this.y + "px";
	}

	setName(name) {
		this.htmlElement.innerHTML = name;
	}
	
	appendToDocument() {
		document.body.insertBefore(this.htmlElement, document.body.firstChild);
	}

	move(direction, amount) {
		switch (direction) {
			case directions.LEFT:
				this.setX(this.x - amount);
				break;
			case directions.UP:
				this.setY(this.y - amount);
				break;
			case directions.RIGHT:
				this.setX(this.x + amount);
				break;
			case directions.DOWN:
				this.setY(this.y + amount);
				break;
			default:
				break;
		}
	}
}

class Enemy extends Character {
	constructor(x,y){
		super(x,y);
	}
}

class Player extends Character {
	constructor(x, y, name, fontSize=12){
		super(x, y, name); // calls superclass' constructor
		this.setFontSize(fontSize);
		this.setScore(0);
	}

	setFontSize(fontSize) {
		this.fontSize = fontSize; // need to keep integer as well
		this.htmlElement.style.fontSize = this.fontSize + "px";
	}

	setColor(color) {
		this.htmlElement.style.color = color;
	}

	toggleFontWeight() {
		this.htmlElement.style.fontWeight = "bold";
	}

	setScore(score) {
		this.score = score;
	}

	getScore() {
		return this.score;
	}

	increaseScore() {
		this.score += 1;
	}

	disappear() {
		this.htmlElement.style.display = "none";
	}

	appear() {
		this.htmlElement.style.display = "";
	}
}

class Food extends Character {
	constructor(x=0, y=0, name="") {
		super(x, y, name);

	}

	getEaten(){
		this.setX(Math.random()*window.innerWidth); // spawn food somewhere else
		this.setY(Math.random()*window.innerHeight);
		this.setName(foods[Math.floor(Math.random()*foods.length)]);
	}
	
	appendToDocument() {
		document.body.appendChild(this.htmlElement); // food always visible (above arrows)
	}
}

// GAME
initializeArrows(); // should only set these guys up once
console.log("setup complete");

document.onkeyup = function(e){
	checkButtonPress(e);
	collisionDetection();
};

var player1 = new Player(100, 100, "toonisnemiet", 19);
var food = new Food(200, 50, "banaan");
var player2 = new Player(Math.random()*window.innerWidth, Math.random()*window.innerHeight, "toonisnemiet", 19);
player2.disappear();

function initializeArrows(){
	var arrowLeft = document.getElementById("arrowLeft");
	var arrowRight = document.getElementById("arrowRight");
	var arrowUp = document.getElementById("arrowUp");
	var arrowDown = document.getElementById("arrowDown");
	var arrows = [arrowLeft, arrowUp, arrowRight, arrowDown];
	for (var i = 0; i < arrows.length; i++) {
		arrows[i].style.cursor = "pointer";	
	}
	arrowLeft.onclick = function(){player1.move(directions.LEFT, stepSize); collisionDetection();};
	arrowRight.onclick = function(){player1.move(directions.RIGHT, stepSize); collisionDetection();};
	arrowUp.onclick = function(){player1.move(directions.UP, stepSize); collisionDetection();};
	arrowDown.onclick = function(){player1.move(directions.DOWN, stepSize); collisionDetection();};
}

function collisionDetection(){
	if (Math.abs(player1.x - food.x) < threshold && 
		Math.abs(player1.y - food.y) < threshold) { // objects are close enough: collision
		player1.setFontSize(player1.fontSize + 3);
		food.getEaten();
		player1.increaseScore();
		document.getElementById("score1").innerHTML = player1.getScore();
	}

	if (Math.abs(player2.x - food.x) < threshold && 
		Math.abs(player2.y - food.y) < threshold) { // objects are close enough: collision
		player2.setFontSize(player2.fontSize + 3);
		food.getEaten();
		player2.increaseScore();
		document.getElementById("score2").innerHTML = player2.getScore();
	}
}

function checkButtonPress(e){
	console.log(e.which); // check which button is being pressed
	switch (e.which) {
		case 37: // left
			player1.move(directions.LEFT, stepSize);
			break;
		case 38: // up
			player1.move(directions.UP, stepSize);
			break;
		case 39: // right
			player1.move(directions.RIGHT, stepSize);
			break;
		case 40: // down
			player1.move(directions.DOWN, stepSize);
			break;
		case 84: // t up
			player2.move(directions.UP, stepSize);
			break;
		case 70: // f left
			player2.move(directions.LEFT, stepSize);
			break;
		case 71: // g down
			player2.move(directions.DOWN, stepSize);
			break;
		case 72: // h right
			player2.move(directions.RIGHT, stepSize);
			break;
		case 77: // m multiplayer
			player2.appear();
			break;
		case 66: // b
			player1.toggleFontWeight();
			player2.toggleFontWeight();
			break;
		case 82: // r
			player1.setColor("orange");
			player2.setColor("red");
			break;
		default: // default
			break;
	}
}

