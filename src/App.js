import React, { useEffect } from 'react'
// import saveService from './services/saves'
import Room from './components/Room.js'
// import Authentication from './components/Authentication.js'
import { useDispatch } from 'react-redux'


import { setUser } from './reducers/mainReducer'
import { Container, Row, Col, Badge } from 'react-bootstrap';


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
        <Col md={{ span: 4, offset: 4 }}>
          <h1 className="text-center"><Badge variant="primary" >FLOOD IT</Badge></h1>
          {/* <Authentication /> */}
        </Col>
      </Row>
      <Room />
    </Container>
  )

}

export default App;





