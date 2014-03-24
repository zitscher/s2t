var s2t = s2t || {}

s2t.main = s2t.main || {}



/* --------------------------------------------------
 :: Update Cover Image, Track and Artist Information
 ---------------------------------------------------*/
s2t.main.setCurrentlyPlayingInformation = function (songObj) {

	//set album image
	s2t.lastfm.getAlbumInfo(songObj.albumArtist, songObj.albumName, songObj.albumId, function (data) {
		var cover = jQuery('#now-playing-cover');

		//set title and artist
		var song = cover.next().find('.song-name a');
		var artist = cover.next().find('.artist-name a');
		//set data
		song.text(songObj.songTitle);
		song.data('artist-id', songObj.artistId);
		artist.text(songObj.albumArtist);
		artist.data('artist-id', songObj.artistId);

		// goto artist behaviour
		artist.on('click', function (event) {
			event.preventDefault();
			s2t.api.getArtist(songObj.artistId, function (data) {
				s2t.main.createAlbumView(data);
			});
		});
		song.on('click', function (event) {
			event.preventDefault();
			s2t.api.getArtist(songObj.artistId, function (data) {
				s2t.main.createAlbumView(data);
			});
		});

		//set cover image
		var coverUrl = false;
		if (typeof data.error === 'undefined') {
			if (data.album.image[3]['#text'] !== '') {
				coverUrl = data.album.image[3]['#text'];
			}
		}
		if (coverUrl != false) {
			cover.attr('src', coverUrl);
		} else {
			coverUrl = 'img/no_album.png';
			cover.attr('src', 'img/no_album.png');
		}

		//save data to persistence
		s2t.main.functions.saveData(songObj, coverUrl)
	});
};
