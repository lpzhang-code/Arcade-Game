//  constructor for enemy objects plus prototype containing update and render methods

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
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
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



//  constructor for player object and prototype for update, render and handle input methods

var PLAYER_X = 200;
var PLAYER_Y = 400;

var Player = function() {
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.update = function() {
    // reset position if they reach water
    if (this.y < 40) {
        this.x = PLAYER_X;
        this.y = PLAYER_Y;
    }
};
    
Player.prototype.render = function() {
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



// instantiate player and enemies
player = new Player();

var allEnemies = [];

for (var i = 0; i < 3; i++) {
    var enemy = new Enemy();
    // set varying initial positions
    enemy.x = i * 250;
    enemy.y = 40 + (i * 100);
    // store in array
    allEnemies.push(enemy);
}



// listen for key presses and pass them to player.handleInput function
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
