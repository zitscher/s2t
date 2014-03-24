var s2t = s2t || {}

s2t.main = s2t.main || {}


/* --------------------------------------------------
 :: update Single Artist Element
 ---------------------------------------------------*/
s2t.main.createAlbumView = function (data) {
	var element = jQuery('div.artist-albums');

	//clean container
	element.children().remove();

	//Tabs
	var tabs = jQuery('' +
		'<ul class="nav nav-tabs tab-navigation" id="album-tab-nav" data-spy="affix" data-offset-top="50">' +
		'	<li class="searchable"><a href="#artist-tab" data-toggle="tab"><i class="icon-music"></i>Albums</a></li>' +
		'	<li class="searchable"><a href="#artist-popular-tab" data-toggle="tab"><i class="icon-sort-by-attributes-alt"></i>Popular</a></li>' +
		'	<li><a href="#artist-info-tab" data-toggle="tab"><i class="icon-info"></i>Artist Information</a></li>' +
		'	<li><a href="#related-artist-tab" data-toggle="tab"><i class="icon-group"></i>Related Artists</a></li>' +
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

//	tabs.find('a').click(function (e) {
//		e.preventDefault()
//		var selector = jQuery(this).attr('href').toString();
//		setTimeout(function(){
//			s2t.main.functions.lazyLoad(jQuery(selector));
//		}, 750);
//	});

	element.append(tabs);

	//initialize table filter
	s2t.main.initializeTableFilter(tabs.find('#table-search'));

	var tabContent = jQuery('' +
		'<div class="tab-content">' +
		'	<div class="tab-pane fade active" id="artist-tab"></div>' +
		'	<div class="tab-pane fade" id="artist-popular-tab"></div>' +
		'	<div class="tab-pane fade" id="artist-info-tab"></div>' +
		'	<div class="tab-pane fade" id="related-artist-tab"></div>' +
		'</div>'
	);

	element.append(tabContent);

	var tabArtist  = jQuery('#artist-tab');
	var tabRelated = jQuery('#related-artist-tab');
	var tabInfo    = jQuery('#artist-info-tab');
	var tabPopular = jQuery('#artist-popular-tab');

	//collect data
	var artistId = data.artist.id;
	var artistName = data.artist.name;
	var albumList = data.artist.album;

	//Set artist image and name
	s2t.lastfm.getArtistInfo(artistName, function (data) {
		var albumContainer = jQuery('<div class="album-container row"></div>');

		//get Artist Information
		s2t.main.getArtistInformationView(data, artistId, function(informationView){
			tabInfo.append(informationView);
		});

		s2t.main.getRelatedArtistsView(data, function(relatedArtistView) {
			tabRelated.append(relatedArtistView);
		});

		//get topTracks and create album list
		s2t.lastfm.getTopTracks(artistName, function(data) {

			//clean trackMap
			s2t.trackMap = [];
			//clean topTrackList
			s2t.topTrackList = [];
			//prepare top tracks
			var tracks = (_.isUndefined(data.toptracks)) ? undefined : data.toptracks.track;

			if(!_.isUndefined(tracks)) {
				for(var i=0; i< tracks.length; i++) {
					var trackKey  = tracks[i].name.replace("'", "").toLowerCase();

					if(_.has(tracks[i], 'image')) {
						var img = tracks[i].image[0]['#text'];
					} else {
						var img = false;
					}
					var trackData = {
						name: tracks[i].name,
						playcount: tracks[i].playcount,
						image:  img,
						position: tracks[i]['@attr'].rank
					}

					s2t.trackMap[trackKey] = trackData
				}
			}

			//create album list
			var createCountdown = (albumList instanceof Array) ? albumList.length : 1;
			var viewCollection = [];

			if (albumList instanceof Array) {
				for (var i = 0; i < albumList.length; i++) {
					s2t.main.getAlbumView(albumList[i], function (albumView) {
						//add album as they come
						albumContainer.append(albumView);

						createCountdown--;
						if(createCountdown == 0) {
							//get top tracks
							s2t.main.getTopTracksView(function(topTracksView) {
								tabPopular.append(topTracksView);
							});
						}
					});
				}
			} else {
				s2t.main.getAlbumView(albumList, function (albumView) {
					albumContainer.append(albumView);

					createCountdown--;
					if(createCountdown == 0) {
						s2t.main.getTopTracksView(function(topTracksView) {
							tabPopular.append(topTracksView);
						});
					}
				});
			}

			tabArtist.append(albumContainer);
			tabs.find('li:first-of-type a').tab('show');

		});
	});
};


s2t.main.getAlbumView = function (album, callback) {
	// element
	var elAlbumView = jQuery('<div class="album row"></div>');

	// information
	var albumId = album.id;
	var albumArtist = album.artist;
	var albumName;
	var artistId;

	//subsonic fail
	if(_.has(album, 'isDir')) {
		artistId = album.parent;
		albumName = album.album;
	} else {
		artistId = album.artistId;
		albumName = album.name;
	}

	// fetch album details
	s2t.api.getAlbum(albumId, function (data) {
		var elAlbumTable = jQuery('' +
			'<div class="col-lg-10 album-table-container">' +
			'	<table class="album-table table table-condensed">' +
			'		<tbody></tbody>' +
			'	</table>' +
			'</div>'
		);

		var songs = data.album.song;

		for (var i = 0; i < songs.length; i++) {
			var row = jQuery('<tr class="albumItem"></tr>');

			var timeArray 	  = s2t.main.functions.secondsToTime(songs[i].duration);
			var time 		  = (timeArray.h > 0) ? timeArray.h + ':' + timeArray.m + ':' + timeArray.s : timeArray.m + ':' + timeArray.s;
			var duration 	  = jQuery('<td class="time">' + time + '</td>');
			var trackNr 	  = parseInt(songs[i].track) < 10 ? '0'+parseInt(songs[i].track) : parseInt(songs[i].track);
			var track 		  = jQuery('<td class="track">' + trackNr + '</td>');

			var dataSignature = {
				albumArtist: album.artist.toString().replace("'", ""), //Escape it!
				albumId: 	 album.id.toString(),
				artistId: 	 artistId.toString(),
				songId: 	 songs[i].id.toString(),
				albumName: 	 (_.isUndefined(albumName)) 		? 'false' : albumName.toString().replace("'", ""),  //Escape it!
				songYear: 	 (_.isUndefined(songs[i].year)) 	? 'false' : songs[i].year.toString(),
				songBitrate: (_.isUndefined(songs[i].bitRate)) 	? 'false' : songs[i].bitRate.toString(),
				songParent:  (_.isUndefined(songs[i].parent)) 	? 'false' : songs[i].parent.toString(),
				songSize: 	 (_.isUndefined(songs[i].size)) 	? 'false' : songs[i].size.toString(),
				duration:	 (_.isUndefined(songs[i].duration)) ? 'false' : songs[i].duration,
				songTitle: 	 (_.isUndefined(songs[i].title)) 	? 'false' : songs[i].title.toString().replace("'", ""),  //Escape it!
				trackTime: 	 time.toString()
			}

			//save in map for toptracks
			var key = songs[i].title.toString().replace("'", "").toLowerCase();
			var topTrack = s2t.trackMap[key];
			if(typeof topTrack !== 'undefined') {
				jQuery.extend(topTrack, dataSignature);
				s2t.topTrackList.push(topTrack);
			}

			var song = jQuery("<td class='song'><a href='#' data-signature='" + JSON.stringify(dataSignature) + "'>" + songs[i].title + "</a></td>");

			var opts = jQuery('<td class="options"></td>');
			var optAdd = jQuery('<i class="icon-plus"></i>');

			var optStar;
			if(s2t.main.isStarred(songs[i].id) === true) {
				optStar = jQuery('<i class="icon-star"></i>');
			} else {
				optStar = jQuery('<i class="icon-star-empty"></i>');
			}
			s2t.behaviour.setStarBehaviour(optStar, songs[i].id);

			//Behaviour
			optAdd.on('click', function (event) {
				event.preventDefault();
				var songData = jQuery(this).parents('tr').find('.song a').data('signature');
				s2t.main.addSongToPlaylist(songData);
			});


			//Row Rightclick
			row.on('mousedown', function(event){
				if( event.button == 2 ) {
					jQuery('table tbody tr').removeClass('selected');
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
				jQuery('.playlist-table').mCustomScrollbar("update");

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

			row.append(track);
			row.append(song);
			row.append(duration);
			row.append(opts);

			//append data to table
			elAlbumTable.find('tbody').append(row);

		}

		// fetch album image and create information
		s2t.lastfm.getAlbumInfo(albumArtist, albumName, albumId, function (data) {
			var informationRow = jQuery('<div class="col-lg-2"><div class="col-lg-1"></div></div>');

			if(typeof data.error === 'undefined'){
				var releaseDate = moment(data.album.releasedate, "D MMM YYYY").year();
			} else {
				var releasedate = "";
			}

			var release = releaseDate === 0 || typeof releaseDate === 'undefined' ? '' : releaseDate;

			var albumNameRow = jQuery('<div class="row"><h3>' + albumName + '</<h3><span>' + release + '</span><i class="icon-star-empty"></i></h3></div>');

			s2t.behaviour.setStarBehaviour(albumNameRow.find('i'), albumId);

			var coverImage;
			if (data.error || data.album.image[1]['#text'] === '') {
				coverImage = jQuery('<div class="image-container"><img src="img/no_album_bg.jpg" height="140" width="140" ></div>');
			} else {
				coverImage = jQuery('<div class="image-container"><img src="' + data.album.image[2]['#text'] + '" height="140" width="140" ></div>');
			}

			coverImage.on('click', function(event) {
				event.preventDefault();
				var allSongs = jQuery(this).parents('.album').find('td.song a');

				allSongs.each(function(index, value) {
					var data = jQuery(this).data('signature');
					s2t.main.addSongToPlaylist(data, 'dontPersist');
					if(index === 0) {
						s2t.main.setCurrentlyPlayingInformation(data);
						s2t.sound.play(data.songId);
						var nowPlayingEl = jQuery('table.playlist-table tr:last-of-type')
						s2t.sound.setNowPlaying(nowPlayingEl);
					}
				});

				jQuery('.playlist-table').mCustomScrollbar("update");

				//safe now for performance reasons
				var newQueue = [];
				jQuery('table.playlist-table td.song a').each(function() {
					newQueue.push(jQuery(this).data('signature'));
				});
				//persist
				s2t.data.queue = newQueue
			});

			//assemble information row
			informationRow.find('.col-lg-1').append(coverImage);

			//assemble view
			elAlbumTable.hide().appendTo(elAlbumView).fadeIn('fast');

			elAlbumView.prepend(informationRow);

			elAlbumView.find('.album-table').parent().prepend(albumNameRow);

			//Album Star Behaviour

			callback(elAlbumView);
		});
	});
}


s2t.main.getTopTracksView = function (callback) {
	var sortedTracks = s2t.topTrackList.sort(function(obj1, obj2) {
		// sort Ascending
		return obj1.position - obj2.position;
	});
	s2t.main.createTopTracks(_.uniq(sortedTracks), function(tableView) {
		callback(tableView);
	});
}



//TODO: Show more information!
s2t.main.getArtistInformationView = function (data, artistId, callback) {
	if(_.isUndefined(data.artist)) {
		return false;
	}

	var tagContainer = jQuery('<div class="tag-container"></div>');

	//artistTags
	if(!_.isUndefined(data.artist.tags)) {
		var artistTags   = (data.artist.tags === '') ? undefined : data.artist.tags.tag;
		if(!_.isUndefined(artistTags)) {
			for(var i=0; i<artistTags.length; i++) {
				var tag = jQuery('<span class="label label-primary">' + artistTags[i].name + '</span>');
				tagContainer.append(tag);
			}
		}
	}
	var artistImageSource = (data.artist.image[2]['#text'] === '') ? 'img/no_artist.jpg' : data.artist.image[2]['#text']

	var artistInfoRow = jQuery('' +
		'<div class="row artist-information">' +
		'	<div class="col-lg-2">' +
		'		<div class="artist-container">' +
		'			<img src="' + artistImageSource + '" >' +
		'		</div>' +
		'	</div>' +
		'	<div class="col-lg-6 bio">' +
		'		<h2>' + data.artist.name + '<i class="icon-star-empty"></i></h2>' +
		'	</div>' +
		'</div>'
	);


	if(!_.isUndefined(data.artist.bio.content)) {
		var artistContent = data.artist.bio.content.replace(/(<([^>]+)>)/ig, "");
		if(artistContent === '') {
			var bio = jQuery('<p class="info">There is no information about ' + data.artist.name + ' on last.fm :(</p>');
			artistInfoRow.find('div.bio').append(bio);
		} else {
			var bio = jQuery('<p class="info">' + s2t.main.functions.removeLastSentence(s2t.main.functions.removeLastSentence(artistContent)) +'</p>');
			artistInfoRow.find('div.bio').append(bio);
		}
	}


	s2t.behaviour.setStarBehaviour(artistInfoRow.find('i'), artistId);

	artistInfoRow.find('p.info').after(tagContainer);

	callback(artistInfoRow);
}


//TODO: Weiter ausbauen und bessser infos über related artists anzeigen
s2t.main.getRelatedArtistsView = function(data, callback) {
	var hasSimilar = false;
	var simFail = jQuery('<div class="row similar-artists"><h3>There are no related artists in your library :(</h3></div>');

	if(_.isUndefined(data.artist)) {
		callback(simFail);
		return false;
	}

	var artistList = data.artist.similar.artist;

	var similarTable = jQuery('' +
		'<div class="col-lg-10">' +
		'	<table class="similar-table table">' +
		'		<tbody></tbody>' +
		'	</table>' +
		'</div>'
	);

	if(_.has(data.artist.similar, 'artist')) {
		for(var j=0; j<artistList.length; j++) {
			var artist = artistList[j].name;
			var artistId = s2t.artistMap[artist];

			if(typeof artistId !== 'undefined') {
				hasSimilar = true;

				createItem(artistId, artist, function(item) {
					similarTable.find('tbody').append(item);
				});
			}
		}
	}

	function createItem(artistId, artist, callback) {
		//get image
		s2t.lastfm.getArtistInfo(artist, function(data) {

			if(_.has(data.artist, 'image')) {
				var imgSource = data.artist.image[2]['#text'];
			} else {
				var img = '#';
			}

			var row = jQuery('<tr class="albumItem"></tr>');

			var imageData = jQuery('<td class="artistImage"></td>');
			var infoData  = jQuery('<td class="artistInfo"></td>');

			//image
			var img = jQuery('<a href="#" data-id="' + artistId +'"><img src="' + imgSource + '" title="' + artist + '"  ></a>');
			imageData.append(img);

			var bio = s2t.main.functions.removeLastSentence(s2t.main.functions.removeLastSentence(data.artist.bio.content.replace(/(<([^>]+)>)/ig, "")));

			//info data
			var artistTitle  = jQuery('<h3>' + data.artist.name + '<span>' + data.artist.bio.yearformed + '</span></h3>');
			var artistOrigin = jQuery('<div class="origin">' + data.artist.bio.placeformed  + '</div>');
			var artistBio    = jQuery('<div class="bio">' + bio + '</div>');

			infoData.append(artistTitle);
			infoData.append(artistOrigin);
			infoData.append(artistBio);

			img.on('click', function(event) {
				event.preventDefault();

				s2t.api.getArtist(artistId, function (data) {
					s2t.main.createAlbumView(data);
				});
			});
			artistTitle.on('click', function(event) {
				event.preventDefault();

				s2t.api.getArtist(artistId, function (data) {
					s2t.main.createAlbumView(data);
				});
			});



			row.append(imageData);
			row.append(infoData);

			callback(row);
		});
	}

	if(hasSimilar){
		callback(similarTable);
	} else {
		callback(simFail);
	}
}
