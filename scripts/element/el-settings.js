var s2t = s2t || {}

s2t.main = s2t.main || {}


/* --------------------------------------------------
 :: initialize Settings
 ---------------------------------------------------*/
s2t.main.initSettings = function () {

	var settingsContainer = jQuery('#settings');

	var button = jQuery('#settings-trigger');
	var settings
	button.on('click', function(event) {
		event.preventDefault();
		settingsContainer.modal('show');
	});

	settingsContainer.on('show.bs.modal', function () {
//		jQuery('section.view-top').addClass('blur');
//		jQuery('section.view-center').addClass('blur');
//		jQuery('section.view-main').addClass('blur');
	});
	settingsContainer.on('hide.bs.modal', function () {
//		jQuery('section.view-top').removeClass('blur');
//		jQuery('section.view-center').removeClass('blur');
//		jQuery('section.view-main').removeClass('blur');
	});


	var inputServer = settingsContainer.find('input.server');
	var inputUser   = settingsContainer.find('input.username');
	var inputPass   = settingsContainer.find('input.password');
	var buttonTest  = settingsContainer.find('button.testserver');
	var buttonSave  = settingsContainer.find('button.save');
	var buttonConnection  = settingsContainer.find('button.connection');

	var ok   = settingsContainer.find('i.ok');
	var fail = settingsContainer.find('i.fail');

	if(s2t.data.server !== false) {
		inputServer.val(s2t.data.server);
	}
	if(s2t.data.user !== false) {
		inputUser.val(s2t.data.user);
	}
	if(s2t.data.pass !== false) {
		inputPass.val(s2t.data.pass);
	}

	buttonConnection.on('click', function(event) {
		event.preventDefault();

		s2t.data.server = inputServer.val();
		s2t.data.user	= inputUser.val();
		s2t.data.pass   = inputPass.val();

		s2t.api.ping(function(data) {
			if(data['subsonic-response'].status === 'ok') {
				fail.hide();
				ok.show();
			}
			else {
				fail.show();
				ok.hide();
			}
		});
	});

	buttonTest.on('click', function() {
		inputServer.val('http://demo.subsonic.org/');
		inputUser.val('guest1');
		inputPass.val('guest');
	});

	buttonSave.on('click', function() {
		s2t.data.server = inputServer.val();
		s2t.data.user	= inputUser.val();
		s2t.data.pass   = inputPass.val();

		$('#settings').modal('hide')
	});
}
