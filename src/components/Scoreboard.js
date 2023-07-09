import { useEffect, useState} from 'react';
import '../styles/App.scss'
import {query, collection, orderBy, onSnapshot, limit} from 'firebase/firestore';
import { db } from '../Firebase';

function Scoreboard() {
    const [topScores, setTopScores] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("score"), limit(5));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const topUsers = [];
            querySnapshot.forEach((doc) => {
                topUsers.push(doc.data());
            });
            console.log("current top users", topUsers.join(", "));
            console.log(topScores)
            setTopScores(topUsers);
        });

        return () => unsubscribe();
    }, [])

    return(
        <dialog className='scoreboard' open>
            <h3>Top scores:</h3>
            <ul>
                {topScores.map((user) => {
                    return <div key={user.name} className='topUserBox'>
                        <li>{user.name}</li>
                        <p>{user.score}</p>
                        </div>
                })}
            </ul>
        </dialog>
    )
}

export default Scoreboard;