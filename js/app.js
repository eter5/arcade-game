// Enemies our player must avoid
var Enemy = function(yAxis) {
    // Variables applied to each of our instances go here
    var sprite, x, y, speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The initial x-axis generated randomly
    this.x = getRandomInt(-500, -100);

    // The initial y-axis
    this.y = yAxis;

    // The speed for our enemies generated randomly
    this.speed = getRandomInt(50, 250);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    var nextPosition;

    // If x-axis > to the end of the canvas width
    if (this.x > getRandomInt(505, 905)) {
        // reset the x-axis and speed to a new beginning
        this.x     = getRandomInt(-500, -100);
        this.speed = getRandomInt(50, 250);
    };

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    nextPosition = Math.round(dt * this.speed);
    this.x      += nextPosition;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here
    var sprite, x, y;

    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';

    // The initial x-axis
    this.x = 202;

    // The initial y-axis
    this.y = 404;
};

// Update player position, required method for game
Player.prototype.update = function() {
    // some update code here ...
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle input, required method for game
// Parameter: keyPressed, key pressed to move the player
Player.prototype.handleInput = function(keyPressed) {
    // Commute the key pressed to a movement
    switch (keyPressed) {
        case 'left':
            // Move left without exceeding the limit of canvas
            if (this.x !== 0) { this.x -= 101; };
            break;

        case 'up':
            // Move up without exceeding the limit of canvas
            if (this.y !== -11) { this.y -= 83; };
            break;

        case 'right':
            // Move right without exceeding the limit of canvas
            if (this.x !== 404) { this.x += 101; };
            break;

        case 'down':
            // Move down without exceeding the limit of canvas
            if (this.y !== 404) { this.y += 83; };
            break;

        default:
            break;
    }
};

// Now instantiate your objects.
var enemyOne   = new Enemy( 59),
    enemyTwo   = new Enemy(142),
    enemyThree = new Enemy(225),
    enemyFour  = new Enemy( 59),
    enemyFive  = new Enemy(142),
    enemySix   = new Enemy(225);

// Place all enemy objects in an array called allEnemies
var allEnemies = [
    enemyOne,
    enemyTwo,
    enemyThree,
    enemyFour,
    enemyFive,
    enemySix
];

// Place the player object in a variable called player
var player = new Player();

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

// This function returns a random integer
// between min (included) and max (excluded)
// Parameter: min, min value (included)
// Parameter: max, max value (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
