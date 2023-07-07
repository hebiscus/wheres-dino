import { useState } from 'react';
import '../styles/App.scss'

function StartingScreen({switchStartingBox, turnTimerOn}) {

    function startGame() {
        switchStartingBox();
        turnTimerOn();
    }

    return (
        <div className='startBox'>
            <h1>Welcome to Where's Dino!</h1>
            <div className="start-instructions">
                <p>It's a Where's Waldo type of game, where you have to find 4 characters.</p>
                <p>But be careful, you're timed!</p>
                <p> Coincidentally, you won't have to find any dinosaurs. Maybe because they're extinct...?</p>
            </div>
            <button onClick={startGame}>Start guessing</button>
        </div>
    )
}

export default StartingScreen;