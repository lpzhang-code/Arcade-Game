// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // enemies move across screen with variable speed
    this.x += 500 * Math.random() * dt;
    
    // place enemy back on to left side of canvas once they run off it
    if (this.x > 505) {
        this.x = -50;
    }
    
    // collision detection
    if (Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30) {
        player.x = PLAYER_X;
        player.y = PLAYER_Y;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player functional class
var Player = function() {
    // set initial location
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    // set character image
    this.sprite = 'images/char-boy.png';
};

// variables holding the player's initial position and score;
var PLAYER_X = 200;
var PLAYER_Y = 400;
var score = 0;


Player.prototype.update = function() {
    // once player has reached water
    if (this.y < 40) {
        this.x = PLAYER_X;
        this.y = PLAYER_Y;
        score++;
    }
};
    
Player.prototype.render = function() {
    // render the player on screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // render the score on screen
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(score, 450, 100);
};
    
Player.prototype.handleInput = function(key) {
    // when keypress is up
    if (key == 'up') {
        this.y -= 90;
    }
    // when keypress is down and not near boundary
    if (key == 'down' && this.y < 400) {
        this.y += 90;
    }
    // when keypress is left and not near boundary
    if (key == 'left' && this.x > 90) {
        this.x -= 100;
    }
    // when keypress is right and not near boundary
    if (key == 'right' && this.x < 400) {
        this.x += 100;
    }
};


// instantiate player
player = new Player;

// instantiate enemies
var allEnemies = [];

for (var i = 0; i < 3; i++) {
    var enemy = new Enemy;
    // set varying initial positions
    enemy.x = i * 200;
    enemy.y = 40 + (i * 100);
    // store in array
    allEnemies.push(enemy);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
