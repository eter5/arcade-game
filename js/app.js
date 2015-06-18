/* app.js
 * This file provides to the game all objects, functions and instances required.
 */

/* Global variables needed
 */
var allEnemies,
    player;

/* Global functions needed
 */

/* This function returns a random integer
 * between min (included) and max (excluded)
 * Parameter: min, min value (included)
 * Parameter: max, max value (excluded)
 */
function getRandomInt(min, max) {

    'use strict';

    return Math.floor(Math.random() * (max - min)) + min;
}

/* Is there a collision between two objects?
 * This function checks whether there has been a collision
 * between two objects.
 * Parameter: objOne, The object 1
 * Parameter: objTwo, The object 2
 * Return boolean true if collision || false if not.
 */
function isThereACollision(objOne, objTwo) {

    'use strict';
    // get the coordinates that occupy objects in space
    var objOneSpace = objOne.space(),
        objTwoSpace = objTwo.space(),
        // collisions from all sides
        leftCollision  = objOneSpace.leftSide  < objTwoSpace.rightSide,
        upperCollision = objOneSpace.upperSide < objTwoSpace.lowerSide,
        rightCollision = objOneSpace.rightSide > objTwoSpace.leftSide,
        lowerCollision = objOneSpace.lowerSide > objTwoSpace.upperSide,
        // The space occupied by the object One
        // is overlapped by the object Two
        collision = leftCollision  &&
                    upperCollision &&
                    rightCollision &&
                    lowerCollision;

    return (collision === true) ? true : false;
}

/* This function draws the top message
 * Parameter: message, The message to draw
 * Parameter: fillColor, The fill color
 * Parameter: strokeColor, The stroke color
 */
function drawTheTopMessage(message, fillColor, strokeColor) {

    'use strict';

    window.ctx.font      = '28pt Impact';
    window.ctx.textAlign = 'center';

    window.ctx.fillStyle = fillColor;
    window.ctx.fillText(message, 252, 37);

    window.ctx.strokeStyle = strokeColor;
    window.ctx.lineWidth   = 2;

    window.ctx.strokeText(message, 252, 37);
}

/* The Enemy's class
 * Enemies our player must avoid
 */
var Enemy = function () {

    'use strict';
    // We declare the properties of our enemies
    var sprite, x, y, width, height, velocity, road;

    // The image/sprite for our enemies, this uses
    // a helper resources.js
    this.sprite = 'images/enemy-bug.png';

    // The initial x-axis generated randomly
    this.x = getRandomInt(-303, -101);

    // 3 different roads for our enemies
    this.road = [59, 142, 225];
    // The initial y-axis generated randomly
    this.y = this.road[getRandomInt(0, 3)];

    // the width and height
    this.width  = 96;
    this.height = 68;

    // The velocity for our enemies generated randomly
    this.velocity = getRandomInt(50, 250);
};

/* The space occupied by an enemy at the moment
 * Return object The coordinates in the space occupied by an enemy
 */
Enemy.prototype.space = function () {

    'use strict';

    var space, leftSide, upperSide, rightSide, lowerSide,
        widthEmptySpace = 2, heightEmptySpace = 76;
    // Delimiting the real space by eliminating
    // the empty space of the image/sprite
    leftSide  = this.x + widthEmptySpace;
    upperSide = this.y + heightEmptySpace;
    rightSide = leftSide  + this.width;
    lowerSide = upperSide + this.height;

    space = {
        leftSide : leftSide,
        upperSide: upperSide,
        rightSide: rightSide,
        lowerSide: lowerSide
    };

    return space;
};

/* Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function (dt) {

    'use strict';

    var distance;

    // check if is there a collision
    if (isThereACollision(this, player) === true) {
        // handle collision
        this.handleCollision();
        player.handleCollision();
    }

    // If x-axis > to the end of the canvas width
    if (this.x > getRandomInt(505, 705)) {
        // reset the enemy
        this.reset();
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same velocity for
    // all computers.
    distance = Math.round(this.velocity * dt);
    this.x   += distance;
};

/* Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {

    'use strict';

    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
};

/* Reset the enemy on the screen
 */
Enemy.prototype.reset = function () {

    'use strict';

    this.x        = getRandomInt(-303, -101);
    this.y        = this.road[getRandomInt(0, 3)];
    this.velocity = getRandomInt(50, 250);
};

/* Handle enemy's collision
 */
Enemy.prototype.handleCollision = function () {

    'use strict';
    // stop the enemy bug
    this.velocity = 0;
    // the enemy's velocity is reset
    // after a short delay
    var self = this;
    setTimeout(function () { self.velocity = getRandomInt(50, 250); }, 750);
};

