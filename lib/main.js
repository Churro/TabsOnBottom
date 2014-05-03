var self    = require('sdk/self');
var style   = require('sdk/stylesheet/utils');
var events  = require("sdk/system/events");
var windows = require("sdk/window/utils");

function listener(event) {
	var window = event.subject.parent;

	style.loadSheet(window, self.data.url('tabs.css'), 'author');

	if(window.document.getElementById('toolbar-menubar') != null && window.document.getElementById('toolbar-menubar').getAttribute("autohide") == 'true')
		style.loadSheet(window, self.data.url('menubar.css'), 'author');
	else
		style.removeSheet(window, self.data.url('menubar.css'), 'author');
}

events.on('chrome-document-global-created', listener);

exports.main = function (options, callbacks) {
	var listWindows = windows.windows();

	for (var i = 0; i < listWindows.length; i++) {
		style.loadSheet(listWindows[i], self.data.url('tabs.css'), 'author');

		if(listWindows[i].document.getElementById('toolbar-menubar') != null && listWindows[i].document.getElementById('toolbar-menubar').getAttribute("autohide") == 'true')
			style.loadSheet(listWindows[i], self.data.url('menubar.css'), 'author');
		else
			style.removeSheet(listWindows[i], self.data.url('menubar.css'), 'author');
	}

};

exports.onUnload = function (reason) {
	var listWindows = windows.windows();

	for (var i = 0; i < listWindows.length; i++) {
		style.removeSheet(listWindows[i], self.data.url('tabs.css'), 'author');
		style.removeSheet(listWindows[i], self.data.url('menubar.css'), 'author');
	}
};