// Possible locations for enemies
const enemiesX = [-120, -60, 0, 60, 120, 180, 240, 300, 360, 420];
const enemiesY = [65, 145, 225];

// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    constructor () {
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Generate random position and speed of enemy
        this.x = enemiesX[Math.floor(Math.random() * enemiesX.length)];
        this.y = enemiesY[Math.floor(Math.random() * enemiesY.length)];
        this.speed = Math.floor(Math.random() * 200) + 1;
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update (dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
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

/* Generate number of enemies depending on level. 
 * For the first 3 levels there are 4 enemies onscreen. 
 * For levels greater than 3, the number of enemies is
 * equal to the number of levels reached.
 */ 
function generateEnemies(level) {
    allEnemies = [];
    let count;
    if (level > 4) {
        count = level;
    } else {
        count = 4;
    }
    for (let i = 0; i < count; i++) {
        allEnemies.push(new Enemy());
    }
};

/* Define Player 
* keys: x, y, level, lives
* methods: update(), render(), handleInput(), win(), lose()
*/
class Player {
    constructor (x, y) {
        this.sprite = 'images/char-horn-girl.png';
        this.x = 202;
        this.y = 404;
        this.level = 1;
        this.lives = 6;
    }

    /* Set a new position (x, y) to the player and check if the
    * new position is off-screen. 
    * If position off-screen left/right, the player enters on-screen 
    * on the opposite part. If postition off-screen down, the player
    * remains on-screen. If position top, player wins.
    */
   
    update(x, y) {
        
        if (this.x <= -32) {
            this.x = 404;
        };

        if (this.x >= 505) {
            this.x = 0;
        };

        if (this.y >= 400) {
            this.y = 400;
        }; 

        if (this.y <= 0) {
            this.win();
        }

        // Check for collision with any enemy
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

    /* Move player one column or one row in the direction 
    * indicated by the pressed key.
    */ 
    handleInput(key) {
        switch (key) {
            case 'left':
                // Move one column-width left
                this.update(this.x -= 101); 
                break;

            case 'right':
                // Move one column-width right
                this.update(this.x += 101);
                break;
            
            case 'up':
                // Move one row-height top
                this.update(this.y -= 83);
                break;
            
            case 'down':
                // Move one row-height down
                this.update(this.y += 83);
                break;
        };
    }

    /* This method displays a win message, upgrades one level
     * and sets the player to the initial position.
     */

    win() {
        setTimeout(() => {
            // Set initial position to player
            this.x = 202;
            this.y = 404;

            // Upgrade one level
            this.level ++;

            // Stop all enemies
            allEnemies.forEach(element => {
                element.speed = 0;
            });

            // WIN the game if 8 lives are reached
            if (this.level === 8) {
                let winGame = document.getElementById('winGameDialog');
                winGame.showModal();
                
            } else {
                // Display win message and then close it on click
                let winModal = document.getElementById('winDialog');
                winModal.showModal();

                // Close win message when a key is pressed or mouse click

                document.addEventListener('click', closeModal(winModal), {once: true});
                document.addEventListener('keypress', closeModal(winModal), {once: true});
            }
            // Render player onscreen
            this.render();
        });
    }

    /* This method displays a lose message, downgrades one life
     * and sets the player to the initial position.
     */
    lose() {
        setTimeout(() => {
            // Set initial position to player
            this.x = 202;
            this.y = 404;

            // Decrease one life
            this.lives --;

            // Stop all enemies
            allEnemies.forEach(element => {
                element.speed = 0;
            });

            // Check if there are lives left 
            if (this.lives > 0) {
                // Display lose message
                let loseModal = document.getElementById('loseDialog');
                loseModal.showModal();

                // Close lose message when a key is pressed or mouse click
                document.addEventListener('click', closeModal(loseModal), {once: true});
                document.addEventListener('keypress', closeModal(loseModal), {once: true});

                // Render player onscreen
                this.render();     
            } else if (this.lives <= 0) { // LOSE game if no lives left
                this.level = 0;
                this.lives = 0;
                let endModal = document.getElementById('endGameDialog'); 
                endModal.showModal();
                // delete player;
            };
        });
    } 
};

/* Regenerate enemies when modal is closed 
* The number of enemies is the same as the level reached
*/
function closeModal(modal) {
    modal.close();

    generateEnemies(player.level);
}

// Instantiate enemy objects in a set called allEnemies
let allEnemies = [];

generateEnemies(1);

// Place the player object in a variable called player
const player = new Player(202, 404);

/* This listens for key presses and sends the keys to your
* Player.handleInput() method. You don't need to modify this.
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
