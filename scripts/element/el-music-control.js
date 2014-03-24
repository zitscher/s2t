var s2t = s2t || {}

s2t.main = s2t.main || {}


/* --------------------------------------------------
 :: Create Music Control Panel
 ---------------------------------------------------*/
s2t.main.initMusicControlBehaviour = function (data) {
	var playerPanel = jQuery('#player-panel');

	var prev = playerPanel.find('#music-prev');
	var play = playerPanel.find('#music-play');
	var next = playerPanel.find('#music-next');
	var shuffle = playerPanel.find('#music-shuffle');
	var repeat = playerPanel.find('#music-repeat');

	//Play/Pause
	play.on('click', function (event) {
		event.preventDefault();
		s2t.sound.togglePause();
	});

	//Next
	next.on('click', function (event) {
		event.preventDefault();
		s2t.sound.playNextSong();
	});

	//Previous
	prev.on('click', function (event) {
		event.preventDefault();
		s2t.sound.prevSong();
	});

	//Repeat
	if(s2t.data.options.repeat == true) {
		repeat.addClass('active');
	}
	repeat.on('click', function (event) {
		event.preventDefault();
		if (s2t.data.options.repeat === false) {
			s2t.data.options.repeat = true;
			jQuery(this).addClass('active');
		} else {
			s2t.data.options.repeat = false;
			jQuery(this).removeClass('active');
		}
	});

	//Shuffle
	if(s2t.data.options.shuffle == true) {
		shuffle.addClass('active');
	}
	shuffle.on('click', function (event) {
		event.preventDefault();
		if (s2t.data.options.shuffle === false) {
			s2t.data.options.shuffle = true;
			jQuery(this).addClass('active');
		} else {
			s2t.data.options.shuffle = false;
			jQuery(this).removeClass('active');
		}
	});


	$("#music-volume").noUiSlider({
		range: [0, 100],
		start: s2t.data.options.volume,
		handles: 1,
		slide: function () {
			var volume = parseInt(jQuery(this).val());
			s2t.sound.setVolume(volume);
		}
	});

	$("#music-progress-bar").noUiSlider({
		range: [0, 100],
		start: 0,
		handles: 1,
		slideStop: function () {
			var sliderValue = jQuery(this).val();
			s2t.sound.setPosition(sliderValue);
		}
	});


};