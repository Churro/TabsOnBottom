var events  = require('sdk/system/events');
var prefs   = require('sdk/simple-prefs');
var self    = require('sdk/self');
var style   = require('sdk/stylesheet/utils');
var windows = require('sdk/window/utils');

var { attachTo, detachFrom } = require("sdk/content/mod");
var Style = require("sdk/stylesheet/style").Style;

var prefOtherTabsColor = "otherTabsColor";
var otherTabsColor;

var otherTabsShadow = Style({
	source: '.tabbrowser-tab:not([selected="true"]) { text-shadow: 0 0 3px }'
});

var newTabsSearchBar = Style({
	uri: self.data.url('search_bar.css')
});

function prefsUpdate() {
	var listWindows = windows.windows();

	for (var i = 0; i < listWindows.length; i++)
		applyStyleOtherTabs(listWindows[i]);
}

function applyStyleOtherTabs(window) {
	if(typeof otherTabsColor !== "undefined")
		detachFrom(otherTabsColor, window);

	otherTabsColor = Style({
		source: '.tabbrowser-tab:not([selected="true"]) { color: ' + prefs.prefs[prefOtherTabsColor] + ' }'
	});

	attachTo(otherTabsColor, window);

	if(prefs.prefs["otherTabsShadow"])
		attachTo(otherTabsShadow, window);
	else
		detachFrom(otherTabsShadow, window);

	if(prefs.prefs["searchBarNewTabPage"])
		attachTo(newTabsSearchBar, window);
	else
		detachFrom(newTabsSearchBar, window);
}

function applyStyle(window) {
	applyStyleOtherTabs(window);

	style.loadSheet(window, self.data.url('tabs.css'), 'author');

	if(window.document.getElementById('toolbar-menubar') != null && window.document.getElementById('toolbar-menubar').getAttribute("autohide") == 'true')
		style.loadSheet(window, self.data.url('menubar.css'), 'author');
	else
		style.removeSheet(window, self.data.url('menubar.css'), 'author');
}

function listener(event) {
	applyStyle(event.subject.parent);
}

events.on('chrome-document-global-created', listener);

exports.main = function (options, callbacks) {
	prefs.on("", prefsUpdate);

	var listWindows = windows.windows();

	for (var i = 0; i < listWindows.length; i++)
		applyStyle(listWindows[i]);
};

exports.onUnload = function (reason) {
	var listWindows = windows.windows();

	for (var i = 0; i < listWindows.length; i++) {
		style.removeSheet(listWindows[i], self.data.url('tabs.css'), 'author');
		style.removeSheet(listWindows[i], self.data.url('menubar.css'), 'author');

		if(prefs.prefs["searchBarNewTabPage"])
			style.removeSheet(listWindows[i], self.data.url('search_bar.css'), 'author');

		detachFrom(otherTabsColor, listWindows[i]);
		detachFrom(otherTabsShadow, listWindows[i]);
		detachFrom(newTabsSearchBar, listWindows[i]);
	}
};