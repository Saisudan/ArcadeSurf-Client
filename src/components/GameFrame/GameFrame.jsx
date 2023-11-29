import CoinCollectathon from "../../games/CoinCollectathon/CoinCollectathon";
import "./GameFrame.scss";

function GameFrame({ updateResult, setCurrentSprite, otherPlayers, playerSprites }) {
    return (
        <div className='game-frame'>
            <CoinCollectathon
                updateResult={updateResult}
                setCurrentSprite={setCurrentSprite}
                otherPlayers={otherPlayers}
                playerSprites={playerSprites}
            />
        </div>
    );
}

export default GameFrame;
