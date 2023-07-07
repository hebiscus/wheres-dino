import '../styles/Main.scss'
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

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

const WrongGuessBox = styled.div`
    background-color: black;
    height: 50px;
    width: 130px;
    position: fixed;
    top: 30%;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
`

const CharacterFoundBox = styled(WrongGuessBox)`
    position: absolute;
    background-color: cyan;
    left: ${props => props.$cord[0] + 'px'};
    top: ${props => props.$cord[1] + 'px'};
`

const GameEndBox = styled.dialog`
    position: fixed;
    background-color: white;
    min-height: 55%;
    min-width: 35%;
    top: 50%;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
`

function Main() {
    const [targetPosition, setTargetPosition] = useState([]);
    const [clickPosition, setClickPosition] = useState([]);
    const [showTargetBox, setShowTargetBox] = useState(false);
    const [showWrongBox, setWrongBox] = useState(false);
    // const [unfoundCharacters, setUnfoundCharacters] = useState([]);
    // const [foundCharacters, setFoundCharacters] = useState([]);
    const [endGameBox, setEndGameBox] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [username, setUsername] = useState();

    useEffect(() => {
        let ignore = false;

        const getCharacters = async () => {
            const charRef = collection(db, "characters");
            const charSnap = await getDocs(charRef);
            if (!ignore) {
                charSnap.forEach(character => {
                    setCharacters((previousCharacters) => {
                        return [...previousCharacters, character.data()]
                    })
                })
            } 
        }

        getCharacters();

        return () => {
            ignore = true;
        };
    }, [])

    useEffect(() => {
        hasGameEnded();
    }, [characters])

    function grabClickCoordinates(event) {
        const cordX = Math.floor(event.nativeEvent.offsetX / event.nativeEvent.target.width * 100)
        const cordY = Math.floor(event.nativeEvent.offsetY / event.nativeEvent.target.width * 100)
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
        setWrongBox(false)
    }

    const findCharData = async (name) => {
        const charRef = doc(db, "characters", name);
        const charSnap = await getDoc(charRef);

        return charSnap.data();
    }

    const isCoordinateNear = (charCord, min, max) => {
        return charCord >= min && charCord <= max;
    }

    const isCharFound = async (event) => {
        if(event.target.tagName !== 'BUTTON') return;
        const characterData = await findCharData(event.target.innerText)
        const [charCordX, charCordY] = characterData.coordinates
        const checkX = isCoordinateNear(clickPosition[0], charCordX - 1, charCordX + 1);
        const checkY = isCoordinateNear(clickPosition[1], charCordY - 1, charCordY + 1);
        if (checkX === false || checkY === false) {
            setWrongBox(true);
        } 
        else {
            const rightChoiceCord = [event.pageX, event.pageY];
            const updatedCharacters = characters.map((character) => {
                if (character.name === characterData.name) {
                    return {...character, foundStatus: true, coordinatesOnPage: rightChoiceCord}
                }
                return character;
            })
            setCharacters(updatedCharacters);
        }
    }

    const hasGameEnded = () => {
        const nrOfFoundCharacters = characters.filter(character => character.foundStatus === true).length
        if (nrOfFoundCharacters < 4) return;
        setEndGameBox(true);
    }

    const signIn = () => {
        const auth = getAuth();
        signInAnonymously(auth)
        .then(() => {
            console.log("signedIn")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });

        onAuthStateChanged(auth, (user) => {
            if (user) {
              user.uid = username;
              const uid = user.uid;
              console.log(`userID: ${uid}`)
              // ...
            } else {
              // User is signed out
              // ...
            }
        });
    }

    function handleInput(event) {
        setUsername(event.nativeEvent.target.value);
    }

    return (
        <div>
            <img onClick={targetBoxSwitch} className='dino-picture' src='./zs9fTdh.gif' alt="dinosaurs"></img>
            <TargetBox $show={showTargetBox} $cord={targetPosition}>
                <DropdownMenu onClick={isCharFound}>
                    {characters.map((character) => {
                        if (!character.foundStatus) {
                            return <ChoiceButton key={character.name}>{character.name}</ChoiceButton>
                        }
                        return null;
                    })}
                </DropdownMenu>
            </TargetBox>
            {showWrongBox ? <WrongGuessBox>Wrong guess!</WrongGuessBox> : null}
            {characters.map((character) => {
                if (character.foundStatus) {
                    return <CharacterFoundBox $cord={character.coordinatesOnPage} key={character.name}>{character.name}</CharacterFoundBox>
                }
                return null;
            })}
            {endGameBox ? <GameEndBox open>
                <p>please enter your name to save your score:</p>
                <input onChange={handleInput} type="text"></input>
                <button onClick={signIn}>Confirm</button>
                </GameEndBox> : null}
        </div>
    )
}

export default Main;