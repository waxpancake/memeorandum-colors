// Memeorandum Colors user script
// version 0.5
// 2016-06-20
// Created by Andy Baio, http://waxy.org/
// Data crunching by Joshua Schachter
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://www.greasespot.net/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Memeorandum Colors", and click Uninstall.
//
// Thanks to Mark Pilgrim's Dive Into Greasemonkey for the guidance.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Memeorandum Colors
// @namespace     http://waxy.org/2008/10/memeorandum_colors/
// @description   Color Memeorandum stories based on linking bias
// @connect       memeorandum.com
// @connect       spreadsheets.google.com
// @include       *memeorandum.com/*
// @grant         GM_xmlhttpRequest
// ==/UserScript==

var req = GM_xmlhttpRequest({
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/4.0 (compatible) Greasemonkey (gzip)',
        'Accept': 'application/xml,text/xml',
        'Accept-Encoding': 'gzip'
    },
    url: 'http://spreadsheets.google.com/feeds/list/0Ag0BxADNLZqgdE1qLTBMQTFQQlQ0TWJxSVNKZ0hQTkE/od6/public/values',
    onload: function(responseDetails) {
        if (responseDetails.status == 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(responseDetails.responseText, "application/xml");
            var entries = xmlDoc.getElementsByTagName('entry');

            var scores = [];
            for (var i = 0; i < entries.length; i++) {
                var url = entries[i].getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended','url')[0].textContent;
                var score = entries[i].getElementsByTagNameNS('http://schemas.google.com/spreadsheets/2006/extended','score')[0].textContent;
                url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
                scores[url] = score;
            }
            var names = colorExpanded(scores);
            colorCollapsed(names);
        }
    }
});

function colorExpanded(scores) {
    var names = [];

    Array.from(document.querySelectorAll("cite a")).forEach(a => {
        var memeUrl = a.href;
        memeUrl = memeUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
        var memeName = a.textContent;

        if (scores[memeUrl]) {
            var score = scores[memeUrl];
            score = Math.round(score*1000)/10;
            // a.textContent += ' (' + score + ')';

            // generate a hex color based on the score
            var color = setColor(score);
            a.style.backgroundColor = color;
            if (score != 0) { a.style.textDecoration = 'none'; }

            // set color for rewriting collapsed view
            names[memeName.substr(0,14)] = color;
        }
    });
    return names;
}

function colorCollapsed(names) {
    Array.from(document.querySelectorAll("span.mls a")).forEach(a => {
        var memeName = a.textContent.substr(0,14);
        if (names[memeName] != 'none') {
            a.style.backgroundColor = names[memeName];
            a.style.textDecoration = 'none';
        }
    });
}

function setColor(p) {
    var color = '';
    if (p < 0) {
        if (p < -10) { color = '#8686ff'; }
        else if (p < -5) { color = '#aaaaff'; }
        else { color = '#ccccff'; }
    } else if (p > 0) {
        if (p > 30) { color = '#ff6666'; }
        else if (p > 5) { color = '#ff9999'; }
        else { color = '#ffcccc'; }
    } else {
        color = 'none';
    }
    return color;
}