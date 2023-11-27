import { socket } from '../../socket';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameFrame from '../GameFrame/GameFrame';
import "./LobbySocketConnection.scss";

function LobbySocketConnection({ playerName }) {
    const [ room, setRoom ] = useState("");
    const [ players, setPlayers ] = useState(null);
    const [ outcome, setOutcome ] = useState(null);
    const [ currentSprite, setCurrentSprite ] = useState(null);
    const [ ghostSprites, setGhostSprites ] = useState([]);
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

    socket.on("failed-join", () => {
        console.log("Failed to join room");
        navigator("/lobby");
    });

    function updateCurrentSprite(currentData) {
        const currentPlayer = {
            x: currentData.x,
            y: currentData.y,
            sprite: currentData.sprite,
            username: playerName,
            room: room
        }
        socket.emit("current-player-position", currentPlayer);
        setCurrentSprite(currentPlayer);
    }

    function updatePlayerSprites(spriteToAdd) {
        if (spriteToAdd.username === playerName) {
            // Current player, skip
        } else if (ghostSprites.find((ghost) => { return ghost.username === spriteToAdd.username})) {
            // Ghost already exists in list, update settings
            const updatedGhost = ghostSprites.find((ghost) => { return ghost.username === spriteToAdd.username});
            updatedGhost.x = spriteToAdd.x;
            updatedGhost.y = spriteToAdd.y;
            updatedGhost.sprite = spriteToAdd.sprite;
            const newGhostList = ghostSprites.filter((ghost) => { return ghost.username !== spriteToAdd.username});
            newGhostList.push(updatedGhost);
            setGhostSprites(newGhostList);
        } else {
            // Ghost not in list, add them
            const newGhostList = [...ghostSprites, spriteToAdd];
            setGhostSprites(newGhostList);
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
    })

    // Show outcome when game is decided
    if (outcome) {
        socket.emit("won-game", { roomID: room, username: playerName });
        return (
            <section className="lobby-socket">
                <div className="lobby-socket__bottom">
                    <h1 className='lobby-socket__outcome'>{outcome}</h1>
                </div>
            </section>
        );
    }

    return (
        <section className="lobby-socket">
            <div className="lobby-socket__top">
                <button className='lobby-socket__button' onClick={leaveLobby}>{"<"} Leave</button>
            </div>
            {room && <GameFrame 
                updateResult={setOutcome}
                setCurrentSprite={updateCurrentSprite}
                playerSprites={ghostSprites}
            />}
            <div className="lobby-socket__bottom">
                {players && players.map((player) => {
                    return (<p className="lobby-socket__player-name" key={player.user_id}>{player.username}</p>);
                })}
            </div>
        </section>
    );
}

export default LobbySocketConnection;