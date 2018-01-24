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
// player1 vs player2 score (when player2 eats something, its added to player2s score)

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

	collideWith(object) {
		switch (object.constructor.name) {
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
	constructor(x, y, name, fontSize=12, scoreID){
		super(x, y, name); // calls superclass' constructor
		this.setFontSize(fontSize);
		this.scoreID = scoreID;
		this.setScore(0);
		this.hitPoints = 100;
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
		document.getElementById(this.scoreID).innerHTML = this.getScore();
	}

	getScore() {
		return this.score;
	}

	increaseScore() {
		this.setScore(this.getScore() + 1);
	}

	decreaseHitPoints() {
		this.hitPoints -= 1;
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
		switch (object.constructor.name) {
			case "Food":
				this.setFontSize(this.fontSize + 3);
				this.increaseScore();
				break;
			case "Enemy":
				this.decreaseHitPoints();
			case "Player":
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

var player1 = new Player(100, 100, "toonisnemiet", 19, "score1");
var food = new Food(200, 50, "banaan");

var players = [player1];
var enemies = [];
var foods = [food];
var characters = players.concat(enemies);
var objects = characters.concat(foods);

function collisionDetection(){
	for (var i = 0; i < Math.ceil(objects.length/2); i++) { // all objects in 1st half of the list 
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
			players[0].move(directions.LEFT, stepSize);
			break;
		case 38: // up
			players[0].move(directions.UP, stepSize);
			break;
		case 39: // right
			players[0].move(directions.RIGHT, stepSize);
			break;
		case 40: // down
			players[0].move(directions.DOWN, stepSize);
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
			let player2 = new Player(Math.random()*window.innerWidth, Math.random()*window.innerHeight, "toonisnemiet", 19, "score2");
			players = players.concat([player2]); // update all lists player2 is in
			characters = players.concat(enemies);
			objects = characters.concat(foods);
			break;
		case 66: // b bold
			players[0].toggleFontWeight();
			players[1].toggleFontWeight();
			break;
		case 82: // r color
			players[0].setColor("orange");
			players[1].setColor("red");
			break;
		default: // default
			break;
	}
}

