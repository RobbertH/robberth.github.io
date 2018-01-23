// GAME PARAMETERS 
var fadeTime = 20;
var stepSize = 50;
var threshold = stepSize;

// ENUMS 
var directions = Object.freeze({LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}); // safe enum
var foodNames = Object.freeze(["banaan", "kers", "patat", "appel"]);
var enemyNames = Object.freeze(["monster", "slak", "Arne"]);

// GLOBALS
var score = 0;

// TODO:
// add enemy & collision detection for enemy (can eat food and kill human)
// increase amount of monsters/ foods
// enemies should not entirely randomwalk, they should be pushed towards player as well
// fix collision detection for div size instead of upperleft point
// substitute text for low-res pictures (or not? :p)
// when holding a key down do multiple moves immediately
// food should not spawn in arrowbox or at sides of screen. Players should not leave screen.
// popup with controls that disappears on any button press 
// superclass object of character and food (or entity if name is already taken) position, collide
// toType? better way of doing this?

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

	toType() {
		return "Character";
	}

	collideWith(object) {
		switch (object.toType()) {
			case "Player":
				break;
			case "Food":
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

	leftArrowPushed() {
		this.move(directions.LEFT, stepSize);
		collisionDetection();
	}
	
	upArrowPushed() {
		this.move(directions.UP, stepSize);
		collisionDetection();
	}
	
	rightArrowPushed() {
		this.move(directions.RIGHT, stepSize);
		collisionDetection();
	}
	
	downArrowPushed() {
		this.move(directions.DOWN, stepSize);
		collisionDetection();
	}

	collideWith(object) {
		switch (object.toType()) {
			case "Player":
				break;
			case "Food":
				this.setFontSize(this.fontSize + 3);
				this.increaseScore();
				document.getElementById("score1").innerHTML = this.getScore();
				break;
			default:
				break;
		}
	}
}

class Food extends Character {
	constructor(x=0, y=0, name="") {
		super(x, y, name);

	}

	getEaten(){
		this.setX(Math.random()*window.innerWidth); // spawn food somewhere else
		this.setY(Math.random()*window.innerHeight);
		this.setName(foodNames[Math.floor(Math.random()*foodNames.length)]);
	}
	
	appendToDocument() {
		document.body.appendChild(this.htmlElement); // food always visible (above arrows)
	}
	
	toType() {
		return "Food";
	}

	collideWith(object){
		this.getEaten(); // no matter who collides
	}
}

// GAME
console.log("setup complete");

document.onkeyup = function(e){
	checkButtonPress(e);
	collisionDetection();
};

var player1 = new Player(100, 100, "toonisnemiet", 19);
var food = new Food(200, 50, "banaan");

var players = [player1];
var enemies = [];
var foods = [food];
var characters = players.concat(enemies);
var objects = characters.concat(foods);

function collisionDetection(){
	for (var i = 0; i < objects.length-1; i++) { // for all objects except last one
		for (var j = i+1; j < objects.length; j++) { // for all objects later in the list	
			if (Math.abs(objects[i].x - objects[j].x) < threshold && 
				Math.abs(objects[i].y - objects[j].y) < threshold) {
				objects[i].collideWith(objects[j]);
				objects[j].collideWith(objects[i]);
		}
		} 
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
			players[1].move(directions.UP, stepSize);
			break;
		case 70: // f left
			players[1].move(directions.LEFT, stepSize);
			break;
		case 71: // g down
			players[1].move(directions.DOWN, stepSize);
			break;
		case 72: // h right
			players[1].move(directions.RIGHT, stepSize);
			break;
		case 77: // m multiplayer
			var player2 = new Player(Math.random()*window.innerWidth, Math.random()*window.innerHeight, "toonisnemiet", 19);
			players = [player1, player2]; // update all lists player2 is in
			characters = players.concat(enemies);
			objects = characters.concat(foods);
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

