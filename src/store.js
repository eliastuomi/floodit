import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'


import mainReducer from './reducers/mainReducer'


const reducer = combineReducers({
  gameState: mainReducer.gameStateReducer,
  gameGrid: mainReducer.gridReducer,
//   availableColors: mainReducer.availableColorsReducer,
  playerTurn: mainReducer.playerTurnReducer,
  gameVisible: mainReducer.gameVisibleReducer,
  user: mainReducer.userReducer,
  playerNumber: mainReducer.playerNumberReducer,
  colorNumber: mainReducer.colorNumberReducer,
  dim: mainReducer.dimReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store