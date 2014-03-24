var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.initializeTableFilter = function (filterButton) {

	jQuery('.tab-navigation').find('a').not('#table-search').click(function (e) {
		e.preventDefault();

		var clickedListItem = jQuery(this).parent();
		if(clickedListItem.is('li.searchable')) {
			clickedListItem.parent().find('.filter').show();
		} else {
			clickedListItem.parent().find('.filter').hide();
		}

		resetFilter();
		$(this).tab('show');
	});


	var view  = jQuery('div.artist-albums');
	var filterContainer = filterButton.next();
	var filterInput = filterButton.next().find('input');

	//filter
	filterButton.on('click', function(event) {
		event.preventDefault();
		filterContainer.removeClass('hidden');
		filterInput.focus();
	});

	//input behaviour
	filterInput.on('keyup', function(event) {
		var irrelevantContent = jQuery('.tab-pane .album .image-container, .tab-pane .album h3');
		var rows  = jQuery('section.view-main-top table tr');
		var value = jQuery(this).val();

		if(event.keyCode == 27) {
			resetFilter();
			return false;
		}

		if(value !== '') {
			irrelevantContent.hide();
			view.addClass('filtered');
		} else {
			irrelevantContent.show();
			view.removeClass('filtered');
		}

		var rex = new RegExp(value, 'i');
		rows.hide();
		rows.filter(function() {
			return rex.test(jQuery(this).text());
		}).show();
	});

	filterButton.next().find('i').on('click', function() {
		resetFilter();
	});

	function resetFilter() {
		var irrelevantContent = jQuery('.tab-pane .album .image-container, .tab-pane .album h3');
		var rows  = jQuery('section.view-main-top table tr');
		filterContainer.addClass('hidden');
		irrelevantContent.show();
		view.removeClass('filtered');
		filterInput.val('');
		rows.show();
	}
}
