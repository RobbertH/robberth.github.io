// relies on "character.js"

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

// GAME
console.log("setup complete");

document.onkeyup = function(e){
	checkButtonPress(e);
	collisionDetection();
};

var player1 = new Player(100, 100, "toonisnemiet", 19, "score1");
var food = new Food(200, 50, "banaan", 40);

var players = [player1];
var enemies = [];
var foods = [food];

var characters = players.concat(enemies); // players || enemies (order is important for collision detection!)
var objects = characters.concat(foods); // players || enemies || foods

function collisionDetection(){
	// characters are moveables. They are first in the objects list.
	for (var i = 0; i < characters.length; i++) {  
		// Loop over objects being collided. Only check for objects later in the objects list.
		for (var j = i+1; j < objects.length; j++) {	
			// collide if circumscribed rectangles overlap 
			if (objects[i].x < objects[j].x + objects[j].width && 
				objects[i].x + objects[i].width > objects[j].x &&
				objects[i].y < objects[j].y + objects[j].height &&
				objects[i].y + objects[i].height > objects[j].y) {
				objects[i].collideWith(objects[j]);
				objects[j].collideWith(objects[i]);
				console.log("lol");
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

