var s2t = s2t || {}

s2t.main = s2t.main || {}


s2t.main.initializeShortcuts = function () {

	$(document).on('keydown', function (event) {
		var source = event.target.id;
		if (source != 'Search' && source != 'ChatMsg') {
			var unicode = event.charCode ? event.charCode : event.keyCode;

			// right arrow
			if (unicode == 39 || unicode == 176) {
//				var next = $('#CurrentPlaylistContainer tr.playing').next();
//				if (!next.length) next = $('#CurrentPlaylistContainer li').first();
//				changeTrack(next);
				console.log('right');
			}
			// left arrow
			else if (unicode == 37 || unicode == 177) {
//				var prev = $('#CurrentPlaylistContainer tr.playing').prev();
//				if (!prev.length) prev = $('#CurrentPlaylistContainer tr').last();
//				changeTrack(prev);
				console.log('left');
			}
			// spacebar
			else if (unicode == 32 || unicode == 179 || unicode == 0179) {
//				playPauseSong();
				console.log('play/pause');
			}
			else if (unicode == 36 && $('#tabLibrary').is(':visible')) {
//				$('#Artists').stop().scrollTo('#auto', 400);
			}
		}
	});

}