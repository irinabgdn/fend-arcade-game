/*
* Set GAME ALERTS
* Win / lose one level
* Win / lose the whole game
*/
const gameAlerts = [ {state: "winlevel", alert: "Keep doing what you're doing, you passed one level!"},
            {state: "loselevel", alert: ":( You lose one life"},
            {state: "wingame", alert: "Congrats! You won! Click refresh to restart game"},
            {state: "losegame", alert: "The End... Click refresh to restart game"}
];

// Alerts 
let popUp = document.getElementById('pop-up');

function displayAlert() {
    // Stop all enemies
    allEnemies.forEach(element => {
        element.speed = 0;
    });

    // Show pop-up
    popUp.style.display = 'block';

    // Set pop-up alert text depending on the game state
    let i = 0;
    while (player.state != gameAlerts[i].state) { i++ };
    popUp.innerHTML = gameAlerts[i].alert;
}

// Define possible locations for enemies
const enemiesX = [-120, -60, 0, 60, 120, 180, 240, 300, 360, 420];
const enemiesY = [65, 145, 225];

// Class of enemies objects
class Enemy {
    constructor () {
        // The image/sprite for our enemies, this uses
        // a helper Udacity provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Generate random position and speed of enemy
        this.x = enemiesX[Math.floor(Math.random() * enemiesX.length)];
        this.y = enemiesY[Math.floor(Math.random() * enemiesY.length)];
        this.speed = Math.floor(Math.random() * 200) + 1;
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update (dt) {
    // Multiply any movement by the dt parameter which 
    // will ensure the game runs at the same speed for
    // all computers.
        this.x += this.speed * dt;
        //
        if (this.x >= 600) {
            this.x = -120;
        }
    }
    
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Generate number of enemies depending on level. 
function generateEnemies(level) {
    // Clear the array of enemies
    allEnemies = [];
    let count;
    if (level < 4 || level === undefined) {
        // For the first 3 levels there are 4 enemies onscreen. 
        count = 4;
    } else {
        /*For levels greater than 3, the number of enemies is
        * equal to the number of levels reached. */
        count = level;
    }
    // Initialize enemy objects in the array
    for (let i = 0; i < count; i++) {
        allEnemies.push(new Enemy());
    }
};

/* Define Player 
* keys: x, y, level, lives, state
* methods: update(), render(), handleInput(), win(), lose()
*/
class Player {
    constructor (x, y) {
        this.sprite = 'images/char-horn-girl.png';
        this.x = 202;
        this.y = 404;
        this.level = 1;
        this.lives = 6;
        this.state = 'start';
    }

    /* Set a new position (x, y) to the player and check if the
    * new position is off-screen or any enemy hits the player.
    */
    update(x, y) {
        /* If position off-screen left/right, the player enters on-screen 
        * on the opposite part. */
        if (this.x <= -32) {
            this.x = 404;
        };

        if (this.x >= 505) {
            this.x = 0;
        };

        // If postition off-screen down, the player remains on-screen
        if (this.y >= 400) {
            this.y = 400;
        }; 

        // If position top, player wins.
        if (this.y <= 0) {
            this.win();
        }

        // If player collides with any enemy, player loses.
        allEnemies.forEach(element => {
            if (Math.abs(this.x - element.x) < 80 
                && Math.abs(this.x -element.x) > 0 
                && Math.abs(this.y - element.y) < 20 
                && Math.abs(this.y -element.y) > 0) {
                    this.lose();
                }
        }, player);
    };

    // Draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        // Draw information about player on canvas - level and lives
        ctx.font = "1em 'Lato', sans-serif";
        ctx.fillText('Level ' + this.level, 15, 30);
        ctx.fillText('You have ' + this.lives + ' lives left.', 345, 30, 200);
    }

    // Handle keyboard events for player object 
    handleInput(key) {
        if (this.state === 'play') {
            switch (key) {
                case 'left':
                    // Move one column-width left
                    this.x -= 101; 
                    break;
    
                case 'right':
                    // Move one column-width right
                    this.x += 101;
                    break;
                
                case 'up':
                    // Move one row-height top
                    this.y -= 83;
                    break;
                
                case 'down':
                    // Move one row-height down
                    this.y += 83;
                    break;
            }
        } else {
            // Exit pop-up and start new game
            if (key === 'spacebar') {

                this.state = 'play';
                // Hide alert
                popUp.style.display = 'none';

                // Initialize enemies depending on level
                generateEnemies(this.level);
            }
        }
    }

    // WIN method
    win() {
            // Set initial position to player
            this.x = 202;
            this.y = 404;

            // Upgrade one level
            this.level ++;

            // Win the game if 10 lives are reached
            if (this.level === 10) {
                // Win game pop-up alert
                this.state = 'wingame';
                displayAlert();

                // Remove keys that handle event on player objet
                // so that the game freezes at the end
                allowedKeys = [];
            } else {
                // Win level pop-up alert
                this.state = 'winlevel';
                displayAlert();
            }
    }

    // LOSE method
    lose() {
            // Set initial position to player
            this.x = 202;
            this.y = 404;

            // Decrease one life
            this.lives --;

            // Check if there are lives left 
            if (this.lives > 0) {
                // Lose one life
                this.state = 'loselevel';
                displayAlert();

            } else if (this.lives <= 0) { 
                // Lose game if no lives left
                this.state = 'losegame';
                displayAlert();

                // Remove keys that handle event on player objet
                // so that the game freezes at the end
                allowedKeys = [];
            };
    } 
};

// Instantiate enemy objects in a set called allEnemies
let allEnemies = [];

// Place the player object in a variable called player
const player = new Player(202, 404);


/* This listens for key presses and sends the keys to your
* Player.handleInput() method. You don't need to modify this.
*/
var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'spacebar'
};

document.addEventListener('keyup', function(e) {
    player.handleInput(allowedKeys[e.keyCode]);
});

