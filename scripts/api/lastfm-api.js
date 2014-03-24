
var s2t = s2t || {}

s2t.lastfm = s2t.lastfm || {}

s2t.lastfm.getData = function(command, params, callback)
{
	var url = s2t.data.lastfm.server;

	var parameter = {
		method: command,
		api_key: s2t.data.lastfm.key,
		format: 'json'
	}

	if(params) {
		jQuery.extend(parameter, params);
	}	

	jQuery.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'json',
		data: parameter,

		success: function (data) {
			callback(data);
		},

		error: function(err) {
			alert("Lastfm Problems - " + err.statusText);
			console.log(err);
		}
	});
}


/* -------------------------------------------------- 
    :: Returns an indexed structure of all artists.
    :: @param {String}  artist 
---------------------------------------------------*/
s2t.lastfm.getArtistInfo = function (artist, callback) 
{
	var command = 'artist.getInfo'
	var params = {
		artist: artist
	}

	s2t.lastfm.getData(command, params, function(response) {
		callback(response)
	});
}


/* --------------------------------------------------
 :: Returns an indexed structure of all artists.
 :: @param {String}  artist
 ---------------------------------------------------*/
s2t.lastfm.getTopTracks = function (artist, callback)
{
	var command = 'artist.getTopTracks'
	var params = {
		artist: artist,
		limit: 20
	}

	s2t.lastfm.getData(command, params, function(response) {
		callback(response)
	});
}


/* -------------------------------------------------- 
    :: Returns the metadata and tracklist for an album
    :: @param {String}  artist, {String}  album
---------------------------------------------------*/
s2t.lastfm.getAlbumInfo = function (artist, album, albumId, callback)
{
	var command = 'album.getInfo'
	var params = {
		artist: artist,
		album: album
	}

	s2t.lastfm.getData(command, params, function(response) {
		callback(response)
	});
}