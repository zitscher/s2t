var s2t = s2t || {}

s2t.main = s2t.main || {}


s2t.main.initializeStarView = function () {
	jQuery('#show-starred').on('click', function() {
		s2t.main.createStarView();
	});
}


/* --------------------------------------------------
 :: create Star View
 ---------------------------------------------------*/
s2t.main.createStarView = function () {
	var element = jQuery('div.artist-albums');

	//clean container
	element.children().remove();

	//Tabs
	var tabs = jQuery('' +
		'<ul class="nav nav-tabs tab-navigation" id="album-tab-nav">' +
		'	<li class="searchable"><a href="#star-song-tab" data-toggle="tab"><i class="icon-music"></i>Songs</a></li>' +
		'	<li class="searchable"><a href="#star-album-tab" data-toggle="tab"><i class="icon-circle-blank"></i>Albums</a></li>' +
		'	<li class="searchable"><a href="#star-artist-tab" data-toggle="tab"><i class="icon-group"></i>Artists</a></li>' +
		'	<li class="filter">' +
		'		<a id="table-search" href="#"><i class="icon-search"></i></a>' +
		'		<div class="search hidden">' +
		'			<input class="form-control" placeholder="Filter">'+
		'			<i class="icon-remove"></i>'+
		'		</div>'+
		'	</li>' +
		'</ul>'
	);

	//calc bar width
	tabs.width(jQuery('section.view-main').width());

	element.append(tabs);

	//initialize table filter
	s2t.main.initializeTableFilter(tabs.find('#table-search'));

	var tabContent = jQuery('' +
		'<div class="tab-content">' +
		'	<div class="tab-pane fade active" id="star-song-tab"></div>' +
		'	<div class="tab-pane fade" id="star-album-tab"></div>' +
		'	<div class="tab-pane fade" id="star-artist-tab"></div>' +
		'</div>'
	);

	element.append(tabContent);

	var tabSongs   = jQuery('#star-song-tab');
	var tabAlbums  = jQuery('#star-album-tab');
	var tabArtists = jQuery('#star-artist-tab');

	//Set artist image and name
	s2t.api.getStarred(function (obj) {
		var data = obj.starred;

		//albums
		if(_.has(data, 'album')){
			if (data.album instanceof Array) {
				for(var i=0; i<data.album.length; i++) {

					s2t.main.getAlbumView(data.album[i], function(view) {
						tabAlbums.append(view);
					});
				}
			} else {
				s2t.main.getAlbumView(data.album, function(view) {
					tabAlbums.append(view);
				});
			}
		}

		//songs
		if(_.has(data, 'song')){
			var elStarSongTable = jQuery('' +
				'<div class="col-lg-12">' +
				'	<table class="star-table table table-condensed">' +
				'		<thead>' +
				'			<tr>' +
				'				<td>Title</td>' +
				'				<td>Artist</td>' +
				'				<td>Time</td>' +
				'				<td>Album</td>' +
				'				<td></td>' +
				'			</tr>' +
				'		</thead>' +
				'		<tbody></tbody>' +
				'	</table>' +
				'</div>'
			);

			if (data.song instanceof Array) {
				for(var i=0; i<data.song.length; i++) {
					var artistId = s2t.artistMap[data.song[i].artist];
					s2t.main.getSingleSongRow(artistId, data.song[i], function(view) {
						elStarSongTable.find('tbody').append(view);
					});
				}
			} else {
				var artistId = s2t.artistMap[data.song.artist];
				s2t.main.getSingleSongRow(artistId, data.song, function(view) {
					elStarSongTable.find('tbody').append(view);
				});
			}

			tabSongs.append(elStarSongTable);
		}

		//artists
		if(_.has(data, 'artist')){
			var artistContainer = jQuery('<div class="fav-artist-container"></div>');

			if (data.artist instanceof Array) {
				for(var i=0; i<data.artist.length; i++) {
					s2t.main.createFavoriteArtistView(data.artist[i], function(view) {
						artistContainer.append(view);
						view.tooltip();

					});
				}
			} else {
				s2t.main.createFavoriteArtistView(data.artist, function(view) {
					artistContainer.append(view);
					view.tooltip();
				});
			}
			tabArtists.append(artistContainer);
		}

		tabs.find('li:first-of-type a').tab('show');

	});
};

s2t.main.createFavoriteArtistView = function(artist, callback) {
	s2t.lastfm.getArtistInfo(artist.name, function(data) {
		var artistImage;
		if (data.artist.image[1]['#text'] === '') {
			artistImage = jQuery('<div class="image-container starred-artist" data-toggle="tooltip" title="' + artist.name + '"><img data-artistid="' + artist.id + '" src="img/no_album_bg.jpg" ></div>');
		} else {
			artistImage = jQuery('<div class="image-container starred-artist" data-toggle="tooltip" title="' + artist.name + '"><img data-artistid="' + artist.id + '" src="' + data.artist.image[2]['#text'] + '" ></div>');
		}

		s2t.behaviour.setArtistClickBehaviour(artistImage.find('img'));
		callback(artistImage);

	});
}



