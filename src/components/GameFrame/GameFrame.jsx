import CoinCollectathon from "../../games/CoinCollectathon/CoinCollectathon";
import "./GameFrame.scss";

function GameFrame({ updateResult }) {
    return (
        <div className='game-frame'>
            <CoinCollectathon updateResult={updateResult}/>
        </div>
    );
}

export default GameFrame;
