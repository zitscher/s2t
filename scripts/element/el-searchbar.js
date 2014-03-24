var s2t = s2t || {}

s2t.main = s2t.main || {}


s2t.main.initializeSearchbar = function () {
	var search = jQuery('#search');
	var searchBtn = jQuery('#search-button');

	search.typeahead({
		name: 'artists',
		local: s2t.data.artists,
		limit: 10,
		autoselect: true,
		hightlight: true,
		hint: true
	});

	search.on('typeahead:selected', function (object, datum) {
		showArtist(datum.value);
	});

	search.on('keydown', function (event) {
		if (searchBtn.hasClass('delete')) {
			searchBtn.removeClass('delete').addClass('search');
		}

		if (event.keyCode == 13) {
			event.preventDefault();
			showArtist(jQuery(this).val());
		}
	});

	search.on('focusin', function () {
		jQuery(this).attr('placeholder', '');
		if (search.val() !== '') {
			searchBtn.removeClass('search').addClass('delete');
		}
	});
	search.on('focusout', function () {
		jQuery(this).attr('placeholder', 'Search');
	});

	searchBtn.on('click', function (event) {
		event.preventDefault();
		if (searchBtn.hasClass('search')) {
			showArtist(search.val());
		}
		else if (searchBtn.hasClass('delete')) {
			search.val('');
			jQuery('.tt-hint').val('');
			search.focus();
			searchBtn.removeClass('delete').addClass('search');
		}
	})

	function showArtist(id) {
		var result = s2t.artistMap[id];

		if (typeof result !== 'undefined') {
			s2t.api.getArtist(result, function (data) {
				s2t.main.createAlbumView(data);
			});
		}
	}
}