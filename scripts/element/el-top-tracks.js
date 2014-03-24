var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.createTopTracks = function (trackArray, callback) {

	var fail = jQuery('<p class="topItem">There are no popular tracks :(<p>');

	if(trackArray.length) {
		var elTopTrackTable = jQuery('' +
			'<div class="col-lg-12">' +
			'	<table class="top-track-table left table table-bordered table-condensed">' +
			'		<tbody></tbody>' +
			'	</table>' +
			'	<table class="top-track-table right table table-bordered table-condensed">' +
			'		<tbody></tbody>' +
			'	</table>' +
			'</div>'
		);

		for(var i=0; i< trackArray.length; i++) {
			var item = trackArray[i];
			var dataSignature = {
				albumArtist: item.albumArtist.toString().replace("'", ""), //Escape it!
				artistId: 	 item.artistId.toString(),
				albumId: 	 item.albumId.toString(),
				albumName: 	 item.albumName.toString().replace("'", ""),  //Escape it!
				songId: 	 item.songId.toString(),
				songYear: 	 item.songYear.toString(),
				songBitrate: item.songBitrate.toString(),
				songParent:  item.songParent.toString(),
				songSize: 	 item.songSize.toString(),
				trackTime: 	 item.trackTime.toString(),
				duration:	 item.duration,
				songTitle: 	 item.songTitle.toString().replace("'", "")  //Escape it!
			}

			var row = jQuery('<tr class="topItem"></tr>');
			var count = parseInt(i) < 9 ? '0'+parseInt(i+1) : parseInt(i+1);

			var row = jQuery('<tr class="topItem"></tr>');
			var count = parseInt(i) < 9 ? '0'+parseInt(i+1) : parseInt(i+1);

			if (item.image === false) {
				imageSource = "img/no_album_bg.jpg";

			} else {
				imageSource = item.image;
			}

			var position = jQuery('<td class="position">' + count + '</td>');
			var optStar  = jQuery('<td class="star"><i class="icon-star-empty"></i></td>');
			var song 	 = jQuery("" +
				"<td class='song'>" +
				"	<a href='#' data-signature='" + JSON.stringify(dataSignature) + "'>" +
				"		<img src='" + imageSource + "' width='34' height='34'>	" +
				"		<div>"+
				"			<span>" + item.songTitle +"</span>"+
				"			<span>" + item.playcount +"</span>"+
				"		</div>"+
				"	</a>" +
				"</td>");

			//prettify count
			song.find('span:last-of-type').prettynumber();

			if(s2t.main.isStarred(item.songId) === true) {
				optStar.find('i').removeClass('icon-star-empty');
				optStar.find('i').addClass('icon-star');
			} else {
				optStar.find('i').addClass('icon-star-empty');
				optStar.find('i').removeClass('icon-star');
			}
			s2t.behaviour.setStarBehaviour(optStar.find('i'), item.songId);

			//Row Rightclick
			row.on('mousedown', function(event){
				if( event.button == 2 ) {
					jQuery('.top-track-table tbody tr').removeClass('selected');
					jQuery(this).addClass('selected');
				}
			});

			//highglight selected row
			row.on('click', function (event) {
				jQuery('.top-track-table tbody tr').removeClass('selected');
				jQuery(this).addClass('selected');
			});

			//Row doubleclick
			row.on('dblclick', function () {
				var songData = jQuery(this).find('td.song a').data('signature');
				s2t.main.addSongToPlaylist(songData);
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

			row.append(position);
			row.append(optStar);
			row.append(song);

			if(i <= 9) {
				elTopTrackTable.find('table.top-track-table.left tbody').append(row);
			} else {
				elTopTrackTable.find('table.top-track-table.right tbody').append(row);
			}
		}

		callback(elTopTrackTable);
	}
	else {
		callback(fail);
	}

}

