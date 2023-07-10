import '../styles/Main.scss'
import styled from 'styled-components';
import { useState, useEffect} from 'react';
import { db } from '../Firebase';
import { doc, getDoc, collection, getDocs, setDoc} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Scoreboard from './Scoreboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';

const TargetBox = styled.div`
    display: ${props => props.$show ? "block" : "none"};
    height: 50px;
    width: 50px;
    position: absolute;
    left: ${props => props.$cord[0] - 20 + 'px'};
    top: ${props => props.$cord[1] - 20 + 'px'}
`

const DropdownMenu = styled.div`
    width: 80px;
    background-color: #000000a8;
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
    font-size: clamp(1.125rem, 1.0278rem + 0.4321vw, 1.5625rem);
`

const WrongGuessBox = styled.div`
    font-size: clamp(1.125rem, 0.9583rem + 0.7407vw, 1.875rem);
    box-shadow: 3px 3px black;
    padding: 0.5em 1em;
    background-color: #ba5252;
    width: 150px;
    position: fixed;
    top: 20%;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
`

const CharacterFoundBox = styled(WrongGuessBox)`
    font-size: clamp(1.125rem, 1.0278rem + 0.4321vw, 1.5625rem);
    text-align: center;
    width: 110px;
    position: absolute;
    background-color: #000000a8;
    left: ${props => props.$cord[0] - 30 + 'px'};
    top: ${props => props.$cord[1] - 80 + 'px'};
    border: 1px solid #b5ec74;
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

function Main({stopTimer, timer}) {
    const [targetPosition, setTargetPosition] = useState([]);
    const [clickPosition, setClickPosition] = useState([]);
    const [showTargetBox, setShowTargetBox] = useState(false);
    const [showWrongBox, setWrongBox] = useState(false);
    const [endGameBox, setEndGameBox] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [username, setUsername] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [scoreBoard, setScoreBoard] = useState(false);

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
        stopTimer();
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
              saveUserScore(uid)
            } else {
              // User is signed out
              // ...
            }
        });
    }

    const saveUserScore = async (uid) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log("user exists, data:", userSnap.data());
            setErrorMessage("this player already exists!")
        } else {
            // docSnap.data() will be undefined in this case
            console.log("Created new user");
            await setDoc(doc(db, "users", uid), {
                name: uid,
                score: timer,
              });
            setEndGameBox(false);
            setScoreBoard(true);
        }
    }

    function handleInput(event) {
        setUsername(event.nativeEvent.target.value);
    }


    return (
        <div>
            <img onClick={targetBoxSwitch} className='dino-picture' src='./zs9fTdh.gif' alt="dinosaurs"></img>
            <TargetBox $show={showTargetBox} $cord={targetPosition}>
                <FontAwesomeIcon icon={faCrosshairs} style={{color: "#a5124d", height:50}} />
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
                {errorMessage === "" ? null : <p className='error-msg'>{errorMessage}</p>}
                <input onChange={handleInput} type="text"></input>
                <button onClick={signIn}>Confirm</button>
                </GameEndBox> : null}
            {scoreBoard ? <Scoreboard/> : null}
        </div>
    )
}

export default Main;