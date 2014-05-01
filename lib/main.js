var self    = require('sdk/self');
var style   = require('sdk/stylesheet/utils');
var events  = require("sdk/system/events");
var windows = require("sdk/window/utils");

function listener(event) {
	var window = event.subject.parent;

	style.loadSheet(window, self.data.url('tabs.css'), 'author');

	if(window.document.getElementById('toolbar-menubar').getAttribute("autohide") == 'true')
		style.loadSheet(window, self.data.url('menubar.css'), 'author');
	else
		style.removeSheet(window, self.data.url('menubar.css'), 'author');
}

events.on('chrome-document-global-created', listener);

style.loadSheet(windows.getMostRecentBrowserWindow(), self.data.url('tabs.css'), 'author');

if(windows.getMostRecentBrowserWindow().document.getElementById('toolbar-menubar').getAttribute("autohide") == 'true')
	style.loadSheet(windows.getMostRecentBrowserWindow(), self.data.url('menubar.css'), 'author');
else
	style.removeSheet(windows.getMostRecentBrowserWindow(), self.data.url('menubar.css'), 'author');