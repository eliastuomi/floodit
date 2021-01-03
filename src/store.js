import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'


import mainReducer from './reducers/mainReducer'


const reducer = combineReducers({
  gameState: mainReducer.gameStateReducer,
  currentRoom: mainReducer.currentRoomReducer,
  gameVisible: mainReducer.gameVisibleReducer,
  user: mainReducer.userReducer,
  roomId: mainReducer.roomIdReducer,
  showRooms: mainReducer.showRoomsReducer,
  gameOver: mainReducer.gameOverReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store