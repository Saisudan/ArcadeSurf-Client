import phaser from "phaser";
import React, { useState, useEffect } from "react";


function TestGame(props) {
    const [ gameState, setGameState ] = useState(null);

    let player;
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
        
            //  Our player animations, turning, walking left and walking right.
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('blue-dude', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        
            this.anims.create({
                key: 'stop',
                frames: [ { key: 'blue-dude', frame: 0 } ],
                frameRate: 20
            });
        
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('blue-dude', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        
            this.anims.create({
                key: 'jump',
                frames: [ { key: 'blue-dude', frame: 7 } ],
                duration: 10000
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
                setGameState("You Won!")
                return;
            }
        
            if (cursors.left.isDown) {
                player.setVelocityX(-160);

                player.flipX = false;
                player.anims.play('left', true);
            }
            else if (cursors.right.isDown) {
                player.setVelocityX(160);
        
                player.flipX = true;
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
        
                player.anims.play('stop');
            }
        
            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
                player.anims.play("jump");
            }
        }
    }
    

    useEffect(() => {
        const config = {
            type: phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scale: {
              parent: "test-game",
              mode: phaser.Scale.FIT,
              autoCenter: phaser.Scale.CENTER_HORIZONTALLY,
            }
        };

        let game = new phaser.Game(config);

        game.scene.add("gamescenes", GameScenes, true);
    }, []);

    if (gameState) {
        return <p>{gameState}</p>;
    }
    
    return (
        <div className="test-game">
            <p className="test-game__text">this is a test game</p>
            <div className="test-game__container" id="test-game"></div>
        </div>
    );
}

export default TestGame;