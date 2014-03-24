var s2t = s2t || {}

s2t.main = s2t.main || {}

s2t.main.createCustomScrollbar = function (element, theme, mwPixels)
{

	var look   = (typeof theme === 'undefined') ? 'mCS-light-thin' : theme;
	var scroll = (typeof mwPixels === 'undefined') ? 50 : mwPixels;

	element.mCustomScrollbar({
		horizontalScroll: false,
		autoDraggerLength: true,
		scrollButtons: {
			enable: true
		},
		theme: look,
		scrollInertia: 100,
		mouseWheelPixels: scroll,
		mouseWheel: true,
		autoHideScrollbar: true,
		advanced: {
			updateOnContentResize: true,
			updateOnBrowserResize: true,
			normalizeMouseWheelDelta: true
		},
		contentTouchScroll: true
	});
}
