(function() {
	var mockdata = {
		videoid: 'cJTTs-nOqdQ',
		videourl: 'https://www.youtube.com/watch?v=cJTTs-nOqdQ',
		flashcards: [{
			id: 1,
			time: 0,
			data: 'welcome to the tutorial of Linear Equation 1'
		},
		{
			id: 2,
			time: 5,
			data: 'welcome to the tutorial of Linear Equation 2'
		},
		{
			id: 3,
			time: 10,
			data: 'welcome to the tutorial of Linear Equation 3'
		}],
		question: [{
			id: 1,
			time: 0,
			meta: {
				questiontype: 'multiplechoice',
				questiondata: 'question one data this is the first question',
				options: [
					'option1 data',
					'option1 data',
					'option1 data'
				],
				optionsmeta: [{
					text: 'option1meta',
					time: 11
				},
				{
					text: 'option2meta',
					time: 20
				},
				{
					text: 'option2meta',
					correct: true
				}],
				solution: 'text solution is here',
			},
		},
		{
			id: 2,
			time: 10,
			meta: {
				questiontype: 'multiplechoice',
				questiondata: 'question two data this is the second question',
				options: [
					'option1 data',
					'option1 data',
					'option1 data'
				],
				optionsmeta: [{
					text: 'option1meta',
					time: 11
				},
				{
					text: 'option2meta',
					time: 20
				},
				{
					text: 'option2meta',
					correct: true
				}],
				solution: 'text solution is here',
			},
		}],
		videometa: {
			title: 'title of first object',
			body: '<p>html for the first object</p>'
		}
	};
	var questionCounter = 0, flashcardCounter = 0;
	var VideoManager = {
		video: {},
		addVideo: function (elemId, opts) {
			VideoManager.video = (new YT.Player(elemId, opts));
		},
		seekTo: function(sec) {
			VideoManager.video.seekTo(sec);
		}
	};
	function getQuestionHtml(qIndex){
		switch(mockdata.question[qIndex].meta.questiontype) {
			case 'multiplechoice':
				return '<div class="question-data cursor-p closed" data-question-id="'+mockdata.question[qIndex].id+'"><div class="question-indicator attempted"></div><h3 class="question-title overflow-ellipsis">'+mockdata.question[qIndex].meta.questiondata+'</h3></div>';
				break;
			case 'text':
				return '<div class="question-data cursor-p closed"><div class="question-indicator attempted"></div><h3 class="question-title overflow-ellipsis">'+mockdata.question[qIndex].meta.questiondata+'</h3></div>';
		}
	}
	function getFlashCardHtml(fcIndex){
		return '<div class="card" data-card="'+mockdata.flashcards[fcIndex].id+'" data-id="'+mockdata.flashcards[fcIndex].id+'"><p>'+mockdata.flashcards[fcIndex].data+' </p></div>';
	}
	window.VideoManager = VideoManager;
	$(document).ready(function(){
		(function(){
			$.ajax({
				method: "POST",
				url: "/getVideoData",
				data: getJSON({ videoid: 'cJTTs-nOqdQ' }),
				dataType: 'json',
				contentType:'application/json'
			})
			.then(function (data) {
				mockdata = data;
				var qHtml = getQuestionHtml(questionCounter);
				questionCounter++;
				$('.question-container').append(qHtml);
				var fcHtml = getFlashCardHtml(flashcardCounter);
				flashcardCounter++;
				$('.card-container').append(fcHtml);
				$('.card-container').removeClass('hidden');
				setTimeout(function() {
					VideoManager.addVideo($('#video-data')[0], {
						width: '100%',
						height: '400px',
						videoId: mockdata.videoid,
					});
				}, 1000);
			})
		})();
	});
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
	$(document).on('click', '.card', copyFlashCard);
	$(document).on('click', '.question-data.closed', openQuestion);

	// Copy to Clipboard

	function copyToClipboard(text, cb){
		return new Promise(resolve => {
			var temp = $('<textarea>');
			temp.css('z-index', '-9999');
			$('body').append(temp);
			temp.val(text).select();
			try{
				document.execCommand("copy");
				if(cb){
					cb(text);
				}
			}
			catch(err){
				console.log(err);
			}
			temp.remove();
			return resolve();
		});
	}

	function copyFlashCard(ev){
		copyToClipboard($(this).text())
			.then(() => {
				createToast({ message: 'Copied to Clipboard!' });
			})
	}

	function openQuestion(ev) {
		$(this).removeClass('closed');
		$(this).find('.question-title').removeClass('overflow-ellipsis');
	}

	// Add questions
	var questionAppendTimer = setInterval(appendQuestion, 1000);
	function appendQuestion(ev){
		if(typeof VideoManager.video.getCurrentTime === 'undefined'){ return; }
		var currentVideoTime = VideoManager.video.getCurrentTime();
		if(currentVideoTime >= mockdata.question[questionCounter].time && $('.question-data[data-question-id="'+mockdata.question[questionCounter].id+'"]').length === 0) {
			var qHtml = getQuestionHtml(questionCounter);
			questionCounter++;
			$('.question-container').append(qHtml);
			createToast({ message: 'Question Added!' });
		}
		if(questionCounter >= mockdata.question.length) {
			clearInterval(questionAppendTimer);
		}
	}
	// Add flashcard
	var flashCardAppendTimer = setInterval(appendFlashCard, 1000);
	function appendFlashCard(ev){
		if(typeof VideoManager.video.getCurrentTime === 'undefined'){ return; }
		var currentVideoTime = VideoManager.video.getCurrentTime();
		if(currentVideoTime >= mockdata.flashcards[flashcardCounter].time && $('.card[data-id="'+mockdata.flashcards[flashcardCounter].id+'"]').length === 0) {
			var fcHtml = getFlashCardHtml(flashcardCounter);
			$('.card[data-id="'+mockdata.flashcards[flashcardCounter - 1].id+'"]').after(fcHtml);
			flashcardCounter++;
			createToast({ message: 'Flash Card Added!' });
		}
		if(flashcardCounter >= mockdata.flashcards.length) {
			clearInterval(flashCardAppendTimer);
		}
	}
}).call(this);