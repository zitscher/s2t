var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.initializeRandomView = function() {
	var randButton = jQuery('#dj-random');
	randButton.on('click', function(event) {
		event.preventDefault();

		s2t.main.createDjRandom();
	})
}


s2t.main.createDjRandom = function () {
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

	var randomSongTable = jQuery('' +
		'<div class="col-lg-12">' +
		'	<table class="random-table table table-condensed">' +
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

	//get random Songs
	s2t.main.addRandomSongs(randomSongTable);
	//get random  Album
	s2t.main.addRandomAlbums(tabAlbums);

	var moreSongsButton  = jQuery('<button type="button" class="btn btn-default get-more">Get More</button>');
	var moreAlbumsButton = jQuery('<button type="button" class="btn btn-default get-more">Get More</button>');
	moreSongsButton.on('click', function(event) {
		event.preventDefault();
		s2t.main.addRandomSongs(randomSongTable);
	});
	moreAlbumsButton.on('click', function(event) {
		event.preventDefault();
		s2t.main.addRandomAlbums(tabAlbums);
	});

	tabSongs.append(randomSongTable);
	setTimeout(function(){
		tabSongs.append(moreSongsButton);
	}, 2000);
	tabAlbums.append(moreAlbumsButton);

	tabs.find('li:first-of-type a').tab('show');
};


s2t.main.addRandomSongs = function(table) {
	s2t.api.getRandomSongs(50, false, false, false, false, function(data) {
		var songArray = data.randomSongs.song;

		for (var i = 0; i < songArray.length; i++) {
			var artistId = s2t.artistMap[songArray[i].artist];
			if(typeof artistId !== 'undefined') {
				s2t.main.getSingleSongRow(artistId, songArray[i], function (row) {
					table.find('tbody').append(row);
				});
			}
		}
	});
}

s2t.main.addRandomAlbums = function(container) {
	s2t.api.getRandomSongs(7, false, false, false, false, function(data) {
		var songArray = data.randomSongs.song;

		for (var i = 0; i < songArray.length; i++) {
			var artistId = s2t.artistMap[songArray[i].artist];
			if(typeof artistId !== 'undefined') {
				s2t.api.getArtist(artistId, function (data) {
					var album = data.artist.album[_.random(0, data.artist.album.length)];
					if(typeof album !== 'undefined') {
						s2t.main.getAlbumView(album, function (albumView) {
							container.find('button').before(albumView);
						});
					}
				});
			}
		}
	});
}

