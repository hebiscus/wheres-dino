import styled from 'styled-components';

const Bar = styled.nav`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  align-items: center;
  font-size: 18px;
  background-color: #64B6A0;
  box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.7);
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