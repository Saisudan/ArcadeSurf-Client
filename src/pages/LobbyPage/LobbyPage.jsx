import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import PickUsername from "../../components/PickUsername/PickUsername";

function LobbyPage() {
    const { userInfo } = useContext(UserContext);
    const [ playerName, setPlayerName ] = useState("");
    const [ nameSelection, setNameSelection ] = useState(false);

    useEffect(() => {
        if (!(userInfo || playerName)) {
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
            {nameSelection && <PickUsername changeName={pickPlayerName} />}
        </section>
    );
}

export default LobbyPage;