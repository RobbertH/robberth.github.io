var x = $(window).width()/2;
var y = $(window).height()/2;
var action = false;
var fadeTime = 20;

$(document).on('keyup', function(e){
	console.log(e.which); // check which button is being pressed
	switch (e.which) {
		case 37: // left
			x -= 10;
			action = true;
			break;
		case 39: // right
			x += 10;
			action = true;
			break;
		case 38: // up
			y -= 10; 
			action = true;
			break;
		case 40: // down
			y += 10;
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
			'left': x,
			'top': y
		}).fadeIn(fadeTime);
	}
	$('.player').css({'left': x, 'top': y}); // always write position
});
