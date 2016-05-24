//  Constructor for enemy objects plus prototype containing update and render methods

var Enemy = function(image) {
    this.sprite = image;
};

Enemy.prototype.update = function(dt) {
    // enemies move across screen with variable speed
    this.x += 200 * dt;
    
    // place back onto canvas once they run off
    if (this.x > 505) {
        this.x = -50;
    }
    
    // collision detection
    if (Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30) {
        player.x = PLAYER_X;
        player.y = PLAYER_Y;
        player.lives -= 1;
        if (player.lives < 1) {
            choosing = true;
            $('#instructions h4').text('Game Over!');
            $('#instructions p').text('You have collected ' + player.score + ' gems!');
            $('#instructions a').text('Try Again?');
            reset();
        }
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



//  Constructor for player object and prototype for update, render and handle input methods

var PLAYER_X = 200;
var PLAYER_Y = 400;

var Player = function(image) {
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    this.sprite = image;
    this.lives = 3;
    this.score = 5;
    this.highscore = 0;
};

Player.prototype.update = function() {
    // reset position if they reach water
    if (this.y < 40) {
        this.x = PLAYER_X;
        this.y = PLAYER_Y;
    }
};
    
Player.prototype.render = function() {
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
    if (key == 'up') {
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



// Instantiate player, selector, enemies, gems and characters
var player= new Player('images/char-boy.png')
var selector = new Player('images/selector.png');
var choosing = true;   // global variable to record game stage

var allEnemies = [];
for (var i = 0; i < 3; i++) {
    var enemy = new Enemy('images/enemy-bug.png');
    // set varying initial positions
    enemy.x = i * 250;
    enemy.y = 40 + (i * 100);
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



// Listen for key presses and pass them to handleInput function for player or selector

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
    var key = allowedKeys[e.keyCode];
    
    //  game stage determines whether player or selector responds to key input
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
            main();
        }
    }
});