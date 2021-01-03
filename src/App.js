import React, { useEffect } from 'react'
// import saveService from './services/saves'
import Room from './components/Room.js'
// import Authentication from './components/Authentication.js'
import { useDispatch } from 'react-redux'


import { setUser } from './reducers/mainReducer'
import { Container, Row, Col } from 'react-bootstrap';


const App = () => {
  const dispatch = useDispatch()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedFloodItUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      //saveService.setToken(user.token)
    }
  }, [dispatch])


  return (
    <Container fluid>
      <Row>
        <Col>
          <h1>Flood It</h1>
          {/* <Authentication /> */}
          <Room />
        </Col>
      </Row>
    </Container>
  )

}

export default App;





