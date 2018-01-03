// GAME PARAMETERS 
var fadeTime = 20;
var stepSize = 50;
var threshold = stepSize;

// ENUMS 
var directions = Object.freeze({LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}); // safe enum

// TODO:
// add monster & collision detection for monster (can also eat food)
// find good practice for JS with JQuery (DOM?): edit style of element or its corresponding class?
// add score counter along with controls (increase amount of monsters/ foods)
// fix collision detection for div size instead of upperleft point
// substitute text for low-res pictures (or not? :p)
// add diversity (banana, cherry, apple)
// multiplayer with other key combinations!
// enemies should not entirely randomwalk, they should be pushed towards player as well

// CLASS DEFINITIONS (js hoisting)
class Character {
	constructor(x=0, y=0, name="") {
		this.htmlElement = document.createElement("div"); // characters are divs
		this.htmlElement.style.position = "fixed";
		this.setName(name);
		this.setX(x);
		this.setY(y);
		document.body.appendChild(this.htmlElement);
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

class Monster extends Character {
	constructor(x,y){
		super(x,y);
	}
}

class Player extends Character {
	constructor(x, y, name, fontSize=12){
		super(x, y, name); // calls superclass' constructor
		this.setFontSize(fontSize);
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
}

class Food extends Character {
	constructor(x=0, y=0, name="") {
		super(x, y, name);
	}
}

// GAME
$(document).ready(function(){
	console.log("document ready");
	initializeArrows(); // should only set these guys up once
	console.log("setup complete");
});

$(document).on('keyup', function(e){
	checkButtonPress(e);
	collisionDetection();
});

var player = new Player(100, 100, "toonisnemiet", 19);
var food = new Food(200, 50, "banaan");

function initializeArrows(){
	var arrowLeft = document.getElementById("arrowLeft");
	var arrowRight = document.getElementById("arrowRight");
	var arrowUp = document.getElementById("arrowUp");
	var arrowDown = document.getElementById("arrowDown");
	var arrows = [arrowLeft, arrowUp, arrowRight, arrowDown];
	for (var i = 0; i < arrows.length; i++) {
		arrows[i].style.cursor = "pointer";	
	}
	arrowLeft.onclick = function(){player.move(directions.LEFT, stepSize); collisionDetection();};
	arrowRight.onclick = function(){player.move(directions.RIGHT, stepSize); collisionDetection();};
	arrowUp.onclick = function(){player.move(directions.UP, stepSize); collisionDetection();};
	arrowDown.onclick = function(){player.move(directions.DOWN, stepSize); collisionDetection();};
}

function collisionDetection(){
	if (Math.abs(player.x - food.x) < threshold && 
		Math.abs(player.y - food.y) < threshold) { // objects are close enough: collision
		player.setFontSize(player.fontSize + 3);
		food.setX(Math.random()*$(window).width()); // spawn food somewhere else
		food.setY(Math.random()*$(window).height());
	}
}

function checkButtonPress(e){
	console.log(e.which); // check which button is being pressed
	switch (e.which) {
		case 37: // left
			player.move(directions.LEFT, stepSize);
			break;
		case 38: // up
			player.move(directions.UP, stepSize);
			break;
		case 39: // right
			player.move(directions.RIGHT, stepSize);
			break;
		case 40: // down
			player.move(directions.DOWN, stepSize);
			break;
		case 66: // b
			player.toggleFontWeight();
			break;
		case 82: // r
			player.setColor("red");	
			break;
		default: // default
			break;
	}
}

