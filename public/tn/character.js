// File contains definitions of classes Character, Player, Food, Enemy

class Character {
	constructor(x=0, y=0, name="", fontSize=12) {
		this.htmlElement = document.createElement("div"); // characters are divs
		this.htmlElement.style.position = "fixed";
		this.setName(name);
		this.setX(x);
		this.setY(y);
		this.appendToDocument();
		this.setFontSize(fontSize);
		this.refreshDimensions(); // update width and height
	}

	getX() {
		return this.htmlElement.style.left;
	}

	getY() {
		return this.htmlElement.style.top;	
	}

	refreshDimensions() {
		this.width = this.htmlElement.offsetWidth;
		this.height = this.htmlElement.offsetHeight;
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
	
	setFontSize(fontSize) {
		this.fontSize = fontSize; // need to keep integer as well
		this.htmlElement.style.fontSize = this.fontSize + "px";
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
		super(x, y, name, fontSize); // calls superclass' constructor
		this.scoreID = scoreID;
		this.setScore(0);
		this.hitPoints = 100;
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
				this.refreshDimensions();
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
	constructor(x=0, y=0, name="", fontSize=12) {
		super(x, y, name, fontSize);
	}

	getEaten(){
		this.setX(Math.random()*(window.innerWidth - this.width)); // spawn food somewhere else
		this.setY(Math.random()*(window.innerHeight- this.height));
		this.setName(foodNames[Math.floor(Math.random()*foodNames.length)]);
	}
	
	appendToDocument() {
		document.body.appendChild(this.htmlElement); // food always visible (above arrows)
	}
	
	collideWith(object){
		this.getEaten(); // no matter who collides
	}
}
