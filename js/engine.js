/* Engine.js
 * This file provides the game loop functionality:
 * drawing the initial game board on the screen, and calling the update and
 * render methods on player and enemy objects (defined in app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas context (ctx) object globally available
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        selectloop,
        gameloop;

    canvas.width = 505;
    canvas.height = 600;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        if (choosing === true) {
            cancelAnimationFrame(gameloop);
        }
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone.
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        updateEntities(dt);
        renderBoard();
        renderEntities();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        gameloop = requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        $('#instructions').modal({backdrop: 'static', keyboard: false})
        reset();
        lastTime = Date.now();
    }

    /* This function loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            enemy.collision();
        });
        gem.collect();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, render() is called every
     * loop of the game engine because that's how games work -
     * they are flipbooks drawing the entire screen over and over.
     */
    function renderBoard() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }

    /* This function's purpose is to call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        gem.render();
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        //  display modal with instructions
        $('#instructions').modal('show');
        $('#instructions a').click(function(){
            $('#instructions').modal('hide');
            choosing = true;
            renderCharacters();
        })
    }
    
    function renderCharacters() {
        if (choosing === false) {
            cancelAnimationFrame(selectloop);
        }
        renderBoard();
        selector.render();
        for (var i = 0; i < 5; i++) {
            allCharacters[i].render()
        }
        
        selectloop = requestAnimationFrame(renderCharacters);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/selector.png',
        'images/green.png',
        'images/blue.png',
        'images/orange.png',
        'images/Heart.png',
        'images/Star.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/char-horn-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.main = main;
    global.reset = reset;
})(this);
