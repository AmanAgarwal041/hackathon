(function() {
	var mockdata;
	// var mockdata = '{"videoid":"cJTTs-nOqdQ","videourl":"https:\/\/www.youtube.com/watch?v=cJTTs-nOqdQ","flashcards":[{"id":1,"time":0,"data":"welcome to the tutorial of Linear Equation 1"},{"id":2,"time":5,"data":"welcome to the tutorial of Linear Equation 2"},{"id":3,"time":10,"data":"welcome to the tutorial of Linear Equation 3"}],"question":[{"id":1,"time":0,"meta":{"questiontype":"multiplechoice","questiondata":"question one data this is the first question","options":["option1 data","option1 data","option1 data"],"optionsmeta":[{"text":"option1meta","time":11},{"text":"option2meta","time":20},{"text":"option2meta","correct":true}],"solution":"text solution is here"}},{"id":2,"time":10,"meta":{"questiontype":"multiplechoice","questiondata":"question two data this is the second question","options":["option1 data","option1 data","option1 data"],"optionsmeta":[{"text":"option1meta","time":11},{"text":"option2meta","time":20},{"text":"option2meta","correct":true}],"solution":"text solution is here"}}],"videometa":{"title":"title of first object","body":"<p>html for the first object</p>"}}';
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
	function getQuestionHtml(qIndex, open){
		var html = '';
		switch(mockdata.question[qIndex].meta.questiontype) {
			case 'multiplechoice':
				html += '<div class="question-container flex-box flex-column '+(open ? '': 'closed')+' cursor-p"><div class="question-data" data-question-id="'+mockdata.question[qIndex].id+'"><div class="question-indicator"></div><h3 class="question-title overflow-ellipsis">Question '+(questionCounter + 1)+'</h3><p class="question-ques">'+mockdata.question[qIndex].meta.questiondata+'</p><div class="flex-box flex-column question-options">';
				for (var i = 0 ; i < mockdata.question[qIndex].meta.options.length ; i++) {
					html += '<div class="flex-box flex-column question-option-container js-attempt-question" data-correct="'+(mockdata.question[qIndex].meta.optionsmeta[i].correct ? true : false)+'"><div class="question-option"><input type="checkbox" id="'+mockdata.question[qIndex].id+'-'+i+'" disabled="disabled"/><label for="'+mockdata.question[qIndex].id+'-'+i+'">'+mockdata.question[qIndex].meta.options[i]+'</label></div><div class="question-desc hidden">'+mockdata.question[qIndex].meta.optionsmeta[i].text+'<br/>';
					if(!mockdata.question[qIndex].meta.optionsmeta[i].correct){
						html += '<span class="red js-jump-video" data-video-time="'+mockdata.question[qIndex].meta.optionsmeta[i].time+'">Click here to revise</span>';
					}
					else{
						html += '<span class="green">Correct Answer</span>';
					}
					html += '</div></div>'
				}
				html += '</div></div></div>';
				break;
			// case 'text':
			// 	html += '<div class="question-data cursor-p closed"><div class="question-indicator attempted"></div><h3 class="question-title overflow-ellipsis">'+mockdata.question[qIndex].meta.questiondata+'</h3></div>';
			// 	break;
		}
		return html;
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
				data: JSON.stringify({ videoid: 'cJTTs-nOqdQ' }),
				dataType: 'json',
				contentType:'application/json'
			})
			.then(function (data) {
				mockdata = data[0];
				var qHtml = getQuestionHtml(questionCounter, true);
				questionCounter++;
				$('.question-main-container').append(qHtml);
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
				var videoDataTimer = setInterval(function () {
					if(typeof VideoManager.video.getVideoData === 'undefined') {
						return;
					}
					var videoData = VideoManager.video.getVideoData();
					$('.video-data').text(videoData.title);
					clearInterval(videoDataTimer);
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
	$(document).on('click', '.question-container.closed', openQuestion);
	$(document).on('click', '.js-jump-video', jumpToVideoPoint);
	$(document).on('click', '.js-attempt-question', attemptQuestion);

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
				createToast({ message: 'Copied to Clipboard!', autoHideTime: 1000 });
			})
	}

	function openQuestion(ev) {
		$('.question-container').addClass('closed');
		$('.question-title').addClass('overflow-ellipsis');
		$(this).removeClass('closed');
		$(this).find('.question-title').removeClass('overflow-ellipsis');
	}

	// Add questions
	var questionAppendTimer = setInterval(appendQuestion, 1000);
	function appendQuestion(ev){
		if(typeof VideoManager.video.getCurrentTime === 'undefined'){ return; }
		var currentVideoTime = VideoManager.video.getCurrentTime();
		if(currentVideoTime >= mockdata.question[questionCounter].time && $('.question-data[data-question-id="'+mockdata.question[questionCounter].id+'"]').length === 0) {
			$('.question-container').addClass('closed');
			var qHtml = getQuestionHtml(questionCounter, true);
			questionCounter++;
			$('.question-main-container').append(qHtml);
			setTimeout(function (){
				VideoManager.video.pauseVideo();
			}, 1000);
			createToast({ message: 'Question Added!', autoHideTime: 1000 });
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
			nextCard();
			createToast({ message: 'Flash Card Added!', autoHideTime: 1000 });
		}
		if(flashcardCounter >= mockdata.flashcards.length) {
			clearInterval(flashCardAppendTimer);
		}
	}

	// jump to video seek time
	function jumpToVideoPoint(ev){
		var timeJump = $(this).attr('data-video-time');
		VideoManager.seekTo(Number(timeJump));
	}
	// attempt question
	function attemptQuestion(ev) {
		$(this).removeClass('js-attempt-question');
		$(this).closest('.question-container').find('.question-indicator').addClass('attempted');
		if($(this).attr('data-correct') === "false") {
			$(this).find('.question-option').addClass('wrong');
		} else {
			VideoManager.video.playVideo();
			$(this).closest('.question-options').find('.js-attempt-question').removeClass('js-attempt-question');
			$(this).find('.question-option').addClass('correct');
		}
		$(this).find('.question-desc').removeClass('hidden');
	}
}).call(this);
