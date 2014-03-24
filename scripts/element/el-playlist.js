var s2t = s2t || {}

s2t.main = s2t.main || {}


/* --------------------------------------------------
 :: Add song to Playlist
 ---------------------------------------------------*/
s2t.main.addSongToPlaylist = function (songObj, addOnly, getItem, position, nowPlaying) {
	var playlist = jQuery('.playlist table tbody');

	var row = jQuery('<tr></tr>');

	var title  = jQuery("<td class='song'><a id='playlist-song-" + songObj.songId + "' href='#' data-signature='" + JSON.stringify(songObj) + "'>" + songObj.songTitle + "</a></td>");
	var artist = jQuery('<td class="artist"><a href="#" data-artist-id="' + songObj.artistId + '">' + songObj.albumArtist + '</a></td>');
	var album  = jQuery('<td class="album"><a href="#" data-albumId="' + songObj.albumId + '" data-artist-album="' + songObj.albumName + '">' + songObj.albumName + '</a></td>');
	var opts   = jQuery('<td class="options"></td>');

	var optStar = jQuery('<i id="opt-star" class="icon-star"></i>');
	var playing = jQuery('<i class="icon-volume-up "></i>');
	opts.append(optStar);
	opts.append(playing);

	var duration = jQuery('<td class="time">' + songObj.trackTime + '</td>');

	row.append(opts);
	row.append(title);
	row.append(artist);
	row.append(duration);
	row.append(album);

	s2t.main.addRowBehaviour(row);


	if(s2t.main.isStarred(songObj.songId) === true) {
		optStar.addClass('icon-star');
		optStar.removeClass('icon-star-empty');
	} else {
		optStar.removeClass('icon-star');
		optStar.addClass('icon-star-empty');
	}

	if(typeof position !== 'undefined' && typeof getItem === 'undefined') {
		playlist.find('tr:nth-of-type(' + position +')').after(row);
	}
	else if((typeof getItem === 'undefined' && typeof position === 'undefined') || getItem === false){
		playlist.append(row);
	} else {
		//update playlist information
		s2t.main.updatePlaylistInformation();
		s2t.data.queue.push(songObj);
		return row;
	}

	//update playlist information
	s2t.main.updatePlaylistInformation();

	//set to persistence
	if (typeof addOnly === 'undefined') {
		s2t.data.queue.push(songObj);
	}

	//set to nowPlaying
	if (nowPlaying === true) {
		row.addClass('now-playing');
	}
}

s2t.main.addRowBehaviour = function(row) {
	//highglight selected row
	row.on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
		jQuery(this).addClass('selected').siblings().removeClass('selected');
	});

	//rightclick
	row.on('mousedown', function(event){
		if( event.button == 2 ) {
			jQuery(this).addClass('selected').siblings().removeClass('selected');
			return false;
		}
		return true;
	});

	//DoubleClick
	row.on('dblclick', function (event) {
		event.preventDefault();
		var song = jQuery(this).find('td.song a').data('signature');
		s2t.main.setCurrentlyPlayingInformation(song);
		jQuery(this).addClass('selected').siblings().removeClass('selected');
		s2t.sound.play(song.songId);

		//mark as playing
		row.addClass('now-playing').siblings().removeClass('now-playing');
	});

	// goto artist event
	row.find('td.artist a').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
		s2t.api.getArtist(row.find('td.song a').data('signature').artistId, function (data) {
			s2t.main.createAlbumView(data);
		});
	});

	// goto album event
	row.find('td.album a').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();

		s2t.api.getArtist(row.find('td.song a').data('signature').artistId, function (data) {
			s2t.main.createAlbumView(data);
		});
	});

	// play song event
	row.find('td.song a').on('dblclick', function (event) {
		event.preventDefault();
		var song = jQuery(this).data('signature');
		s2t.main.setCurrentlyPlayingInformation(song);
		s2t.sound.play(song.songId);
	});

	s2t.behaviour.setStarBehaviour(row.find('#opt-star'), row.find('td.song a').data('signature').songId);
}


s2t.main.updatePlaylistInformation = function () {
	var queue = jQuery('table.playlist-table');
	var queueNav = jQuery('#playlist-navigation');

	//set track count
	var tracks = queue.find('tr').length;
	if(tracks < 2) {
		queueNav.find('li.playlist-count span.tracks').text(tracks + ' Track');
	} else {
		queueNav.find('li.playlist-count span.tracks').text(tracks + ' Tracks');
	}

	//set total time
	var time = 0;
	queue.find('tr a').each(function() {
		var data = jQuery(this).data('signature');
		if(typeof data !== 'undefined') {
			time = parseInt(time) + parseInt(data.duration);
		}
	});

	var timeArray = s2t.main.functions.secondsToTime(time);

	var seconds = (parseInt(timeArray.s) < 10) ? '0' + timeArray.s : timeArray.s;
	var minutes = (parseInt(timeArray.m) < 10) ? '0' + timeArray.m : timeArray.m;
	var hours   = (parseInt(timeArray.h) < 10) ? '0' + timeArray.h : timeArray.h;

	var totalTime = (timeArray.h > 0) ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;

	queueNav.find('li.playlist-count span.time').text(totalTime);
}


/* --------------------------------------------------
 :: Queue/Playlist Behaviour
 ---------------------------------------------------*/
s2t.main.updatePlaylistBehaviour = function () {

	var playlist = jQuery('table.playlist-table');
	var clear    = jQuery('#queue-clear');
	var shuffle  = jQuery('#queue-shuffle');

	clear.on('click', function (event) {
		event.preventDefault();

		playlist.find('tbody tr').remove();
		//clear data
		s2t.data.queue = [];
	});

	shuffle.on('click', function (event) {
		event.preventDefault();
		s2t.main.shufflePlaylist();
	});

	playlist.find('tbody').sortable({
		items: '> tr',
		placeholder: 'placeholder',
		containment: 'parent',
		cursor: 'move',
		helper: 'clone',
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		distance: 5,
		tolerance: "pointer",
		receive: function (event, ui) {
			var item = jQuery(ui.item);
			var data = item.find('td.song a').data('signature');

			var row = s2t.main.addSongToPlaylist(data, false, 'getRow');

			var replaceableItem = playlist.find('tbody tr.albumItem');

			if(replaceableItem.length) {
				replaceableItem.replaceWith(row);
			} else {
				playlist.find('tbody tr.topItem').replaceWith(row);
			}

		},
		update: function() {
			//Save Queue
			var newQueue = [];
			jQuery('table.playlist-table td.song a').each(function () {
				var data = jQuery(this).data('signature');
				newQueue.push(data)
			});
			s2t.data.queue = newQueue;

		}
	}).disableSelection();
}


s2t.main.removeSongFromPlaylist = function (pos) {
	var playlist = jQuery('table.playlist-table');

	var nthPos = pos + 1;
	playlist.find('tbody tr:nth-of-type(' + nthPos + ')').remove();

	//clear and save data
	s2t.data.queue[pos] = '';
	s2t.data.queue = _.compact(s2t.data.queue);
}


s2t.main.shufflePlaylist = function () {
	var playlist = jQuery('table.playlist-table');
	var items = playlist.find('tr');

	if(items.length) {
		var itemLength = items.length;

		if(itemLength == 1) {
			return;
		}

		playlist.find('tr').remove();
		var newList = _.shuffle(items);

		jQuery.each(newList, function(key, value) {
			s2t.main.addRowBehaviour(jQuery(this));
		});

		playlist.append(newList);
	}
}
