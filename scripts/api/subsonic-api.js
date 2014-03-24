
var s2t = s2t || {}

s2t.api = s2t.api || {}

s2t.api.execCommand = function(command, params, callback)
{
	var url = s2t.data.server + 'rest/' + command + '.view';

	var parameter = {
		u: s2t.data.user,
		p: s2t.data.pass,
		v: s2t.data.version,
		c: s2t.data.app,
		f: 'jsonp'
	}

	if(params) {
		jQuery.extend(parameter, params);
	}	

	jQuery.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		timeout: 12000,
		data: parameter,

		beforeSend: function() {
			s2t.main.functions.showLoadingScreen();
		},

		success: function (response) {
			var data = response['subsonic-response'];


			if(data.status === 'ok') {
				callback(data);
			}
			else {
				// error!
				console.log(response);
			}

		},

		error: function(err, t, m) {
			if(t==="timeout") {
				alert("got timeout");
			}

			callback(err);
			alert(err);
		},

		complete: function(jqXHR, status) {
			s2t.main.functions.hideLoadingScreen();
		}
	});
}


/* -------------------------------------------------- 
    :: Returns an indexed structure of all artists.
---------------------------------------------------*/
s2t.api.getIndexes = function (callback) 
{
	var command = 'getIndexes'

	s2t.api.execCommand(command, null, function(response) {
		callback(response)
	});
}


/* -------------------------------------------------- 
    :: Returns a listing of all files in a music directory.
    :: @param {String}  id 
---------------------------------------------------*/
s2t.api.getMusicDirectory = function (id, callback) 
{
	var command = 'getMusicDirectory'
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response)
	});
}


s2t.api.getMusicFolders = function (callback)
{
	var command = 'getMusicFolders'

	s2t.api.execCommand(command, false, function(response) {
		callback(response)
	});
}


/* -------------------------------------------------- 
    :: Returns details for an artist, including a list of albums
    :: @param {String}  id 
---------------------------------------------------*/
s2t.api.getArtist = function (id, callback) 
{
	var command = 'getArtist'
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response)
	});
}

s2t.api.getArtists = function (callback)
{
	var command = 'getArtists'

	s2t.api.execCommand(command, false, function(response) {
		callback(response)
	});
}


/* -------------------------------------------------- 
    :: Returns details for an album, including a list of songs.
    :: @param {String}  id 
---------------------------------------------------*/
s2t.api.getAlbum = function (id, callback) 
{
	var command = 'getAlbum'
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


/* -------------------------------------------------- 
    :: Returns details for a song.
    :: @param {String}  id 
---------------------------------------------------*/
s2t.api.getSong = function (id, callback) 
{
	var command = 'getSong'
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response)
	});
}


s2t.api.getCoverArt = function (id, callback)
{
	var command = 'getCoverArt'
	var params = {
		id: id,
		size: '200'
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response)
	});
}


s2t.api.scrobble = function (songId, submission)
{
	var command = 'scrobble';
	var now = moment().unix();
	var params = {
		id: songId,
		time: now,
		submission: submission
	}
}


s2t.api.ping = function (callback)
{
	var parameter = {
		u: s2t.data.user,
		p: s2t.data.pass,
		v: s2t.data.version,
		c: s2t.data.app,
		f: 'jsonp'
	}
	jQuery.ajax({
		type: 'GET',
		url: s2t.data.server + 'rest/ping.view',
		contentType: "application/json",
		dataType: 'jsonp',
		data: parameter,
		success: function (response) {
			callback(response);
		},
		error: function(err) {
			alert(err);
		}
	});
}


s2t.api.getGenres = function (callback)
{
	var command = 'getGenres';
	s2t.api.execCommand(command, false, function(response) {
		callback(response);
	});
}


s2t.api.getVideos = function (callback)
{
	var command = 'getVideos';

	s2t.api.execCommand(command, false, function(response) {
		callback(response);
	});
}


s2t.api.getStarred = function (callback)
{
	var command = 'getStarred';

	s2t.api.execCommand(command, false, function(response) {
		callback(response);
	});
}


