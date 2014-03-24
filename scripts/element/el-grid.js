var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.initializeGridLayout = function () {
	//init layout for first time
	setLayout();

	//resize on window resize event
	$(window).resize(function () {
		setLayout();
	});

	function setLayout() {
		var browser = $(window);
		var body = jQuery('body');

		var viewTop = body.find('section.view-top');
		var viewCenter = body.find('section.view-center');
		var viewBottom = body.find('section.view-bottom');
		var viewLeft = body.find('section.view-left');
		var viewMain = body.find('section.view-main');
		var viewMainTop = body.find('section.view-main-top');
		var viewMainBottom = body.find('section.view-main-bottom');

		//calculate viewCenter Height
		var viewCenterHeight = browser.height() - viewBottom.height() - viewTop.height();
		viewCenter.height(viewCenterHeight);

		//calculate viewMain Width
		var viewMainWidth = browser.width() - viewLeft.width();
		viewMain.width(viewMainWidth);

		//set left position for viewMain
		var viewLeftWidth = browser.width() - viewMainWidth;
		viewMain.css({'left': viewLeftWidth});

		//set height for viewMainBottom
		var viewMainBottomHeight = viewCenterHeight - viewMainTop.height();
		viewMainBottom.height(viewMainBottomHeight);

		//set view-left resizable
		jQuery('section.view-left').resizable({
			maxWidth: 300,
			minWidth: 150,
			handles: "e",
			resize: function (event, ui) {
				jQuery('#artist-accordion').trigger('resize');
				jQuery('#artist-accordion').mCustomScrollbar("update");
			}
		});

		//set view-main-bottom resizable
		var mainTopMaxHeight = parseInt(viewCenterHeight * 0.8);
		var mainTopMinHeight = parseInt(viewCenterHeight * 0.2);
		jQuery('section.view-main-top').resizable({
			maxHeight: mainTopMaxHeight,
			minHeight: mainTopMinHeight,
			handles: "s",
			resize: function( event, ui ) {
				jQuery('table.table-playlist').mCustomScrollbar("update");
			}
		});

		//calculate artist list height
		var artistList = body.find('#artist-accordion');
		var informationPanel = body.find('#information-panel');
		var starredButton = body.find('#show-starred');
		var playlistButton = body.find('#show-playlists');
		var randomButton = body.find('#dj-random');

		var artistListHeight = viewCenterHeight - informationPanel.height() - starredButton.outerHeight() - playlistButton.outerHeight() - randomButton.outerHeight();
		artistList.height(artistListHeight);

		artistList.mCustomScrollbar("update");

		//set tab navbar width if there
		var tabBar = jQuery('#album-tab-nav');
		if(tabBar.length) {
			tabBar.width(viewMain.width());
		}

	}
}