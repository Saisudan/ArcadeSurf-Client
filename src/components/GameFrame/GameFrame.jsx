import CoinCollectathon from "../../games/CoinCollectathon/CoinCollectathon";
import "./GameFrame.scss";

function GameFrame({ playerName, updateResult, setCurrentSprite, otherPlayers, playerSprites }) {
    return (
        <div className='game-frame'>
            <CoinCollectathon
                playerName={playerName}
                updateResult={updateResult}
                setCurrentSprite={setCurrentSprite}
                otherPlayers={otherPlayers}
                playerSprites={playerSprites}
            />
        </div>
    );
}

export default GameFrame;
