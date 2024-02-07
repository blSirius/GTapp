import React, { useState , useEffect } from 'react'
import NavBar from './nav/NavBar'
import { Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';

function Search() {
  const [his,setHis] = useState([])
  useEffect(() => {
    const getAllhistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/getAllhistory`);
        setHis(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getAllhistory();
  });
  return (
    <>
      <NavBar />
      <Container>
        {/* <span class="border border-primary">Hello</span> */}
        <Form.Group className="mb-3 sm">
          {/* <Form.Label >Search Employee</Form.Label> */}
          <Form.Control className='mt-5' placeholder="Disabled input" />
        </Form.Group>
      </Container>
      <div className="d-flex  flex-row">
        <div className="p-2 ms-5 border me-5 m mt-5 border-dark w-50">


          <div data-spy="scroll">
            <h4 id="item-1">Item 1</h4>
            <p>...</p>
            <h5 id="item-1-1">Item 1-1</h5>
            <p>...</p>
          </div>
        </div>
        <div className="p-2 border me-5 mt-5 border-dark w-50">Flex item 2</div>
        {/* <div class="p-2">Flex item 3</div> */}
      </div>
    </>
  )
}

export default Search