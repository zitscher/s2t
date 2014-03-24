var s2t = s2t || {}

s2t.main = s2t.main || {}


/* --------------------------------------------------
 :: Create artist Accordion
 ---------------------------------------------------*/
s2t.main.createArtistAccordion = function (callback) {
	s2t.api.getIndexes(function (data) {

		var bigList = data.indexes.index;

		var artistArray = [];
		var artistMap = [];
		var accordion = jQuery('#artist-accordion');

		for (var i = 0; i < bigList.length; i++) {
			var key = bigList[i].name;
			var artistList = bigList[i].artist;

			var accordionGroup = jQuery('<div class="accordion-group"></div>');
			var accordionHeading = jQuery('<div class="accordion-heading"></div>');
			var accordionToggle = jQuery('<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#artist-accordion" href="#group-' + key + '">' + key + '</a>');

			var accordionBody = jQuery('<div id="group-' + key + '" class="accordion-body collapse"></div>');
			var accordionInner = jQuery('<div class="accordion-inner"></div>');

			//assemble accordion
			accordionBody.append(accordionInner);
			accordionHeading.append(accordionToggle);

			accordionGroup.append(accordionHeading);
			accordionGroup.append(accordionBody);

			var list = jQuery('<ul></ul>');

			if(artistList instanceof Array) {
				for (var t = 0; t < artistList.length; t++) {
					var artistId = artistList[t].id;
					var artist = artistList[t].name;
					var listItem = jQuery('<li><a href="#" data-artistId="' + artistId + '">' + artist + '</a></li>');
					list.append(listItem);
					artistArray.push(artist);
					artistMap[artist.toString()] = artistId.toString();
					s2t.artistMap[artist.toString()] = artistId.toString();
				}
			} else {
				var artistId = artistList.id;
				var artist = artistList.name;
				var listItem = jQuery('<li><a href="#" data-artistId="' + artistId + '">' + artist + '</a></li>');
				list.append(listItem);
				artistArray.push(artist);
				artistMap[artist.toString()] = artistId.toString();
				s2t.artistMap[artist.toString()] = artistId.toString();
			}

			accordionToggle.on('click', function() {
				jQuery('#artist-accordion').mCustomScrollbar("update");
			});

			accordionInner.append(list);
			accordion.append(accordionGroup);
		}

		//calculate dyn height
		$(window).trigger('resize');

		//init custom scrollbar
		s2t.main.createCustomScrollbar(accordion);

		//Behaviour
		jQuery('#artist-accordion .accordion-inner a').each(function () {
			s2t.behaviour.setArtistClickBehaviour(jQuery(this));
		});

		s2t.data.artists = artistArray;

		callback('done');
	});
}


s2t.main.createArtistAccordion_ = function (callback) {
	s2t.api.getArtists(function (data) {

		var bigList = data.artists.index;

		var artistArray = [];
		var artistMap = [];
		var accordion = jQuery('#artist-accordion');

		for (var i = 0; i < bigList.length; i++) {
			var key = bigList[i].name;
			var artistList = bigList[i].artist;

			var accordionGroup = jQuery('<div class="accordion-group"></div>');
			var accordionHeading = jQuery('<div class="accordion-heading"></div>');
			var accordionToggle = jQuery('<a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#artist-accordion" href="#group-' + key + '">' + key + '</a>');

			var accordionBody = jQuery('<div id="group-' + key + '" class="accordion-body collapse"></div>');
			var accordionInner = jQuery('<div class="accordion-inner"></div>');

			//assemble accordion
			accordionBody.append(accordionInner);
			accordionHeading.append(accordionToggle);

			accordionGroup.append(accordionHeading);
			accordionGroup.append(accordionBody);

			var list = jQuery('<ul></ul>');

			if(artistList instanceof Array) {
				for (var t = 0; t < artistList.length; t++) {
					var artistId = artistList[t].id;
					var artist = artistList[t].name;
					var listItem = jQuery('<li><a href="#" data-artistId="' + artistId + '">' + artist + '</a></li>');
					list.append(listItem);
					artistArray.push(artist);
					artistMap[artist.toString()] = artistId.toString();
					s2t.artistMap[artist.toString()] = artistId.toString();
				}
			} else {
				var artistId = artistList.id;
				var artist = artistList.name;
				var listItem = jQuery('<li><a href="#" data-artistId="' + artistId + '">' + artist + '</a></li>');
				list.append(listItem);
				artistArray.push(artist);
				artistMap[artist.toString()] = artistId.toString();
				s2t.artistMap[artist.toString()] = artistId.toString();
			}

			accordionInner.append(list);
			accordion.append(accordionGroup);
		}

		//calculate dyn height
		$(window).trigger('resize');

		//init custom scrollbar
		s2t.main.createCustomScrollbar(accordion);

		//Behaviour
		jQuery('#artist-accordion .accordion-inner a').each(function () {
			s2t.behaviour.setArtistClickBehaviour(jQuery(this));
		});

		s2t.data.artists = artistArray;

		callback('done');
	});
}