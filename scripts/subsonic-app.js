jQuery(document).ready(function () {
	s2t.main.initializeApp();
});

var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.initializeApp = function () {

	s2t.initializePersistence();

	s2t.main.initializeGridLayout();

	s2t.main.persistStarredObjects(function() {

		s2t.main.setOriginalState();

		s2t.main.createArtistAccordion_(function() {
			s2t.main.initializeSearchbar();
		});

		s2t.main.createCustomScrollbar(jQuery('.playlist-table'));

	});

	s2t.main.initSettings();

	s2t.main.initializeCustomContextMenu();

	s2t.sound.initSoundManager(function () {
		//player ready callback
		s2t.main.initMusicControlBehaviour();
	});

	s2t.main.updatePlaylistBehaviour();

	s2t.main.initializeRandomView();

	s2t.main.initializeShortcuts();

	//Turn of some bootstrap default behaviour
	jQuery(document).off('click.tab.data-api');

}