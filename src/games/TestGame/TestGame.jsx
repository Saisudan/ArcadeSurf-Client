import phaser from "phaser";
import React, { useEffect } from "react";

function TestGame({ updateResult }) {

    let player;
    let grounded = 0;
    let coins;
    let platforms;
    let cursors;
    let score = "";
    let gameWon = false;
    let scoreText;
    
    function collectCoin (player, coin) {
        coin.disableBody(true, true);
    
        //  Add and update the score
        score += "O ";
        scoreText.setText(score);
    
        if (coins.countActive(true) === 0) {
            gameWon = true
        }
    }
    
    class GameScenes extends phaser.Scene {
    
        preload () {
            this.load.image('sky', 'http://localhost:8000/assets/images/sky-background.png');
            this.load.image('ground', 'http://localhost:8000/assets/images/platform.png');
            this.load.image('coin', 'http://localhost:8000/assets/images/coin.png');
            this.load.spritesheet('blue-dude', 'http://localhost:8000/assets/spritesheets/blue-dude_SpriteSheet.png', { frameWidth: 19, frameHeight: 24 });
        }
        
        create () {
            //  A simple background for our game
            this.add.image(400, 300, 'sky');
        
            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = this.physics.add.staticGroup();
        
            //  Here we create the ground.
            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            platforms.create(400, 625, 'ground').setScale(3).refreshBody();
        
            //  Now let's create some ledges
            platforms.create(650, 450, 'ground').setScale(1);
            platforms.create(500, 125, 'ground').setScale(1);
            platforms.create(150, 300, 'ground').setScale(1);
        
            // The player and its settings
            player = this.physics.add.sprite(100, 450, 'blue-dude').setScale(2);
        
            //  Player physics
            player.setCollideWorldBounds(true);
        
            //  Create Player Animations
            this.anims.create({
                key: 'walking',
                frames: this.anims.generateFrameNumbers('blue-dude', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        
            this.anims.create({
                key: 'standing',
                frames: [ { key: 'blue-dude', frame: 3 } ],
                frameRate: 20
            });
        
            this.anims.create({
                key: 'jumping',
                frames: [ { key: 'blue-dude', frame: 8 } ],
                frameRate: 20
            });

            this.anims.create({
                key: 'falling',
                frames: [ { key: 'blue-dude', frame: 0 } ],
                frameRate: 20
            });
        
            //  Input Events
            cursors = this.input.keyboard.createCursorKeys();
        
            //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
            coins = this.physics.add.group({
                key: 'coin',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 }
            });
        
            //  Score
            scoreText = this.add.text(16, 16, '', { fontSize: '2rem', fill: '#e5ff00' });
        
            //  Collision
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(coins, platforms);
        
            //  Coin Collection
            this.physics.add.overlap(player, coins, collectCoin, null, this);
        }
        
        update () {
            if (gameWon) {
                updateResult("You Won!")
                return;
            }

            // Player Actions and Movement
            if (cursors.left.isDown) {
                // Moving left
                player.setVelocityX(-160);
                player.flipX = false;
            } else if (cursors.right.isDown) {
                // Moving right
                player.setVelocityX(160);
                player.flipX = true;
            } else {
                // No input, gradually slow down
                if (player.body.velocity.x >= 10 || player.body.velocity.x <= -10) {
                    player.setVelocityX(player.body.velocity.x/1.2);
                } else {
                    player.setVelocityX(0);
                }
            }
            if (cursors.up.isDown && player.body.touching.down && (grounded > 5)) {
                // Player is jumping
                player.setVelocityY(-550);
            }
            // Keep track of how long the player is on the ground, for adding landing lag
            if (player.body.touching.down) {
                grounded++;
            } else {
                grounded = 0;
            }
        
            // Player Animations
            if (!(player.body.touching.down) && (player.body.velocity.y <= 0)) {
                // Player is jumping
                player.anims.play("jumping", true);
            } else if (!(player.body.touching.down) && (player.body.velocity.y > 0)) {
                // Player is falling
                player.anims.play("falling", true);
            } else if (player.body.velocity.x !== 0) {
                // Player is walking on the ground
                player.anims.play("walking", true);
            } else {
                // Player is standing still
                player.anims.play("standing");
            }
        }
    }
    

    useEffect(() => {
        // Game Configuration
        const config = {
            type: phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 700 },
                    debug: false
                }
            },
            scale: {
              parent: "test-game",
              mode: phaser.Scale.FIT,
              autoCenter: phaser.Scale.CENTER_HORIZONTALLY,
            }
        };

        // Create Game
        let game = new phaser.Game(config);
        game.scene.add("gamescenes", GameScenes, true);
    }, []);
    
    return <div className="test-game" id="test-game"/>;
}

export default TestGame;