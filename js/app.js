/* app.js
 *
 */





var enemyOne,
    enemyTwo,
    enemyThree,
    enemyFour,
    enemyFive,
    enemySix,
    allEnemies,
    player;




// This function returns a random integer
// between min (included) and max (excluded)
// Parameter: min, min value (included)
// Parameter: max, max value (excluded)
function getRandomInt(min, max) {

    'use strict';

    return Math.floor(Math.random() * (max - min)) + min;
}

// Is there a collision between two objects?
// Parameter: objOne, The object 1
// Parameter: objTwo, The object 2
// Return boolean true if collision || false if not.
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

    if (collision === true) {
        // a collision has occurred
        return true;
    } else {
        // no collision
        return false;
    }
}

// Draw the top message
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

// Enemies our player must avoid
var Enemy = function (yAxis) {

    'use strict';
    // Variables applied to each of our instances go here
    var sprite, x, y, width, height, velocity;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The initial x-axis generated randomly
    this.x = getRandomInt(-500, -100);

    // The initial y-axis
    this.y = yAxis;

    // Width and height
    this.width  = 96;
    this.height = 68;

    // The velocity for our enemies generated randomly
    this.velocity = getRandomInt(50, 250);
};

// Enemy space
// Return object The coordinates in the space occupied by an enemy
Enemy.prototype.space = function () {

    'use strict';

    var space, leftSide, upperSide, rightSide, lowerSide,
        widthEmptySpace = 2, heightEmptySpace = 76;

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

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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
    if (this.x > getRandomInt(505, 905)) {
        // reset the enemy
        this.reset();
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same velocity for
    // all computers.
    distance = Math.round(this.velocity * dt);
    this.x   += distance;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {

    'use strict';

    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
};

// Reset the enemy on the screen
Enemy.prototype.reset = function () {

    'use strict';

    this.x        = getRandomInt(-500, -100);
    this.velocity = getRandomInt(50, 250);
};

// Handle enemy's collision
Enemy.prototype.handleCollision = function () {

    'use strict';
    // stop the enemy bug
    this.velocity = 0;
    // the enemy bug is reset to a new position after delay
    var self = this;
    setTimeout(function () { self.velocity = getRandomInt(50, 250); }, 750);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {

    'use strict';
    // Variables applied to each of our instances go here
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

// Player space
// Return array The coordinates in the space occupied by the player
Player.prototype.space = function () {

    'use strict';

    var space, timeoutID,
        leftSide, upperSide, rightSide, lowerSide,
        widthEmptySpace = 16, heightEmptySpace = 62;

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

// Handle input, required method for game
// Parameter: keyPressed, key pressed to move the player
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

// Update player position, required method for game
Player.prototype.update = function () {

    'use strict';

    if (this.reachesWater() === true) {
        // the player won the game
        this.wonTheGame();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function () {

    'use strict';

    window.ctx.drawImage(window.Resources.get(this.sprite), this.x, this.y);
};

// Reset the player to its initial position
Player.prototype.reset = function () {

    'use strict';

    this.x = 202;
    this.y = 404;
    this.activeUserControl = true;
};

// The player won the game
Player.prototype.wonTheGame = function () {

    'use strict';
    // stop the player (no control with the arrow keys)
    this.activeUserControl = false;
    // display the message 'You Win!'
    drawTheTopMessage('You Win!', 'gold', 'GoldenRod');
    // the player is reset to its initial position
    var self = this;
    setTimeout(function () {
        window.ctx.clearRect(0, 0, 505, 40);
        self.reset();
    }, 1000);
};

// Check if the player reaches the water
// Return boolean true if reaches the water || false if not.
Player.prototype.reachesWater = function () {

    'use strict';

    if (this.y === -11) {
        return true;
    } else {
        return false;
    }
};

// Handle player's collision
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

// Player blinks
Player.prototype.blinks = function () {

    'use strict';
    // backup the actual position
    var backupX = this.x,
    // to work properly with setTimeout()
        self = this;

    setTimeout(function () { self.x = -202;    }, 100);
    setTimeout(function () { self.x = backupX; }, 200);
    setTimeout(function () { self.x = -202;    }, 300);
    setTimeout(function () { self.x = backupX; }, 400);
};

// Now instantiate your objects.
enemyOne   = new Enemy(59);
enemyTwo   = new Enemy(142);
enemyThree = new Enemy(225);
enemyFour  = new Enemy(59);
enemyFive  = new Enemy(142);
enemySix   = new Enemy(225);

// Place all enemy objects in an array called allEnemies
allEnemies = [
    enemyOne,
    enemyTwo,
    enemyThree,
    enemyFour,
    enemyFive,
    enemySix
];

// Place the player object in a variable called player
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
