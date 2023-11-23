import { socket } from '../../socket';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameFrame from '../GameFrame/GameFrame';

function LobbySocketConnection({ playerName }) {
    const [ room, setRoom ] = useState("");
    const [ players, setPlayers ] = useState(null);
    const [ outcome, setOutcome ] = useState(null);
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


    function leaveLobby() {
        socket.emit("leave-room", { roomID: room, username: playerName });
    }

    socket.on("left-room", () => {
        setRoom("leaving...");
        setPlayers(null);
    });


    // Show outcome when game is decided
    if (outcome) {
        return <p>{outcome}</p>;
    }

    return (
        <section className="lobby-socket">
            <div className="lobby-socket__top">
                <button className='lobby-socket__button' onClick={leaveLobby}>{"<"} Leave</button>
            </div>
            {room && <GameFrame updateResult={setOutcome} />}
            <div className="lobby-socket__bottom">
                {players && players.map((player) => {
                    return (<p className="lobby-socket__player-name" key={player.user_id}>{player.username}</p>);
                })}
            </div>
        </section>
    );
}

export default LobbySocketConnection;