import '../styles/Main.scss'
import styled from 'styled-components';
import { useState } from 'react';

const TargetBox = styled.div`
    background-color: red;
    display: ${props => props.$show ? "block" : "none"};
    height: 30px;
    width: 30px;
    position: absolute;
    left: ${props => props.$cord[0] + 'px'};
    top: ${props => props.$cord[1] + 'px'}
`

const DropdownMenu = styled.div`
    height: 10px;
    width: 10px;
    background-color: black;
    position: relative;
    left: 30px;
`


function Main() {
    const [clickPosition, setClickPosition] = useState([]);
    const [showTargetBox, setShowTargetBox] = useState(false);

    function grabClickCoordinates(event) {
        console.log(event.nativeEvent)
        console.log(event.nativeEvent.offsetX)
        const cordX = Math.floor(event.nativeEvent.offsetX / window.innerWidth * 100)
        const cordY = Math.floor(event.nativeEvent.offsetY / window.innerHeight * 100)
        console.log(cordX)
        console.log(cordY)
        return [cordX, cordY]
    }

    function grabCordOnPage(event) {
        const cordX = event.pageX;
        const cordY = event.pageY;
        return [cordX, cordY];
    }

    const toogleTarget = () => setShowTargetBox(!showTargetBox);

    function targetBoxSwitch(event) {
        // toogleTarget();
        const [cordX, cordY] = grabCordOnPage(event);
        setClickPosition(
            [cordX,cordY])
    }

    return (
        <div>
            <img onClick={targetBoxSwitch} className='dino-picture' src='./zs9fTdh.gif' alt="dinosaurs"></img>
            <TargetBox $show={showTargetBox} $cord={clickPosition}>
                <DropdownMenu />
            </TargetBox>
        </div>
    )
}

export default Main;