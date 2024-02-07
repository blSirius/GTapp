import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

function NavBar() {
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    logout();
    navigate('/');
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>

          {/* brand */}
          <Navbar.Brand href="/home">Home</Navbar.Brand>

          <Nav className="me-auto">

            {/* menu */}
            <Nav.Link href="/album">Album</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/conclude">Conclude</Nav.Link>

            {/* owner */}
            <Nav.Link href="/personnel">Personnel</Nav.Link>

            {/* dropdown */}
            <NavDropdown title="Kiosk setting" id="navbarScrollingDropdown">

              <NavDropdown.Item href="/kioskDisplaySetting">
                Display setting
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="/kioskGreetingSystem">
                Greeting setting
              </NavDropdown.Item>

            </NavDropdown>

            <Button variant='danger' onClick={handleLogOut} >Log out</Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar; 