s2t.api.getRandomSongs = function (size, genre, fromYear, toYear, musicFolderId, callback)
{
	var command = 'getRandomSongs';
	var params = {};

	if(size !== false) {
		params['size'] = size;
	}
	if(genre !== false) {
		params['genre'] = genre;
	}
	if(fromYear !== false) {
		params['fromYear'] = fromYear;
	}
	if(toYear !== false) {
		params['toYear'] = toYear;
	}
	if(musicFolderId !== false) {
		params['musicFolderId'] = musicFolderId;
	}

	s2t.api.execCommand(command, params, function(data) {
		callback(data);
	});
}


s2t.api.search3 = function (query, artistCount, artistOffset, albumCount, albumOffset, songCount, songOffset, callback)
{
	var command = 'search3';
	var params = {
		query: query
	};

	if(artistCount !== false) {
		params['artistCount'] = artistCount;
	}
	if(artistOffset !== false) {
		params['artistOffset'] = artistOffset;
	}
	if(albumCount !== false) {
		params['albumCount'] = albumCount;
	}
	if(albumOffset !== false) {
		params['albumOffset'] = albumOffset;
	}
	if(songCount !== false) {
		params['songCount'] = songCount;
	}
	if(songOffset !== false) {
		params['songOffset'] = songOffset;
	}

	s2t.api.execCommand(command, params, function(data) {
		callback(data);
	});
}


s2t.api.getPlaylist = function (id, callback)
{
	var command = 'getPlaylist';
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.getPlaylists = function (callback)
{
	var command = 'getPlaylists';

	s2t.api.execCommand(command, false, function(response) {
		callback(response);
	});
}


s2t.api.createPlaylist = function (playlistId, name, songIdArray, callback)
{
	var command = 'createPlaylist';
	var params = {
		playlistId: playlistId,
		name: name,
		songId: songIdArray
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.updatePlaylist = function (playlistId, name, comment, public, songIdToAddArray, songIndexToRemoveArray, callback)
{
	var command = 'createPlaylist';
	var params = {
		playlistId: playlistId,
		name: name,
		comment: comment,
		public: public,
		songIdToAdd: songIdToAddArray,
		songIndexToRemove: songIndexToRemoveArray

	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.deletePlaylist = function (playlistId, callback)
{
	var command = 'deletePlaylist';
	var params = {
		id: playlistId
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}



s2t.api.download = function (id, callback)
{
	var command = 'download';
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.getAvatar = function (username, callback)
{
	var url = s2t.data.server + 'rest/getAvatar.view';

//	jQuery.ajax({
////		type: 'GET',
//		url: url,
//		data: 'u=' + s2t.data.user + '&p=' + s2t.data.pass + '&v=' + s2t.data.version + '&c=' + s2t.data.app + '&f=json&username=' + s2t.data.user,
//		contentType: "image/jpeg",
//		dataType: 'jsonp',
//		jsonp: true	,
//		format: 'json',
//		processData: true,
//		jsonpCallback: function(data) {
//			console.log(data);
//		},
//
//		success: function (data) {
//			console.log(Base64.decode(data));
//		},
//
//		error: function(err, bla, blub) {
//			console.log(err);
//			console.log(bla);
//			console.log(blub);
//		}
//	});
//
//
//	$.ajax({
//		type : "GET",
//		url : url,
//		data: 'u=' + s2t.data.user + '&p=' + s2t.data.pass + '&v=' + s2t.data.version + '&c=' + s2t.data.app + '&f=json&username=' + s2t.data.user,
//		dataType :"jsonp",
//		jsonp: 'jsonp',
//		jsonpCallback: "myJsonMethod",
//		success : function(data){
//			alert(data);
//		},
//		error : function(httpReq,status,exception){
//			alert(status+" "+exception);
//		}
//	});
//
//
//	function myJsonMethod(data) {
//		console.log(data);
//	}
}


s2t.api.star = function (id, callback)
{
	var command = 'star';
	var params = {
		id: id
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.unstar = function (id, callback)
{

	var command = 'unstar';
	var params = {
		id: id
	}
	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.getChatMessages = function (since, callback)
{
	var command = 'getChatMessages';
	var params = {};

	if(since !== false) {
		params['since'] = since;
	}

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}


s2t.api.addChatMessage = function (message, callback)
{
	var command = 'addChatMessage';
	var params = {
		message: message
	};

	s2t.api.execCommand(command, params, function(response) {
		callback(response);
	});
}