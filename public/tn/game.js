var player = {x: $(window).width()/2, y: $(window).height()/2, fontsize: 12}
var food = {x: 50, y: 50}
var action = false;
var fadeTime = 20;
var stepSize = 50;
var threshold = stepSize;

$(document).on('keyup', function(e){
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
		case 82: // r
			$('.player').css({
				'color': 'red'
			});
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
	if (Math.abs(player.x - food.x) < threshold && 
		Math.abs(player.y - food.y) < threshold) { // objects are close enough: collision
		player.fontsize += 3;
		$('.player').css({'font-size': player.fontsize}); // adjust fontsize
		food.x = Math.random()*$(window).width(); // spawn food somewhere else
		food.y = Math.random()*$(window).height();
	}
	$('.player').css({'left': player.x, 'top': player.y}); // always write player position
	$('.food').css({'left': food.x, 'top': food.y}); // always write food position 
});
