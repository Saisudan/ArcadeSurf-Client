import CoinCollectathon from "../../games/CoinCollectathon/CoinCollectathon";
import "./GameFrame.scss";

function GameFrame({ updateResult, setCurrentSprite, playerSprites }) {
    return (
        <div className='game-frame'>
            <CoinCollectathon
                updateResult={updateResult}
                setCurrentSprite={setCurrentSprite}
                playerSprites={playerSprites}
            />
        </div>
    );
}

export default GameFrame;
