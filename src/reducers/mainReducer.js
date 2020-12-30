
const initialState = {
    gameGrid: [],
    playerNumber: 1,
    playerTurn:1,
    colorNumber: 5,
    w: 10,
    h: 10,
}

const gameStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GAMESTATE':
            return action.data
        default:
            return state
    }
}

export const setGameState = (data) => {
    return {
        type: 'SET_GAMESTATE',
        data: data
    }
}

const gridReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_GRID':
            return action.data
        default:
            return state
    }
}

export const setGameGrid = (data) => {
    return {
        type: 'SET_GRID',
        data: data
    }
}

const playerTurnReducer = (state = 1, action) => {
    switch (action.type) {
        case 'SET_PLAYERTURN':
            return action.data
        default:
            return state
    }
}

export const setPlayerTurn = (data) => {

    return {
        type: 'SET_PLAYERTURN',
        data: data
    }
}

const gameVisibleReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_GAME_VISIBLE':
            return action.data
        default:
            return state
    }
}

export const setGameVisible = (data) => {

    return {
        type: 'SET_GAME_VISIBLE',
        data: data
    }
}

const userReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.data
        default:
            return state
    }
}

export const setUser = (data) => {

    return {
        type: 'SET_USER',
        data: data
    }
}

const playerNumberReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SET_PLAYER_NUMBER':
            return action.data
        default:
            return state
    }
}

export const setPlayerNumber = (data) => {

    return {
        type: 'SET_PLAYER_NUMBER',
        data: data
    }
}

const colorNumberReducer = (state = 5, action) => {
    switch (action.type) {
        case 'SET_COLOR_NUMBER':
            return action.data
        default:
            return state
    }
}

export const setColorNumber = (data) => {

    return {
        type: 'SET_COLOR_NUMBER',
        data: data
    }
}

const dimReducer = (state = {'w': 20, 'h': 20}, action) => {
    switch (action.type) {
        case 'SET_DIM':
            return action.data
        default:
            return state
    }
}

export const setDim = (data) => {

    return {
        type: 'SET_DIM',
        data: data
    }
}


export default {
    gameStateReducer,
    gridReducer,
    // availableColorsReducer,
    playerTurnReducer,
    gameVisibleReducer,
    userReducer,
    playerNumberReducer,
    colorNumberReducer,
    dimReducer
}
