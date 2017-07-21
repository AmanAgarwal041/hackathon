(function() {
	var mockdata;
	// var mockdata = {"videoid":"cJTTs-nOqdQ","videourl":"https://www.youtube.com/watch?v=cJTTs-nOqdQ","flashcards":[{"id":"1","time":"0","data":"welcome to the tutorial of Linear Equation"},{"id":"2","time":"10","data":"2x - 3 is an expression while 2x - 3 = 5 is an equation"},{"id":"3","time":"25","data":"An algebraic equation is an equality involving variables. It says that the value of the expression on one side is of the equality sign is equal to the value of the expression on the other side"},{"id":"4","time":"40","data":"Linear equations have highest power of the variable as 1"},{"id":"5","time":"45","data":"Quadratic equations have the highest power of the variable as 2"},{"id":"6","time":"50","data":"Cubic equations have the highest power of the variable as 3"},{"id":"7","time":"100","data":"A linear equation may have its solution as any rational number"},{"id":"8","time":"200","data":"Just as numbers, variables can also be transposed from one side of the equation to the other side"},{"id":"9","time":"315","data":"The utility of the linear equations is in their diverse application: different problems on numbers, ages, perimeters, combination of currency notes etc"},{"id":""}],"question":[{"id":"1","time":"0","meta":{"questiontype":"multiplechoice","questiondata":"Find the solution of 2x = 8","options":["3","4","5","6"],"optionsmeta":[{"text":"Incorrect Answer","time":"0"},{"text":"correct Answer","correct":"true"},{"text":"Incorrect Answer","time":"0"},{"text":"Incorrect Answer","time":"0"}]}},{"id":"2","time":"78","meta":{"questiontype":"multiplechoice","questiondata":"Solve 14y-8 = 13","options":["(1/2)","1","(3/2)","2"],"optionsmeta":[{"text":"Incorrect Answer","time":"0"},{"text":"Incorrect Answer","time":"0"},{"text":"correct Answer","correct":"true"},{"text":"IncorrectAnswer","time":"0"}]}},{"id":"3","time":"159","meta":{"questiontype":"multiplechoice","questiondata":"Solve (x/3) +1 = (7/15)","options":["(-15/5)","(-8/5)","(-1/5)","(3/5)"],"optionsmeta":[{"text":"Incorrect Answer","time":"78"},{"text":"correct Answer","correct":"true"},{"text":"Incorrect Answer","time":"78"},{"text":"IncorrectAnswer","time":"78"}]}},{"id":"4","time":"252","meta":{"questiontype":"multiplechoice","questiondata":"Find the solution of (15/4) - 7x = 9","options":["(-3/4)","(-1/4)","(1/4)","(3/4)"],"optionsmeta":[{"text":"correct Answer","correct":"true"},{"text":"Incorrect Answer","time":"159"},{"text":"Incorrect Answer","time":"159"},{"text":"Incorrect Answer","time":"159"}]}},{"id":"5","time":"300","meta":{"questiontype":"multiplechoice","questiondata":"Sum of two numbers is 74. One of the numbers is 10 more than the other. What are the numbers?","options":["30 & 40","32 & 42","34 & 44","36 & 46"],"optionsmeta":[{"text":"Incorrect Answer","time":0},{"0":"true","text":"Correct Answer"},{"text":"Incorrect Answer","correct":78},{"text":"Incorrect Answer","time":0}]}},{"id":"5","time":"300","meta":{"questiontype":"multiplechoice","questiondata":"What should be added to twice the rational number (-7/3) to get (3/7)","options":["104/21","5","106/21","107/21"],"optionsmeta":[{"text":"Incorrect Answer","time":0},{"0":"true","text":"Correct Answer"},{"text":"Incorrect Answer","correct":78},{"text":"Incorrect Answer","time":0}]}},{"id":"5","time":"300","meta":{"questiontype":"multiplechoice","questiondata":"The perimeter of a rectangle is 13 cm and its width is 2(2/3) cm. Find its length.","options":["3(3/4)","4","4(1/4)","4(1/2)"],"optionsmeta":[{"text":"Incorrect Answer","time":0},{"0":"true","text":"Correct Answer"},{"text":"Incorrect Answer","correct":78},{"text":"Incorrect Answer","time":0}]}},{"id":"5","time":"300","meta":{"questiontype":"multiplechoice","questiondata":"The present age of Sahil's mother is is three times the present age of Sahil. After 5 years, their ages will add to 66 years. Find the present age of Sahil","options":["12 Years","13 Years","14 Years","15 Years"],"optionsmeta":[{"text":"Incorrect Answer","time":0},{"0":"true","text":"Correct Answer"},{"text":"Incorrect Answer","correct":78},{"text":"Incorrect Answer","time":0}]}}],"videometa":"{\"object1\":{\"title\":\"title of first object\",\"body\":\"<html><head></head><body><p>html for the first object</p></body></html>\"},\"object2\":{\"title\":\"title of second object\",\"body\":\"<html><head></head><body><p>html for the second object</p></body></html>\"}}"};
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
				console.log(data[0]);
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
