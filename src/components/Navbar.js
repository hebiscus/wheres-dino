import styled from 'styled-components';
import { useState } from 'react';

const Bar = styled.nav`
  font-size: 18px;
  border: 1px solid rgba(0,0,0,0.2);
  background-color: black;
  padding-bottom: 10px;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0;
    height: 70px;
    align-items: center;
  }
`
const MainNav = styled.ul`
  list-style-type: none;
  display: ${ props => props.display };
  flex-direction: column;
  @media (min-width: 768px) {
    display: flex !important;
    flex-direction: row;
    justify-content: flex-end;
  }
`

const NavLink = styled.a`
  list-style-type: none;
  display: flex;
  text-decoration: none;
  color: white;
  flex-direction: column;
  @media (min-width: 768px) {    
    margin: 0px 10px;
  }
`
const Logo  = styled(NavLink)`
  display: inline-block;
  font-size: 22px;
  margin-top: 10px;
  margin-left: 20px;
`
const NavBarToggle = styled.span`
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer; 
  color: rgba(255,255,255,0.8);
  font-size: 24px;
`
function Navbar() {
    const [showNav, setShowNaw] = useState('flex');
  
    const toggleNavbar = () => setShowNaw(showNav === 'flex' ? 'none' : "flex");

    return (
    <Bar>
      <NavBarToggle onClick={() => toggleNavbar}>
      </NavBarToggle>
      <Logo href="#">logo</Logo>
      <MainNav display={showNav}></MainNav>
    </Bar>
  )
}

export default Navbar;