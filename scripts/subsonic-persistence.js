var s2t = s2t || {}

s2t.data = {
	server: 'http://demo.subsonic.org/',
	user: 'guest5',
	pass: 'guest',
	version: '1.9.0',
	app: 'subsonic-touch',

	lastfm: {
		server: 'http://ws.audioscrobbler.com/2.0/',
		key: '352246b2c1e0353857cf0a7b25b5f4ff'
	},

	options: {
		shuffle: false,
		repeat: false,
		volume: 100
	},

	memory: {
		currentSongId: false,
		currentSongName: false,
		currentArtist: false,
		currentArtistId: false,
		currentSongAlbum: false,
		currentSongAlbumImage: false
	},

	queue: [],
	artists: []
}

//artistMap for search purposes (!)
s2t.artistMap = [];
//trackMap for search purposes (!)
s2t.trackMap = [];
//topTrackList for search purposes (!)
s2t.topTrackList = [];
//starredObjects for search purposes (!)
s2t.starredObjects = [];


s2t.initializePersistence = function () {
	//fetch data
	if (s2t.main.functions.hasHtml5Storage()) {
		s2t.getData();
	}

	// watch data object for changes
	// and save them to local storage
	watch(s2t.data, function(){
		s2t.setData();
	});
}

s2t.setData = function () {
	//setOptions
	var data = JSON.stringify(s2t.data);
	localStorage['s2t.data'] = data;
}

s2t.getData = function () {
	var dataString = localStorage['s2t.data'];
	if(typeof dataString === 'undefined') {
		//init for first time
		s2t.setData();
	}

	if (dataString) {
		var dataObject = jQuery.parseJSON(dataString);
		s2t.data = dataObject;
	}
}