import TestGame from "../../games/TestGame/TestGame";
import "./GameFrame.scss";

function GameFrame({ updateResult }) {
    return (
        <div className='game-frame'>
            <TestGame updateResult={updateResult}/>
        </div>
    );
}

export default GameFrame;