/* Our player's class
 * This class requires an update(), render() and
 * a handleInput() method.
 */
var Player = function () {

    'use strict';
    // We declare the properties of our player
    var sprite, x, y, activeUserControl;

    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';

    // The initial x-axis
    this.x = 202;

    // The initial y-axis
    this.y = 404;

    // Width and height
    this.width  = 69;
    this.height = 78;

    // To switch on/off the control of the player
    // with the arrow keys
    this.activeUserControl = true;
};

/* Player space
 * Return array The coordinates in the space occupied by the player
 */
Player.prototype.space = function () {

    'use strict';

    var space, leftSide, upperSide, rightSide, lowerSide,
        widthEmptySpace = 16, heightEmptySpace = 62;
    // Delimiting the real space by eliminating
    // the empty space of the image/sprite
    leftSide  = this.x + widthEmptySpace;
    upperSide = this.y + heightEmptySpace;
    rightSide = leftSide  + this.width;
    lowerSide = upperSide + this.height;

    space = {
        leftSide : leftSide,
        upperSide: upperSide,
        rightSide: rightSide,
        lowerSide: lowerSide
    };

    return space;
};

/* Handle input, required method for game
 * Parameter: keyPressed, key pressed to move the player
 */
Player.prototype.handleInput = function (keyPressed) {

    'use strict';

    if (this.activeUserControl === true) {
        // Commute the key pressed to a movement
        switch (keyPressed) {
        case 'left':
            // Move left without exceeding the limit of canvas
            if (this.x !== 0) { this.x -= 101; }
            break;
        case 'up':
            // Move up without exceeding the limit of canvas
            if (this.y !== -11) { this.y -= 83; }
            break;
        case 'right':
            // Move right without exceeding the limit of canvas
            if (this.x !== 404) { this.x += 101; }
            break;
        case 'down':
            // Move down without exceeding the limit of canvas
            if (this.y !== 404) { this.y += 83; }
            break;
        default:
            break;
        }
    }
};

/* Update player position, required method for game
 */
Player.prototype.update = function () {

    'use strict';

    if (this.reachesWater() === true) {
        // the player won the game
        this.wonTheGame();
    }
};

/* Draw the player on the screen, required method for game
 */
Player.prototype.render = function () {

    'use strict';

    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
};

/* Reset the player to its initial position
 */
Player.prototype.reset = function () {

    'use strict';

    this.x = 202;
    this.y = 404;
    this.activeUserControl = true;
};

/* The player won the game
 */
Player.prototype.wonTheGame = function () {

    'use strict';
    // stop the player (no control with the arrow keys)
    this.activeUserControl = false;
    // display the message 'You Win!'
    drawTheTopMessage('You Win!', 'gold', 'GoldenRod');
    // the player is reset to its initial position
    var self = this;
    setTimeout(function () {
        // erase the top message
        window.ctx.clearRect(0, 0, 505, 40);
        // reset the player's position
        self.reset();
    }, 1000);
};

/* Check if the player reaches the water
 * Return boolean true if reaches the water || false if not.
 */
Player.prototype.reachesWater = function () {

    'use strict';

    return (this.y === -11) ? true : false;
};

/* Handle player's collision
 */
Player.prototype.handleCollision = function () {

    'use strict';

    // stop the player (no control with the arrow keys)
    this.activeUserControl = false;
    // the player blinks some milliseconds
    this.blinks();
    // the player is reset to its initial position
    var self = this;
    setTimeout(function () { self.reset(); }, 500);
};

/* Player blinks
 */
Player.prototype.blinks = function () {

    'use strict';
    // backup the actual position
    var backupX = this.x,
        // to work properly with setTimeout()
        self = this;
    // blinks!
    setTimeout(function () { self.x = -202;    }, 100);
    setTimeout(function () { self.x = backupX; }, 200);
    setTimeout(function () { self.x = -202;    }, 300);
    setTimeout(function () { self.x = backupX; }, 400);
};

/* This function generates N number of instances of our enemies
 * Parameter: enemiesNumber, The enemies number
 * Return array of enemies instances.
 */
function generateEnemies(enemiesNumber) {

    'use strict';

    var enemies = [], i;

    for (i = 0; i < enemiesNumber; i += 1) {
        enemies.push(new Enemy());
    }

    return enemies;
}

/* Instantiate all enemy objects
 * in an array called allEnemies
 */
allEnemies = generateEnemies(7);

/* Instantiate player
 */
player = new Player();

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function (e) {

    'use strict';

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
