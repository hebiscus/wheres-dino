import styled from 'styled-components';

const Bar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  background-color: #92B6AA;
  padding: 0.5em;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 3%;
    height: 90px;
    align-items: center;

    > .characters-box {
      margin-left: 30px;
    }

    > h1 {
      width: 350px;
    }
  }
`

const CharactersBox  = styled.div`
  display: flex;
  gap: 3%;
`

const Timer = styled.h1`
  color: black;
`

function Navbar({timer}) {
    return (
    <Bar className='navbar'>
      <CharactersBox className='characters-box'>
        <img src='./Sheep.png' alt='Sheep'></img>
        <img src='./Dog.png' alt='Dog'></img>
        <img src='./Alien.png' alt='Alien'></img>
        <img src='./Goat.png' alt='Goat'></img>
      </CharactersBox>
      <Timer>Time passed: {timer.toFixed(3)}</Timer>
    </Bar>
  )
}

export default Navbar;