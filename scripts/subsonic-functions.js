
/* -------------------------------------------------- 
:: s2t Helper Functions
---------------------------------------------------*/
s2t.main.functions = s2t.main.functions || {}

s2t.main.functions.showLoadingScreen = function()
{
	jQuery('#loader').show();
}

s2t.main.functions.hideLoadingScreen = function()
{
	jQuery('#loader').hide();
}


s2t.main.functions.secondsToTime = function (secs)
{
	var hours = Math.floor(secs / (60 * 60));

	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	var _seconds = (seconds < 10) ? '0' + seconds: seconds

	var obj = {
		"h": hours,
		"m": minutes,
		"s": _seconds
	};
	return obj;
}

s2t.main.isStarred = function(id)
{
	var isStarred = false;
	if(typeof s2t.starredObjects[id] !== 'undefined') {
		if(s2t.starredObjects[id] !== 'false') {
			isStarred = true;
		}
	}
	return isStarred;
}


s2t.main.persistStarredObjects = function (callback)
{
	s2t.api.getStarred(function(obj) {
		var data = obj.starred;

		//albums
		if(_.has(data, 'album')){
			if (data.album instanceof Array) {
				for(var i=0; i<data.album.length; i++) {
					s2t.starredObjects[data.album[i].id] = data.album[i];
				}
			} else {
				s2t.starredObjects[data.album.id] = data.album;
			}
		}
		//songs
		if(_.has(data, 'song')){
			if (data.song instanceof Array) {
				for(var i=0; i<data.song.length; i++) {
					s2t.starredObjects[data.song[i].id] = data.song[i];
				}
			} else {
				s2t.starredObjects[data.song.id] = data.song;
			}
		}
		//artists
		if(_.has(data, 'artist')){
			if (data.artist instanceof Array) {
				for(var i=0; i<data.artist.length; i++) {
					s2t.starredObjects[data.artist[i].id] = data.artist[i];
				}
			} else {
				s2t.starredObjects[data.artist.id] = data.artist;
			}
		}
		callback('ready');
	});
}


s2t.main.functions.hasHtml5Storage = function ()
{
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}


s2t.main.functions.escapeHtml = function (string)
{
	return string.replace(/\\n/g, "\\n")
		.replace(/\\'/g, "\\'")
		.replace(/\\&/g, "\\&")
		.replace(/\\r/g, "\\r")
		.replace(/\\t/g, "\\t")
		.replace(/\\b/g, "\\b")
		.replace(/\\f/g, "\\f");
}

s2t.main.functions.removeLastSentence = function(text) {

	lastSeparator = Math.max(
		text.lastIndexOf("."),
		text.lastIndexOf("!"),
		text.lastIndexOf("?")
	);

	revtext = text.split('').reverse().join('');
	sep = revtext.search(/[A-Z]\s+(\")?[\.\!\?]/);
	lastTag = text.length-revtext.search(/\/\</) - 2;

	lastPtr = (lastTag > lastSeparator) ? lastTag : text.length;

	if (sep > -1) {
		text1 = revtext.substring(sep+1, revtext.length).trim().split('').reverse().join('');
		text2 = text.substring(lastPtr, text.length).replace(/['"]/g,'').trim();

		sWithoutLastSentence = text1 + text2;
	} else {
		sWithoutLastSentence = '';
	}
	return sWithoutLastSentence;
}

var Base64 = {

// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}


/* --------------------------------------------------
 :: Save data to persistence
 ---------------------------------------------------*/
s2t.main.functions.saveData = function (song, coverUrl) {
	s2t.data.memory.currentSongId = song.songId;
	s2t.data.memory.currentSongName = song.songTitle;
	s2t.data.memory.currentArtist = song.albumArtist;
	s2t.data.memory.currentArtistId = song.artistId;
	s2t.data.memory.currentSongAlbum = song.albumName;
	s2t.data.memory.currentSongAlbumImage = coverUrl;
}

s2t.main.functions.isEven = function(n)
{
	return s2t.main.functions.isNumber(n) && (n % 2 == 0);
}

s2t.main.functions.isOdd = function(n)
{
	return s2t.main.functions.isNumber(n) && (n % 2 == 1);
}

s2t.main.functions.isNumber = function(n)
{
	return n === parseFloat(n);
}

s2t.main.functions.lazyLoad = function(img)
{
	jQuery('img').lazyload({
		effect : "fadeIn",
		skip_invisible : true
	});

}

