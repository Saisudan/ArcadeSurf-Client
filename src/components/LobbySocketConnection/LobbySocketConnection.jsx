import { socket } from '../../socket';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameFrame from '../GameFrame/GameFrame';
import "./LobbySocketConnection.scss";

function LobbySocketConnection({ playerName }) {
    const [ room, setRoom ] = useState("");
    const [ ready, setReady ] = useState(false);
    const [ gameStart, setGameStart ] = useState(false);
    const [ gameOver, setGameOver ] = useState(false);
    const [ loadingText, setLoadingText ] = useState("Getting Ready...");
    const [ players, setPlayers ] = useState(null);
    const [ outcome, setOutcome ] = useState(null);
    let ghostSprites = [];
    const params = useParams();
    const navigator = useNavigate();

    // Join the room
    useEffect(() => {
        socket.emit("join-room", { roomID: params.id, username: playerName });
    }, [params, playerName]);

    // Leave the room
    useEffect(() => {
        if (room === "leaving...") {
            navigator("/lobby");
        }
    }, [room, navigator]);

    // Socket Events
    socket.on("joined-room", (receivedData) => {
        setRoom(receivedData[0].lobby_id);
        setPlayers(receivedData);
    });

    socket.on("players-in-room", (receivedData) => {
        setPlayers(receivedData);
    });

    function sendReadySignal() {
        socket.emit("player-ready", { roomID: params.id, username: playerName });
    }

    socket.on("confirmed-ready", () => {
        setReady(true);
    });

    function sendStartSignal() {
        socket.emit("start-game", { roomID: room, username: playerName });
    }

    socket.on("confirmed-start", () => {
        setGameStart(true);
    });

    socket.on("failed-join", () => {
        console.log("Failed to join room");
        navigator("/lobby");
    });

    function updateCurrentSprite(currentData) {
        const currentPlayer = {
            x: currentData.x,
            y: currentData.y,
            sprite: currentData.sprite,
            isXFlipped: currentData.isXFlipped,
            username: playerName,
            room: room
        }
        socket.emit("current-player-position", currentPlayer);
    }

    async function updatePlayerSprites(updatedSprite) {
        if (updatedSprite.username === playerName) {
            // Current player, skip
        } else if (ghostSprites.length === 0 && players !== null && players.length !== 0) {
            // Use players list as a base
            const newGhostList = players.filter((player) => {
                if (player.username === playerName) {
                    // Current player, skip
                } else {
                    return ({
                        x: 100,
                        y: 450,
                        sprite: 0,
                        isXFlipped: true,
                        username: player.username,
                        room: room
                    });
                }
            });
            newGhostList.forEach((ghost) => { ghostSprites.push(ghost) });
        } else {
            // Update ghost settings
            const ghostIndex = ghostSprites.findIndex((ghost) => { return ghost.username === updatedSprite.username });
            if (ghostIndex >= 0) {
                ghostSprites[ghostIndex].x = updatedSprite.x;
                ghostSprites[ghostIndex].y = updatedSprite.y;
                ghostSprites[ghostIndex].sprite = updatedSprite.sprite;
                ghostSprites[ghostIndex].isXFlipped = updatedSprite.isXFlipped;
            }
        }
    }

    socket.on("other-player-positions", (receivedData) => {
        // Fill in will other player's data
        updatePlayerSprites(receivedData);
    });

    function leaveLobby() {
        socket.emit("leave-room", { roomID: room, username: playerName });
    }

    socket.on("left-room", () => {
        setRoom("leaving...");
        setPlayers(null);
    });

    socket.on("lost-game", () => {
        setOutcome("you lost...");
    });

    if (gameStart && !ready) {
        return (
            <section className="lobby-socket">
                <div className="lobby-socket__top">
                    <button className='lobby-socket__button' onClick={leaveLobby}>{"<"} Leave</button>
                </div>
                <div className="lobby-socket__preloader">
                    <h1 className='lobby-socket__preloader-text'>Sorry, you weren't ready in time...</h1>
                </div>
            </section>
        );
    }

    // Check if the outcome has been decided
    if (outcome) {
        if (outcome === "You Won!") {
            socket.emit("won-game", { roomID: room, username: playerName });
        }
        setTimeout(() => {setGameOver(true)}, 2000);
    }
    // Show end screen
    if (gameOver) {
        return (
            <section className="lobby-socket">
                <div className="lobby-socket__top">
                    <button className='lobby-socket__button' onClick={leaveLobby}>{"<"} Leave</button>
                </div>
                <div className="lobby-socket__outcome">
                    <h1 className='lobby-socket__outcome-text'>{outcome}</h1>
                    {(outcome === "You Won!") ?
                        <img src="http://localhost:8000/assets/images/blue-dude_life.png" alt="player sprite" className="lobby-socket__outcome-image"/>
                        :
                        <img src="http://localhost:8000/assets/images/blue-dude_knocked-down.png" alt="defeated player sprite" className="lobby-socket__outcome-image"/>
                    }
                </div>
            </section>
        );
    }

    return (
        <section className="lobby-socket">
            <div className="lobby-socket__top">
                <button className='lobby-socket__button' onClick={leaveLobby}>{"<"} Leave</button>
            </div>
            {room && (
                gameStart ?
                    <GameFrame
                        playerName={playerName}
                        updateResult={setOutcome}
                        setCurrentSprite={updateCurrentSprite}
                        otherPlayers={players}
                        playerSprites={ghostSprites}
                    />
                    :
                    <div className="lobby-socket__preloader">
                        <h3 className="lobby-socket__preloader-text">{loadingText}</h3>
                        <button className='lobby-socket__button' onClick={sendStartSignal}>Start Game</button>
                    </div>
            )}
            <div className="lobby-socket__bottom">
                {players && players.map((player) => {
                    return (
                        <div className={`lobby-socket__player-wrapper${(player.username === playerName) ? " lobby-socket__player-wrapper--current" : ""}`} key={player.user_id}>
                            <p className="lobby-socket__player-name">{player.username}</p>
                            {gameStart ?
                                ""
                                :
                                <div className="lobby-socket__ready">
                                    {
                                        (player.username === playerName && !ready)
                                        &&
                                        <button className="lobby-socket__button" onClick={sendReadySignal}>Ready?</button>
                                    }
                                    {(player.username === playerName && ready) && <p className="lobby-socket__ready-text">Ready</p>}
                                </div>
                            }
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default LobbySocketConnection;