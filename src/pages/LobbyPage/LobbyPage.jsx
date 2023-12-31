import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../App";
import PickUsername from "../../components/PickUsername/PickUsername";
import LobbySocketConnection from "../../components/LobbySocketConnection/LobbySocketConnection";
import "./LobbyPage.scss";

function LobbyPage() {
    const { userInfo } = useContext(UserContext);
    const [ playerName, setPlayerName ] = useState("");
    const [ nameSelection, setNameSelection ] = useState(true);
    const navigator = useNavigate();

    useEffect(() => {
        if (!(userInfo || playerName)) {
            navigator("/");
            setNameSelection(true);
        } else if (userInfo && !playerName) {
            setPlayerName(userInfo.username);
            setNameSelection(false);
        }
    }, [userInfo, playerName]);

    function pickPlayerName(name, flag) {
        setPlayerName(name);
        setNameSelection(flag);
    }

    return (
        <section className="lobby-page">
            {nameSelection && <PickUsername changeName={pickPlayerName}/>}
            {!nameSelection && (
                <LobbySocketConnection playerName={playerName}/>
            )}
        </section>
    );
}

export default LobbyPage;