import React from 'react'
import NavBar from './nav/NavBar'
import { Container } from 'react-bootstrap'
import { useUserAuth } from '../context/UserAuthContext';
import styles from './style/HomeStyle.module.css';
function Home() {
    const { user } = useUserAuth();
    const style1 = {
        // marginRight: "50px",
        color: "Blue"
      };

    return (
        <>
            <NavBar />
            {/* <Container class="px-5 mx-5"> */}
                <div  className="d-flex  flex-row">
                    <div  className="p-2 ms-5 border me-5 m mt-5 border-dark w-50">
    

                        <div data-spy="scroll">
                            <h4  id="item-1">Item 1</h4>
                            <p>...</p>
                            <h5 id="item-1-1">Item 1-1</h5>
                            <p>...</p>
                        </div>
                    </div>
                    <div className="p-2 border me-5 mt-5 border-dark w-50">Flex item 2</div>
                    {/* <div class="p-2">Flex item 3</div> */}
                </div>
                {user}
            {/* </Container> */}
        </>
    )
}

export default Home