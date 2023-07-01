import '../styles/Main.scss'


function Main() {

    function grabClickCoordinates(event) {
        console.log(window.innerWidth)
        console.log(event.nativeEvent)
        console.log(event.nativeEvent.offsetX)
        console.log(event.nativeEvent.x)
        const cordX = Math.floor(event.nativeEvent.offsetX / window.innerWidth * 100)
        const cordY = Math.floor(event.nativeEvent.offsetY / window.innerHeight * 100)
        console.log(cordX)
        console.log(cordY)
    }

    return (
        <div>
            <img onClick={grabClickCoordinates} className='dino-picture' src='./zs9fTdh.gif' alt="dinosaurs"></img>
        </div>
    )
}

export default Main;