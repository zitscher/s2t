
var s2t = s2t || {}

s2t.sound = s2t.sound || {}

s2t.sound = {
	activeSong: false,
	isPlaying: false
}

s2t.sound.initSoundManager = function (callback)
{
	soundManager.setup({
		url: '/js/thirdparty/soundmanager/swf/',
		preferFlash: false,
		stream: true,
		onready: function() {
			callback(true);
		}
	});
}

s2t.sound.play = function (songId)
{
	soundManager.stopAll();

//	soundManager.reset();

	// destroy object if there's one
	if(s2t.sound.activeSong !== false) {
		s2t.sound.activeSong.destruct();
	}

	//lastfm stuff
	var scrobbled = false;
	var isPlaying = false;

	var playButton  = jQuery('#music-play').children();
	var progressBar = jQuery('#music-progress-bar');
	var playlist	= jQuery('table.playlist-table');

	s2t.sound.activeSong = soundManager.createSound({
		id: songId,
		url: s2t.data.server + 'rest/stream.view?u=' + s2t.data.user + '&p=' + s2t.data.pass + '&v=' + s2t.data.version + '&c=' + s2t.data.app + '&id=' + songId,
		volume: s2t.data.options.volume,

		whileloading: function() {
//			var percentageLoaded = (this.bytesLoaded * 100) + '%';
//			progressBar.width(percentageLoaded);
		},
		onplay: function() {
			s2t.sound.isPlaying = true;
			setPauseIcon();

			//set lastfm 'currently playing'
			if(!isPlaying) {
				s2t.api.scrobble(songId, 'now playing');
				isPlaying = true;
			}
		},
		onresume: function() {
			s2t.sound.isPlaying = true;
			setPauseIcon();
		},
		onpause: function() {
			setPlayIcon();
		},
		onfinish: function() {
			s2t.sound.isPlaying = false;

			//repeat is on
			if(s2t.data.options.repeat == true) {
				s2t.sound.play(s2t.data.memory.currentSongId);
			}

			//shuffle is on
			else if(s2t.data.options.shuffle == true) {
				// destroy object
				s2t.sound.activeSong.destruct();
				// and play new
				s2t.sound.playRandomSong();

			}

			//no mode -> has next song -> play it
			else if(s2t.sound.hasNext()) {
				// destroy object
				s2t.sound.activeSong.destruct();
				// and play next
				s2t.sound.playNextSong();
			}

			//stop
			else {
				setPlayIcon();
				progressBar.val(0);
				progressBar.find('#time-spend').text('0:00');
				progressBar.find('#time-total').text('0:00');

				//remove now-playing class
				jQuery('table.playlist-table tr').removeClass('now-playing');

				//destroy object
				s2t.sound.activeSong.destruct();
			}
		},
		whileplaying: function() {
			var posArray = s2t.main.functions.secondsToTime(this.position/1000);
			var durArray = s2t.main.functions.secondsToTime(this.duration/1000);

			var position = (posArray.h > 0) ? posArray.h + ':' + posArray.m + ':' + posArray.s : posArray.m + ':' + posArray.s;
			var duration = (durArray.h > 0) ? durArray.h + ':' + durArray.m + ':' + durArray.s : durArray.m + ':' + durArray.s;

			jQuery('#time-spend').text(position);
			jQuery('#time-total').text(duration);

			var songPosition = (this.position / this.duration) * 100;
			progressBar.val(songPosition);

			//scrobble to lastfm
			if(songPosition >= 50 && !scrobbled) {
				s2t.api.scrobble(songId, 'submission');
				scrobbled = true;
			}
		}
	});

	function setPauseIcon() {
		playButton.addClass('icon-pause');
		playButton.removeClass('icon-play');
	}

	function setPlayIcon() {
		playButton.removeClass('icon-pause');
		playButton.addClass('icon-play');
	}

	s2t.sound.activeSong.play();
}


s2t.sound.stop = function ()
{
	soundManager.stop(s2t.data.memory.currentSongId);
}

s2t.sound.pause = function ()
{
	soundManager.pause(s2t.data.memory.currentSongId);
}

s2t.sound.resume = function ()
{
	soundManager.resume(s2t.data.memory.currentSongId);
}

s2t.sound.togglePause = function (songId)
{
	if(s2t.data.memory.currentSongId !== false) {
		soundManager.togglePause(s2t.data.memory.currentSongId);
	}
}

s2t.sound.setVolume = function (volume)
{
	s2t.data.options.volume = volume;
	if(s2t.data.memory.currentSongId !== false) {
		soundManager.setVolume(s2t.data.memory.currentSongId, s2t.data.options.volume);
	}
}

s2t.sound.setPosition = function (position)
{
	if(s2t.sound.activeSong !== false) {
		var newPosition = parseInt(s2t.sound.activeSong.duration * (position * 0.01));
		s2t.sound.activeSong.setPosition(newPosition);
	}
}


s2t.sound.playNextSong = function () {
	var playlist = jQuery('table.playlist-table');
	var song = playlist.find('.now-playing');
	var nextSongLinK = song.next().find('td.song a');

	//random is on
	if(s2t.data.options.shuffle == true) {
		s2t.sound.playRandomSong();
	}
	else if(nextSongLinK.length > 0) {
		var songId = nextSongLinK.data('signature').songId;
		s2t.sound.play(songId);

		s2t.sound.setNowPlaying(song.next());

		s2t.main.setCurrentlyPlayingInformation(nextSongLinK.data('signature'));
		return songId;

	} else return false;
}

s2t.sound.prevSong = function () {
	var playlist = jQuery('table.playlist-table');
	var song = playlist.find('.now-playing');
	var prevSongLink = song.prev().find('td.song a');

	if(prevSongLink.length > 0) {
		var songId = prevSongLink.data('signature').songId;
		s2t.sound.play(prevSongLink.data('signature').songId);

		s2t.sound.setNowPlaying(song.prev());

		s2t.main.setCurrentlyPlayingInformation(prevSongLink.data('signature'));
		return songId;

	} else return false;
}


s2t.sound.playRandomSong = function () {
	var playlist = jQuery('table.playlist-table');
	var randomIndex = 1 + Math.floor(Math.random() * playlist.find('tr').length);

	var row  = playlist.find('tr:nth-of-type(' + randomIndex + ')');
	var data = row.find('td.song a').data('signature');

	s2t.sound.play(data.songId);

	s2t.sound.setNowPlaying(row);

	s2t.main.setCurrentlyPlayingInformation(data);
}

s2t.sound.setNowPlaying = function (row) {
	row.addClass('now-playing').siblings().removeClass('now-playing');
}


s2t.sound.hasNext = function() {
	var hasNext = false;
	if(jQuery('table.playlist-table tr.now-playing').next().length > 0) {
		hasNext = true;
	}
	return hasNext;
}

s2t.sound.hasPrev = function() {
	var hasPrev = false;
	if(jQuery('table.playlist-table tr.now-playing').prev().length > 0) {
		hasPrev = true;
	}
	return hasPrev;
}