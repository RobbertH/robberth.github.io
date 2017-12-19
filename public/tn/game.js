var player = {x: $(window).width()/2, y: $(window).height()/2, fontsize: 12}
var food = {x: 50, y: 50}
var action = false;
var fadeTime = 20;
var stepSize = 50;
var threshold = stepSize;

// TODO:
// enum directions
// make abstracter definitions of things like move(character, direction) 
// add monster & collision detection for monster (can also eat food)
// find good practice for JS with JQuery (DOM): edit style of element or its corresponding class?
// add score counter along with controls (increase amount of monsters/ foods)
// fix collision detection for div size instead of upperleft point
// substitute text for low-res pictures (or not? :p)
// add diversity (banana, cherry, apple)

$(document).ready(function(){
	console.log("document ready");
	initializeArrows();
	document.getElementById("enemy").style.display = "none";
	console.log("setup complete");
});

$(document).on('keyup', function(e){
	checkButtonPress(e);
	collisionDetection();
	writePositions();
});

function initializeArrows(){
	var arrowLeft = document.getElementById("arrowLeft");
	var arrowRight = document.getElementById("arrowRight");
	var arrowUp = document.getElementById("arrowUp");
	var arrowDown = document.getElementById("arrowDown");
	arrowLeft.style.cursor = "pointer";
	arrowRight.style.cursor = "pointer";
	arrowUp.style.cursor = "pointer";
	arrowDown.style.cursor = "pointer";
	arrowLeft.onclick = function(){player.x -= stepSize; writePositions(); collisionDetection();};
	arrowRight.onclick = function(){player.x += stepSize; writePositions(); collisionDetection();};
	arrowUp.onclick = function(){player.y -= stepSize; writePositions(); collisionDetection();};
	arrowDown.onclick = function(){player.y += stepSize; writePositions(); collisionDetection();};
}

function writePositions(){
	$('.player').css({'left': player.x, 'top': player.y}); // always write player position
	$('.food').css({'left': food.x, 'top': food.y}); // always write food position 
}

function collisionDetection(){
	if (Math.abs(player.x - food.x) < threshold && 
		Math.abs(player.y - food.y) < threshold) { // objects are close enough: collision
		player.fontsize += 3;
		$('.player').css({'font-size': player.fontsize}); // adjust fontsize
		food.x = Math.random()*$(window).width(); // spawn food somewhere else
		food.y = Math.random()*$(window).height();
	}
}

function checkButtonPress(e){
	console.log(e.which); // check which button is being pressed
	switch (e.which) {
		case 37: // left
			player.x -= stepSize;
			action = true;
			break;
		case 39: // right
			player.x += stepSize;
			action = true;
			break;
		case 38: // up
			player.y -= stepSize; 
			action = true;
			break;
		case 40: // down
			player.y += stepSize;
			action = true;
			break;
		case 66: // b
			$('.player').css({
				'font-weight': 'bold'
			});
			break;
		case 82: // r
			$('.player').css({
				'color': 'red'
			});
			break;
		default: // default
			action = false;
			break;
	}
	if (action) {
		$('.player').fadeOut(fadeTime).css({
			'left': player.x,
			'top': player.y
		}).fadeIn(fadeTime);
	}
}

function randomWalk(character){
	newx = character.x + math.floor(Math.random()*stepSize);
	newy = character.y + math.floor(Math.random()*stepSize);
	if (newx < $(window).width() && newx > 0){
		character.x = newx;
	}
	if (newy < $(window).height() && newy > 0){
		character.y = newy;
	}
}
