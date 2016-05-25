/*
 * App.js
 * Defines constructors for player, selector, enemy, character, and gem objects.
 * Also defines prototypical methods to be called by Engine.js for updating and rendering.
 * Instantiates relevant game objects.
 */


/*
 * Constructor for enemy/gem objects and defining prototype for
 * update, render, collision, shuffle, collect methods.
 */
var Enemy = function(image) {
    this.sprite = image;
};

Enemy.prototype.update = function(dt) {
    /*
     * Enemies move across screen with variable speed
     * and are placed back onto canvas when they run off.
     */
    this.x += 100 * dt + (Math.random() * 5);
    
    if (this.x > 505) {
        this.x = -50;
    }
};

Enemy.prototype.collision = function() {
    /*
     * Method for collision detection of enemy bugs with player.
     * End the game if they run out of lives, otherwise reset the player's position.
     */
    if (Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30) {
        player.x = PLAYER_X;
        player.y = PLAYER_Y;
        player.lives -= 1;
        if (player.lives < 1) {
            choosing = 'pause';
            $('#instructions h4').text('Game Over!');
            $('#instructions p').text('You managed to collect ' + player.score + ' gems! Better luck next time!');
            $('#instructions a').text('Try Again?');
            reset();
        }
    }
};

Enemy.prototype.collect = function() {
    /*
     * Similar method of detecting when player has collected a gemstone.
     * We will end the game if they collect five, otherwise we place a new stone.
     */
    if (Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30) {
        player.score += 1;
        if (player.score > 4) {
            choosing = 'pause';
            player.gameswon += 1;
            player.x = PLAYER_X;
            player.y = PLAYER_Y;
            $('#instructions h4').text('You Win!');
            $('#instructions p').text('You have won ' + player.gameswon + ' games so far!');
            $('#instructions a').text('Try Again?');
            reset();
        }
        else {
            this.shuffle();
        }
    }
};

Enemy.prototype.shuffle = function() {
    /*
     * If the gem has been collected, we will place a new one.
     * Position is random and gem colour changes everytime function is called.
     */
    if (this.sprite === 'images/orange.png') {
        this.sprite = 'images/blue.png';
    }
    else if (this.sprite === 'images/blue.png') {
        this.sprite = 'images/green.png';
    }
    else if (this.sprite === 'images/green.png') {
        this.sprite = 'images/orange.png';
    }
    
    var gem_x = [1, 101, 202, 303, 402];
    var gem_y = [45, 145, 240];
    
    this.x = gem_x[Math.floor(Math.random() * gem_x.length)];
    this.y = gem_y[Math.floor(Math.random() * gem_y.length)];
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



/*
 * Constructor for player/selector objects and
 * defines prototype for update, render and handleInput methods.
 */
var PLAYER_X = 200;
var PLAYER_Y = 400;

var Player = function(image) {
    /*
     * Constructor sets basic object attributes like
     * image sprite, position, and stats
     */
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    this.sprite = image;
    this.lives = 3;
    this.score = 0;
    this.gameswon = 0;
};
    
Player.prototype.render = function() {
    /*
     * Render player score and lives left on top of screen.
     * Render the player/selector itself too
     */
    
    // clear top part of canvas (scoreboard)
    ctx.clearRect(0, 0, 505, 50);
    
    // render lives left on screen
    for (var i = 0, l = this.lives; i < l; i++) {
        heart = new Image();
        heart.src = 'images/Heart.png';
        ctx.drawImage(heart, i * 30, 5, 30, 50);
    }
    
    // render score on screen
    for (var i = 0, s = this.score; i < s; i++) {
        star = new Image();
        star.src = 'images/Star.png';
        ctx.drawImage(star, i * 30 + 350, 0, 30, 50);
    }
    
    // render player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
    
Player.prototype.handleInput = function(key) {
    /*
     * Move player/selector according to keyboard input.
     */
    if (key == 'up' && this.y > 40) {
        this.y -= 90;
    }
    if (key == 'down' && this.y < 400) {
        this.y += 90;
    }
    if (key == 'left' && this.x > 90) {
        this.x -= 100;
    }
    if (key == 'right' && this.x < 400) {
        this.x += 100;
    }
};



/*
 * Instantiate player, selector, and gem.
 * Instantiate multiple enemy bugs and characters and
 * push them onto an array.
 */
var player= new Player();
var selector = new Player('images/selector.png');
var choosing;   // global variable to record game stage
var gem = new Enemy('images/orange.png');

var allEnemies = [];
for (var i = 0; i < 3; i++) {
    var enemy = new Enemy('images/enemy-bug.png');
    // set varying initial positions
    var enemy_x = [1, 303, 402];
    enemy.x = enemy_x[Math.floor(Math.random() * enemy_x.length)];
    enemy.y = 40 + (i * 101);
    allEnemies.push(enemy);
}

var allCharacters = [];
var characters = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/char-horn-girl.png'];
for (var i = 0; i < 5; i++) {
    var character = new Enemy(characters[i]);
    character.x = i * 100;
    character.y = 400;
    allCharacters.push(character);
}



/*
 * Listen for key presses and
 * pass them to player/selector handleInput function.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
    var key = allowedKeys[e.keyCode];
    
    //  game stage determines whether player/selector responds to key input
    if (choosing === false) {
        player.handleInput(key);
    }
    
    if (choosing === true) {
        if (key === 'left' || key ==='right') {
            selector.handleInput(key);
        }
        // has chosen a character to use, we launch game
        else if (key === 'enter') {
            if (selector.x === 0) {
                var position = 0;
            }
            else {
                var position = selector.x / 100;
            }
            
            // reset player properties
            player.sprite = characters[position];
            player.lives = 3;
            player.score = 0;
            
            // run the game loop
            choosing = false;
            gem.shuffle();
            main();
        }
    }
});