s2t.main.getSingleSongRow = function(artistId, song, callback) {
	var row = jQuery('<tr class="albumItem"></tr>');

	var timeArray 	  = s2t.main.functions.secondsToTime(song.duration);
	var time 		  = (timeArray.h > 0) ? timeArray.h + ':' + timeArray.m + ':' + timeArray.s : timeArray.m + ':' + timeArray.s;
	var duration 	  = jQuery('<td class="time">' + time + '</td>');

	var dataSignature = {
		albumArtist: song.artist.toString().replace("'", ""), //Escape it!
		artistId: 	 artistId.toString(),
		albumId: 	 song.parent.toString(),
		songId: 	 song.id.toString(),
		albumName: 	 (_.isUndefined(song.album)) 	? 'false' : song.album.toString().replace("'", ""),
		songYear: 	 (_.isUndefined(song.year)) 	? 'false' : song.year.toString().replace("'", ""),
		songBitrate: (_.isUndefined(song.bitRate)) 	? 'false' : song.bitRate.toString().replace("'", ""),
		songParent:  (_.isUndefined(song.parent)) 	? 'false' : song.parent.toString().replace("'", ""),
		songSize: 	 (_.isUndefined(song.size)) 	? 'false' : song.size.toString().replace("'", ""),
		duration: 	 (_.isUndefined(song.duration)) ? 'false' : song.duration.toString().replace("'", ""),
		songTitle: 	 (_.isUndefined(song.title)) 	? 'false' : song.title.toString().replace("'", ""),
		trackTime: 	 time.toString()
	}


	//save in map for toptracks
	var key = song.title.toString().replace("'", "").toLowerCase();
	var topTrack = s2t.trackMap[key];
	if(typeof topTrack !== 'undefined') {
		jQuery.extend(topTrack, dataSignature);
		s2t.topTrackList.push(topTrack);
	}

	var albumName  = typeof song.album  !== 'undefined' ? song.album.toString() : false
	var albumId    = typeof song.parent !== 'undefined' ? song.parent.toString() : false
	var artistName = typeof song.artist !== 'undefined' ? song.artist.toString() : false

	var song_   = jQuery("<td class='song'><a href='#' data-signature='" + JSON.stringify(dataSignature) + "'>" + song.title + "</a></td>");
	var artist = jQuery("<td class='artist'><a href='#' data-artistId='" + artistId + "'>" + artistName + "</a></td>");
	var album  = jQuery("<td class='album'><a href='#' data-albumId='" + albumId + "'>" + albumName + "</a></td>");

	var opts = jQuery('<td class="options"></td>');
	var optAdd = jQuery('<i class="icon-plus"></i>');

	var optStar;


	if(s2t.main.isStarred(song.id) === true) {
		optStar = jQuery('<i class="icon-star"></i>');
	} else {
		optStar = jQuery('<i class="icon-star-empty"></i>');
	}
	s2t.behaviour.setStarBehaviour(optStar, song.id);

	//Behaviour
	optAdd.on('click', function (event) {
		event.preventDefault();
		var songData = jQuery(this).parents('tr').find('.song a').data('signature');
		s2t.main.addSongToPlaylist(songData);
	});

	//Behaviour
	s2t.behaviour.setArtistClickBehaviour(artist.find('a'));

	//Row Rightclick
	row.on('mousedown', function(event){
		if( event.button == 2 ) {
			jQuery('.album-container tbody tr').removeClass('selected');
			jQuery(this).addClass('selected');
		}
	});

	//highglight selected row
	row.on('click', function (event) {
		jQuery('table tbody tr').removeClass('selected');
		jQuery(this).addClass('selected');
	});

	//Row doubleclick
	row.on('dblclick', function () {
		var songData = jQuery(this).find('td.song a').data('signature');
		s2t.main.addSongToPlaylist(songData);
	});

	row.draggable({
		appendTo: "body",
		cursor: "pointer",
		distance: 7,
		cursorAt: { top: 15, left: 15 },
		connectToSortable: "table.playlist-table tbody",
		helper: function (event) {
			return jQuery("<div class='draggableMusicFile'><span></span></div>");
		}
	});

	//Assemble
	opts.append(optAdd);
	opts.append(optStar);

	row.append(song_);
	row.append(artist);
	row.append(duration);
	row.append(album);
	row.append(opts);

	callback(row);
}


s2t.main.getFavoriteArtists = function() {

}