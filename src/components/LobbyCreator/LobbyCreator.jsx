import { socket } from '../../socket';
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./LobbyCreator.scss";

function LobbyCreator(props) {
    const { userInfo } = useContext(UserContext);
    const [ playerName, setPlayerName ] = useState("");
    const navigator = useNavigate();

    useEffect(() => {
        if (!(userInfo || playerName)) {
            navigator("/");
        } else if (userInfo && !playerName) {
            setPlayerName(userInfo.username);
        }
    }, [userInfo, playerName]);

    function handleSubmit(event) {
        event.preventDefault();

        const roomToCreate = {
            username: playerName,
            matchType: null,
            visibility: "public",
            password: null
        };
        socket.emit("create-room", roomToCreate);
    }

    // Navigate to the lobby once it is created
    socket.on("created-room", async (receivedData) => {
        const newLobbyID = receivedData;
        navigator(`/lobby/${newLobbyID}`);
    });

    return (
        <div className="lobby-creator">
            <form action="submit" onSubmit={handleSubmit} className="lobby-creator__form">
                <button className="lobby-creator__button" type="submit">Create</button>
            </form>
        </div>
    );
}

export default LobbyCreator;