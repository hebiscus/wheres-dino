import '../styles/Main.scss'
import styled from 'styled-components';
import { useState } from 'react';
import { db } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";

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
    min-width: 50px;
    min-height: 65px;
    max-width: 80px;
    background-color: black;
    position: relative;
    top: -10px;
    left: 35px;
    display: flex;
    flex-direction: column;
`

const ChoiceButton = styled.button`
    background: transparent;
    text-decoration: none;
    border: none;
    line-height: normal;
    color: white;
`


function Main() {
    const [targetPosition, setTargetPosition] = useState([]);
    const [clickPosition, setClickPosition] = useState([]);
    const [showTargetBox, setShowTargetBox] = useState(false);

    function grabClickCoordinates(event) {
        console.log(event.nativeEvent.offsetX)
        const cordX = Math.floor(event.nativeEvent.offsetX / window.innerWidth * 100)
        const cordY = Math.floor(event.nativeEvent.offsetY / window.innerHeight * 100)
        return [cordX, cordY]
    }

    function grabCordOnPage(event) {
        const cordX = event.pageX;
        const cordY = event.pageY;
        return [cordX, cordY];
    }

    const toogleTarget = () => setShowTargetBox(true);

    function targetBoxSwitch(event) {
        toogleTarget();
        const [targetX, targetY] = grabCordOnPage(event);
        const [charX, charY] = grabClickCoordinates(event);
        setTargetPosition(
            [targetX, targetY]);
        setClickPosition(
            [charX, charY]
        );
    }

    const findCharData = async (name) => {
        const charRef = doc(db, "characters", name);
        const charSnap = await getDoc(charRef);

        return charSnap.data();
    }

    const isCharFound = async (event) => {
        if(!event.target.tagName === 'BUTTON') return;
        const characterData = await findCharData(event.target.innerText)
        console.log(clickPosition, characterData)
    }

    return (
        <div>
            <img onClick={targetBoxSwitch} className='dino-picture' src='./zs9fTdh.gif' alt="dinosaurs"></img>
            <TargetBox $show={showTargetBox} $cord={targetPosition}>
                <DropdownMenu onClick={isCharFound}>
                    <ChoiceButton>Sheep</ChoiceButton>
                    <ChoiceButton>Goat</ChoiceButton>
                    <ChoiceButton>Alien</ChoiceButton>
                    <ChoiceButton>Dog</ChoiceButton>
                </DropdownMenu>
            </TargetBox>
        </div>
    )
}

export default Main;