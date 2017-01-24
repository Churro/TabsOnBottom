"use strict";

const prefs = require('sdk/simple-prefs');
const self = require('sdk/self');
const Style = require('sdk/stylesheet/style').Style;
const tabs = require('sdk/tabs');
const { attach, detach, attachTo, detachFrom } = require('sdk/content/mod');
const { viewFor } = require('sdk/view/core');
const { browserWindows } = require('sdk/windows');

const otherTabsShadow  = Style({ source: '.tabbrowser-tab:not([selected="true"]) { text-shadow: 0 0 3px }' });
const TabsToolbarStyle = Style({ uri: self.data.url('tabs.css') });
const newTabsSearchBar = Style({ uri: self.data.url('search_bar.css') });

var otherTabsColor;

function prefsUpdate() {
  Array.prototype.forEach.call(browserWindows, applyStyleOtherTabs);
  searchBar(false);
}

function addNewTabsSearchBarStyle() {
  if (tabs.activeTab.url != 'about:newtab') return;
  attach(newTabsSearchBar, tabs.activeTab);
}

function searchBar(initial) {
  if (prefs.prefs['searchBarNewTabPage']) {
    tabs.on('load', addNewTabsSearchBarStyle);
    tabs.on('activate', addNewTabsSearchBarStyle);
  } else if (!initial) {
    tabs.off('load', addNewTabsSearchBarStyle);
    tabs.off('activate', addNewTabsSearchBarStyle);
    Array.prototype.forEach.call(tabs, (tab) => detach(newTabsSearchBar, tab));
  }
}

function applyStyleOtherTabs(win) {
  let window = viewFor(win);
  if (typeof otherTabsColor !== "undefined")
    detachFrom(otherTabsColor, window);

  otherTabsColor = Style({ source: '.tabbrowser-tab:not([selected="true"]) { color: ' + prefs.prefs['otherTabsColor'] + ' }' });
  attachTo(otherTabsColor, window);

  if (prefs.prefs['otherTabsShadow'])
    attachTo(otherTabsShadow, window);
  else
    detachFrom(otherTabsShadow, window);
}

function applyStyle(win) {
  applyStyleOtherTabs(win);

  let window = viewFor(win);
  attachTo(TabsToolbarStyle, window);

  if (window.document.getElementById('toolbar-menubar') != null &&
      window.document.getElementById('toolbar-menubar').getAttribute('autohide') == 'false') {
    window.document.getElementById('nav-bar').style.marginTop = "0";
  }
}

exports.main = (options, callbacks) => {
  prefs.on("", prefsUpdate);

  Array.prototype.forEach.call(browserWindows, applyStyle);
  browserWindows.on('open', applyStyle);
  searchBar(true);
};

exports.onUnload = (reason) => {
  Array.prototype.forEach.call(browserWindows, win => {
    let window = viewFor(win);
    detachFrom(TabsToolbarStyle, window);
    detachFrom(otherTabsColor,   window);
    detachFrom(otherTabsShadow,  window);
  });
};
