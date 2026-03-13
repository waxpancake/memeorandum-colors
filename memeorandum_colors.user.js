// ==UserScript==
// @name          Memeorandum Colors
// @namespace     http://waxy.org/2008/10/memeorandum_colors/
// @description   Color Memeorandum stories based on linking bias
// @version       0.6
// @author        Andy Baio (data by Joshua Schachter)
// @connect       memeorandum.com
// @connect       docs.google.com
// @connect       googleusercontent.com
// @include       *memeorandum.com/*
// @grant         GM_xmlhttpRequest
// ==/UserScript==

const CSV_URL = 'https://docs.google.com/spreadsheets/d/0Ag0BxADNLZqgdE1qLTBMQTFQQlQ0TWJxSVNKZ0hQTkE/export?format=csv&gid=0';

GM_xmlhttpRequest({
    method: 'GET',
    url: CSV_URL,
    onload: function(response) {
        if (response.status !== 200) {
            console.warn('[Memeorandum Colors] Failed to load data, status:', response.status);
            return;
        }
        const scores = parseCSV(response.responseText);
        const names = colorExpanded(scores);
        colorCollapsed(names);
    },
    onerror: function(response) {
        console.warn('[Memeorandum Colors] Request error:', response);
    }
});

function parseCSV(text) {
    const scores = {};
    const lines = text.trim().split('\n');

    // Find column indices from header row
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const urlIdx = headers.indexOf('url');
    const scoreIdx = headers.indexOf('score');

    if (urlIdx === -1 || scoreIdx === -1) {
        console.warn('[Memeorandum Colors] CSV missing expected columns. Headers found:', headers);
        return scores;
    }

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length <= Math.max(urlIdx, scoreIdx)) continue;

        let url = cols[urlIdx].trim().replace(/"/g, '');
        const score = parseFloat(cols[scoreIdx].trim().replace(/"/g, ''));

        if (!url || isNaN(score)) continue;

        url = normalizeUrl(url);
        scores[url] = score;
    }

    return scores;
}

function normalizeUrl(url) {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/\/$/, '');
}

function colorExpanded(scores) {
    const names = {};
    document.querySelectorAll('cite a').forEach(a => {
        const memeUrl = normalizeUrl(a.href);
        const memeName = a.textContent;
        const score = scores[memeUrl];

        if (score !== undefined) {
            const pct = Math.round(score * 1000) / 10;
            const color = scoreToColor(pct);
            applyColor(a, color);
            names[memeName.substring(0, 14)] = color;
        }
    });
    return names;
}

function colorCollapsed(names) {
    document.querySelectorAll('span.mls a').forEach(a => {
        const memeName = a.textContent.substring(0, 14);
        const color = names[memeName];
        if (color && color !== 'none') {
            applyColor(a, color);
        }
    });
}

function applyColor(el, color) {
    if (!color || color === 'none') return;
    el.style.backgroundColor = color;
    el.style.textDecoration = 'none';
}

function scoreToColor(p) {
    if (p < -10) return '#8686ff';  // strong liberal
    if (p < -5)  return '#aaaaff';  // moderate liberal
    if (p < 0)   return '#ccccff';  // lean liberal
    if (p > 10)  return '#ff6666';  // strong conservative
    if (p > 5)   return '#ff9999';  // moderate conservative
    if (p > 0)   return '#ffcccc';  // lean conservative
    return 'none';                  // neutral
}