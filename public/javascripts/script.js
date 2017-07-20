(function() {
	var rotate, timeline;

	previousCard = function() {
		return $('.card:last-child').fadeOut(400, 'swing', function() {
			return $('.card:last-child').prependTo('.card-container').hide();
		}).fadeIn(400, 'swing');
	};
	nextCard = function() {
		return $('.card:first-child').fadeOut(400, 'swing', function() {
			return $('.card:first-child').appendTo('.card-container').hide();
		}).fadeIn(400, 'swing');
	};

	$(document).on('click', '.step-jumper--previous', previousCard);
	$(document).on('click', '.step-jumper--next', nextCard);

}).call(this);