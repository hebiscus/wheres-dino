import '../styles/App.scss'

function StartingScreen({switchStartingBox, turnTimerOn}) {

    function startGame() {
        switchStartingBox();
        turnTimerOn();
    }

    return (
        <div className='start-background'>
            <div className='startBox'>
                <h1>Welcome to Where's Dino!</h1>
                <div className="start-instructions">
                    <p>This <em>"Where's Waldo"</em> type of game challenges you to find 4 characters.</p>
                    <p>But be careful, you're timed!</p>
                    <p> Coincidentally, you won't have to find any dinosaurs. Maybe because they're extinct...?</p>
                </div>
                <button onClick={startGame}>Start guessing</button>
            </div>
        </div>
    )
}

export default StartingScreen;