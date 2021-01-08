
const initialState = {
    gameGrid: [],
    playerNumber: 1,
    playerTurn:1,
    colorNumber: 5,
    w: 25,
    h: 25,
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

const gameOverReducer = (state = true, action) => {
    switch (action.type) {
        case 'SET_GAME_OVER':
            return action.data
        default:
            return state
    }
}

export const setGameover = (data) => {

    return {
        type: 'SET_GAME_OVER',
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

const currentRoomReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_CURRENT_ROOM':
            return action.data
        default:
            return state
    }
}

export const setCurrentRoom = (data) => {

    return {
        type: 'SET_CURRENT_ROOM',
        data: data
    }
}

const roomIdReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_ROOMID':
            return action.data
        default:
            return state
    }
}

export const setRoomId = (data) => {

    return {
        type: 'SET_ROOMID',
        data: data
    }
}


const showRoomsReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_SHOW_ROOMS':
            return action.data
        default:
            return state
    }
}

export const setShowRooms = (data) => {

    return {
        type: 'SET_SHOW_ROOMS',
        data: data
    }
}

const mainReducer = {
    gameStateReducer,
    gameVisibleReducer,
    userReducer,
    currentRoomReducer,
    roomIdReducer,
    showRoomsReducer,
    gameOverReducer,
}


export default mainReducer
