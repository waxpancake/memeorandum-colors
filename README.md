# Memeorandum Colors

Memeorandum Colors is a Greasemonkey/Tampermonkey user script to visualize linking bias on political websites on [Memeorandum.com](https://memeorandum.com/), an aggregator of political news stories.

When installed, it will color publication names on Memeorandum based on each site's historical linking activity. The brighter the color, the more they tend to link only to articles in their same cluster. 

**Note:** This does not necessarily mean that the publication itself is politically conservative or liberal: only that it tends to historically link to articles similar to other publications in its cluster.

![Screenshot of Memeorandum homepage with publication names colored red and blue](https://github.com/waxpancake/memeorandum-colors/raw/master/screenshot.jpg)

Read the original [2008 Waxy.org post](https://waxy.org/2008/10/memeorandum_colors/) about the project and how it works, and the [2012 update](https://waxy.org/2012/04/memeorandum_colors_2012_visualizing_bias_on_political_blogs/).

The source data and SVD scores were originally collected and created by Joshua Schachter in 2008, and recreated by me (Andy Baio) in 2026. The current and archived data can be [browsed on Google Sheets](https://docs.google.com/spreadsheets/d/1x2G6jucO8mm2gSZ_7xBaf1WynyGBBIB5Yx90bbU2MAQ/edit?usp=sharing).


## Installation

1. Install [Tampermonkey](https://tampermonkey.net/).
2. Click the [memeorandum_colors.user.js](https://github.com/waxpancake/memeorandum-colors/raw/master/memeorandum_colors.user.js) link and click Install in the Tampermonkey window.
4. Visit [Memeorandum](https://memeorandum.com/) and wait a moment for the links to change color.


## Contributing

Issues and pull requests welcome!