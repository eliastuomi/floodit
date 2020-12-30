import React, { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import saveService from './services/saves'
import usersService from './services/users'
import Room from './components/Room.js'



import { useDispatch, useSelector } from 'react-redux'
import { setUser, setPlayerNumber, setColorNumber, setDim } from './reducers/mainReducer'



const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)


  const [showSignUpForm, setShowSignupForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedFloodItUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      //saveService.setToken(user.token)
    }
  }, [dispatch])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedFloodItUser', JSON.stringify(user)
      )
      //saveService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const user = await usersService.signUp({
        username, password,
      })

      window.localStorage.setItem(
        'loggedFloodItUser', JSON.stringify(user)
      )
      //saveService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogOut = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
    //saveService.setToken(null)

  }

  const signUpForm = () => (
    <form onSubmit={handleSignUp}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Sign Up</button>
      <button onClick={() => setShowSignupForm(!showSignUpForm)}>Cancel</button>
    </form>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
      <button onClick={() => setShowLoginForm(!showLoginForm)}>Cancel</button>
    </form>
  )

  const showSignUpOpenerButton = () => (
    <button onClick={() => setShowSignupForm(!showSignUpForm)}>Sign Up</button>
  )
  const showLoginOpenerButton = () => (
    <button onClick={() => setShowLoginForm(!showLoginForm)}>Login</button>
  )

  return (
    <div>
      <Room />

      <div>Flood It!</div>

      {user === null && showSignUpForm && signUpForm()}
      {user === null && !showSignUpForm && showSignUpOpenerButton()}

      {user === null && showLoginForm && loginForm()}
      {user === null && !showLoginForm && showLoginOpenerButton()}

      {user !== null && <button onClick={() => handleLogOut()}>Log Out</button>}

      
    </div>
  )

}

export default App;





