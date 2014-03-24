var s2t = s2t || {}

s2t.main = s2t.main || {}

/* --------------------------------------------------
 :: Sets everything how it was before!
 ---------------------------------------------------*/
s2t.main.setOriginalState = function () {
	//set Cover
	if (s2t.data.memory.currentSongAlbumImage !== false) {
		jQuery('#now-playing-cover').attr('src', s2t.data.memory.currentSongAlbumImage);
	}

	//set SongTitle and Artist
	var songName = jQuery('#artist-info .song-name a');
	var artistName = jQuery('#artist-info .artist-name a');

	if (s2t.data.memory.currentSongName !== false) {
		songName.text(s2t.data.memory.currentSongName);
		songName.on('click', function (event) {
			event.preventDefault();
			s2t.api.getArtist(s2t.data.memory.currentArtistId, function (data) {
				s2t.main.createAlbumView(data);
			});
		});
		artistName.on('click', function (event) {
			event.preventDefault();
			s2t.api.getArtist(s2t.data.memory.currentArtistId, function (data) {
				s2t.main.createAlbumView(data);
			});
		});
	}

	if (s2t.data.memory.currentArtist !== false) {
		artistName.text(s2t.data.memory.currentArtist);
	}

	//resetPlaylist
	if (s2t.data.queue.length !== 0) {
		var queue = JSON.parse(JSON.stringify(s2t.data)).queue;

		queue.forEach(function (element, index, array) {
			s2t.main.addSongToPlaylist(element, 'dontPersist');
		});
	}
}