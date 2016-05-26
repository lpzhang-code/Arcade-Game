#Arcade Game#
This is an HTML5 Canvas powered desktop video game, developed using best practices in object-oriented Javascript. The canvas element itself is contained in `index.html`. Image sprites that make up the game board and objects are contained in the images folder. These images are loaded by `resources.js` which features a caching layer for those that are frequently used. `engines.js` runs the game loop that updates object positions and renders them onto the canvas along with the game board. `app.js` defines the constructors for game objects, their prototypical methods, and instantiates them.

###Objectives###
The user selects a character to play with and has three lives to collect five gems in order to win. Lives are lost if the player runs into enemy bugs. Game information is displayed on a scoreboard above the game canvas. 

###How to Play###
The player and selector can be controlled using directional arrow keys. Use the enter or return key to select a character. 

###Ideas for Improvement###
* Add touchscreen functionality so that the game can be played not only from desktop but also using a mobile or tablet device.
* Persist game information into a RDBMS, and dynamically display important statistics in the background.
* Create new levels so that after winning a game, the player faces different challenges and/or tasks to complete.