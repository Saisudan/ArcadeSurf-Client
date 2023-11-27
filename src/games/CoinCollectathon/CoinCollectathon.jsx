import phaser from "phaser";
import React, { useState, useEffect } from "react";
import "./CoinCollectathon.scss";

function CoinCollectathon({ updateResult }) {
    const [ lives, setLives ] = useState(3);
    const [ coinsCollected, setCoinsCollected ] = useState(0);

    let player;
    let enemy;
    let grounded = 0;
    let coins;
    let platforms;
    let cursors;
    let gameState = "";
    let damageState = 0;
    let displayedLives = lives > 0 ? Array(lives).fill(true) : [];
    let currentLives = lives;
    let displayedCoins = Array(coinsCollected).fill(true);
    let currentCoins = coinsCollected;
    
    function collectCoin(player, coin) {
        coin.disableBody(true, true);
        currentCoins++;
        setCoinsCollected(currentCoins);
    
        if (coins.countActive(true) === 0) {
            // All coins collected, player won
            gameState = "You Won!";
        }
    }

    function loseLife(player, enemy) {
        if (damageState === 0) {
            currentLives--;
            setLives(currentLives);
            damageState = 45;
        }
    }

    function resetGameProgress() {
        setCoinsCollected(0);
        currentCoins = coinsCollected;
        
        if (currentLives < 1) {
            // No lives left, player lost
            gameState = "Game Over";
            updateResult(gameState);
        } else {
            // Reset game state
            player.setPosition(100, 450);
            player.flipX = true;
            enemy.setPosition(650, 100);
            enemy.setVelocityX(-100);
            coins.children.iterate((coin) => {
                coin.enableBody(true, coin.x, coin.y, true, true);
            });
        }
    }
    
    class GameScenes extends phaser.Scene {
    
        preload () {
            this.load.image('sky', 'http://localhost:8000/assets/images/sky-background.png');
            this.load.image('ground', 'http://localhost:8000/assets/images/platform.png');
            this.load.image('coin', 'http://localhost:8000/assets/images/coin.png');
            this.load.spritesheet('blue-dude', 'http://localhost:8000/assets/spritesheets/blue-dude_SpriteSheet.png', { frameWidth: 19, frameHeight: 24 });
            this.load.spritesheet('dino-enemy', 'http://localhost:8000/assets/spritesheets/dino-enemy-spritesheet.png', { frameWidth: 61, frameHeight: 18 });
        }
        
        create () {
            // Background
            this.add.image(400, 300, 'sky').setScale(0.75);
            platforms = this.physics.add.staticGroup();
        
            // Ground
            platforms.create(400, 625, 'ground').setScale(3).refreshBody();
        
            // Floating platforms
            platforms.create(500, 450, 'ground');
            platforms.create(600, 150, 'ground');
            platforms.create(150, 300, 'ground');
        
            // Player
            player = this.physics.add.sprite(100, 450, 'blue-dude').setScale(2);
            player.setCollideWorldBounds(true);
            player.flipX = true;
            
            // Enemy
            enemy = this.physics.add.sprite(650, 100, 'dino-enemy').setScale(2);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocityX(-100);
        
            // Create Player Animations
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

            this.anims.create({
                key: 'hurt',
                frames: [ { key: 'blue-dude', frame: 6 } ],
                frameRate: 20
            });

            this.anims.create({
                key: 'knocked-down',
                frames: [ { key: 'blue-dude', frame: 7 } ],
                frameRate: 20
            });

            // Create Enemy Animations
            this.anims.create({
                key: 'dino-walking',
                frames: this.anims.generateFrameNumbers('dino-enemy', { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            });
        
            // Input
            cursors = this.input.keyboard.createCursorKeys();
        
            // Add Coins
            coins = this.physics.add.staticGroup();
            coins.create(175, 525, 'coin');
            coins.create(510, 380, 'coin');
            coins.create(675, 50, 'coin');
            coins.create(50, 225, 'coin');
            coins.create(720, 300, 'coin');
        
            // Collision
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(enemy, platforms);
            this.physics.add.collider(coins, platforms);
        
            // Coin Collection
            this.physics.add.overlap(player, coins, collectCoin, null, this);

            // Taking damage
            this.physics.add.overlap(player, enemy, loseLife, null, this);
        }
        
        update () {
            if (damageState > 0) {
                // Player took damage
                damageState--;
                player.anims.play("hurt", true);
                player.setVelocity(0,0);
                enemy.setVelocity(0,0);
                if (damageState === 0) {
                    resetGameProgress();
                }
                return;
            } else if (gameState) {
                // Game decided, update parent component's state
                updateResult(gameState);
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

            // Enemy Movement
            if (((player.body.position.x + 50) > enemy.body.position.x) && (enemy.body.position.x > (player.body.position.x - 50)) && (enemy.body.velocity.x !== 0)) {
                // Gradually slow down when near the player, prevents odd behaviour
                if (enemy.body.velocity.x >= 5 || enemy.body.velocity.x <= -5) {
                    enemy.setVelocityX(enemy.body.velocity.x/1.01);
                } else {
                    enemy.setVelocityX(0);
                }
            } else if (enemy.body.position.x > player.body.position.x) {
                // Follow player to the left
                enemy.setVelocityX(-60);
                enemy.flipX = false;
            } else if (enemy.body.position.x < player.body.position.x) {
                // Follow player to the right
                enemy.setVelocityX(60);
                enemy.flipX = true;
            }

            // Enemy Animations
            if (enemy.body.velocity.x !== 0) {
                enemy.anims.play("dino-walking", true);
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
              parent: "coin-collectathon",
              mode: phaser.Scale.FIT
            }
        };

        // Create Game
        let game = new phaser.Game(config);
        game.scene.add("gamescenes", GameScenes, true);
    }, []);
    
    return (
        <div className="coin-collectathon">
            <div className="coin-collectathon__top">
                <div className="coin-collectathon__lives">
                    {displayedLives.map(() => {
                        return <img src="http://localhost:8000/assets/images/blue-dude_life.png" alt="player life" className="coin-collectathon__life-image"/>;
                    })}
                </div>
                <div className="coin-collectathon__coins">
                    {displayedCoins.map(() => {
                        return <img src="http://localhost:8000/assets/images/coin.png" alt="coin" className="coin-collectathon__coin-image"/>;
                    })}
                </div>
            </div>
            <div className="coin-collectathon__game-container" id="coin-collectathon"/>
        </div>
    );
}

export default CoinCollectathon;