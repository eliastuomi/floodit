import React from 'react'
import Graphics from './Graphics.js'
import GameButtons from './GameButtons.js'
import Progress from './Progress'

// import saveService from '../services/saves'
// import DropdownMenu from './DropdownMenu'

import { useDispatch, useSelector } from 'react-redux'
import { setGameState } from '../reducers/mainReducer'
import { Button, Badge, Row, Col } from 'react-bootstrap';



const Game = props => {

    const dispatch = useDispatch()
    const gameState = useSelector(state => state.gameState)
    const gameVisible = useSelector(state => state.gameVisible)
    const currentRoom = useSelector(state => state.currentRoom)
    const gameOver = useSelector(state => state.gameOver)

    // const user = useSelector(state => state.user)

    // const [saves, setSaves] = useState([])

    // useEffect(() => {
    //     if (user) {
    //         saveService
    //             .getAll()
    //             .then(response => {
    //                 console.log('useeffect hankkii datan:', response.data)
    //                 setSaves(response.data)
    //             })
    //             .catch(error => {
    //                 console.log('fail')
    //             })
    //     }
    //     else {
    //         setSaves([])
    //     }
    // }, [user])

    // const addSaveGame = async () => {

    //     const saveObject = {
    //         data: gameGrid,
    //         playerNumber: playerNumber,
    //         playerTurn: playerTurn,
    //         colorNumber: colorNumber
    //     }

    //     try {
    //         const newSave = await saveService.create(saveObject)
    //         setSaves(saves.concat(newSave))
    //         console.log(newSave)


    //     } catch (exception) {
    //         console.log(exception)
    //     }
    // }

    // const loadSaveGameById = async (id) => {

    //     try {
    //         const loadFile = await saveService.getId(id)
    //         dispatch(setPlayerTurn(loadFile.playerTurn))
    //         dispatch(setPlayerNumber(loadFile.playerNumber))
    //         dispatch(setColorNumber(loadFile.colorNumber))
    //         dispatch(setGameGrid(loadFile.data))
    //         //dispatch(setAvailableColors(getAvailableColors(loadFile.data, loadFile.colorNumber, loadFile.playerNumber)))


    //     } catch (exception) {
    //         console.log(exception)
    //     }
    // }

    const currentTurn = currentRoom.users[gameState.playerTurn - 1]
    const startingPoint = gameState.playerTurn && gameState.playerTurn === 1 ? [0, 0] : [gameState.gameGrid[0].length - 1, gameState.gameGrid.length - 1]

    const randomizeGrid = (w, h) => {
        let grid = []
        let previous = [1, 0]

        for (let y = 0; y < h; y++) {
            grid.push([])

            for (let x = 0; x < w; x++) {
                let rand = [1, 0]
                if (Math.random() < 0.09 && x !== 0) rand = previous
                else if (Math.random() < 0.09 && y !== 0) rand = [grid[y - 1][x][0], 0]
                else rand = [Math.floor(Math.random() * gameState.colorNumber) + 1, 0]

                previous = rand
                grid[y].push(rand)

            }
        }
        return grid
    }

    const gameIsValid = (g) => {

        if (g[0][0][0] === g[1][0][0] || g[0][0][0] === g[0][1][0]) return true

        else if (gameState.playerNumber === 2 && (g[g.length - 1][g[0].length - 1][0] === g[g.length - 2][g[0].length - 1][0] || g[g.length - 1][g[0].length - 1][0] === g[g.length - 1][g[0].length - 2][0])) {
            return true
        }

        else if (gameState.playerNumber === 2 && (g[g.length - 1][g[0].length - 1][0] === g[0][0][0])) {
            return true
        }

        else return false
    }

    const newGame = (w, h) => {
        let newGrid = []
        do {
            newGrid = randomizeGrid(w, h).slice(0)
            newGrid[0][0] = [newGrid[0][0][0], 1]

            if (gameState.playerNumber === 2) newGrid[h - 1][w - 1] = [newGrid[h - 1][w - 1][0], 2]

        } while (gameIsValid(newGrid))

        const newGameState = {
            ...gameState,
            gameGrid: newGrid.slice(0),
            playerTurn: 1,
        }

        dispatch(setGameState(newGameState))
        props.handleStart(newGameState)
    }

    const gameIsOver = (grid) => {
        const tGrid = grid.map(a => a.map(b => b[1])).flat()
        const all = gameState.gameGrid[0].length * gameState.gameGrid.length


        if (tGrid.filter(x => x === 0).length === 0) {
            if (gameState.playerNumber === 2) {
                for (let i = 0; i < gameState.playerNumber; i++) {

                    if (tGrid.filter(x => x === i + 1).length / all > 0.5) {
                        return currentRoom.users[i]
                    }
                }
                return 'tie'
            }
            return 'won'
        }
        return ''
    }

    var tempGrid = []

    const recursionfunc = (x, y, color) => {

        // Jos on vierailtu jo
        if (tempGrid[y][x][2] === true) {
            return
        }

        else if (gameState.playerNumber === 2 && tempGrid[y][x][1] !== 0 && tempGrid[y][x][1] !== gameState.playerTurn) {
            tempGrid[y][x][2] = true
            return
        }

        // Jos on oma palikka
        else if (tempGrid[y][x][1] === gameState.playerTurn) {
            // Ruudussa on nyt vierailtu
            tempGrid[y][x][2] = true

            if (x !== 0) recursionfunc(x - 1, y, color)
            if (y !== 0) recursionfunc(x, y - 1, color)
            if (x !== tempGrid[0].length - 1) recursionfunc(x + 1, y, color)
            if (y !== tempGrid.length - 1) recursionfunc(x, y + 1, color)
            return
        }

        // Jos ruudussa ei ole vierailtu eikä ole oma palikka, mutta on saman värinen
        else if (tempGrid[y][x][0] === color) {

            // Ruudussa on nyt vierailtu ja se on merkitty omaksi palikaksi
            tempGrid[y][x][2] = true
            tempGrid[y][x][1] = gameState.playerTurn

            if (x !== 0) recursionfunc(x - 1, y, color)
            if (y !== 0) recursionfunc(x, y - 1, color)
            if (x !== tempGrid[0].length - 1) recursionfunc(x + 1, y, color)
            if (y !== tempGrid.length - 1) recursionfunc(x, y + 1, color)
            return
        }
        // Jos ruudussa ei ole vierailtu, eikä se ole oma, eikä se ole saman värinen
        else {
            // Ruudussa on nyt vierailtu
            tempGrid[y][x][2] = true
            return
        }
    }

    const changeTurn = () => {
        const newTurn = gameState.playerNumber === 1 ? 1 : gameState.playerTurn === 1 ? 2 : 1
        return newTurn
    }

    const playTurn = (col) => {
        const colorChangedGrid = gameState.gameGrid.map(a => a.map(b => b[1] === gameState.playerTurn ? [col, gameState.playerTurn] : b))
        tempGrid = colorChangedGrid.map(a => a.map(b => [...b, false]))
        recursionfunc(startingPoint[0], startingPoint[1], col)
        const tempToOriginal = tempGrid.map(a => a.map(b => [b[0], b[1]]))

        const newGameState = {
            ...gameState,
            gameGrid: tempToOriginal,
            playerTurn: changeTurn()
        }

        dispatch(setGameState(newGameState))
        props.handleUpdate(newGameState)

        switch (gameIsOver(tempToOriginal)) {
            case '':
                break
            case 'tie':
                props.gameOver('Draw!')
                break
            case 'won':
                props.gameOver('You won!')
                break
            default:
                props.gameOver(gameIsOver(tempToOriginal) + 'won')
                break
        }


    }


    const playTurnButtonHandler = col => {
        playTurn(col)
    }

    const newGameButtonHandler = () => {
        newGame(gameState.w, gameState.h)
    }

    // const saveGameButtonHandler = () => {
    //     console.log('saves')
    //     addSaveGame()
    // }

    return (
        <>
            <Row>
                <Col md={{ span: 4, offset: 4 }}>

                    {gameOver && props.isHost ? <Button
                        variant="outline-danger"
                        block
                        onClick={newGameButtonHandler}>
                        Start game!</Button> : ''}
                    {/* {
                    gameVisible ?
                        <div>
                            <button onClick={newGameButtonHandler} style={{ float: 'left' }}>New Game!</button>
                            <button onClick={endGameButtonHandler} style={{ float: 'left' }}>Settings</button>
                            <button onClick={saveGameButtonHandler} style={{ float: 'left' }}>Save</button>
                            <DropdownMenu loadFiles={saves} loadFunc={loadSaveGameById}></DropdownMenu>
                        </div> :
                        <div>
                            <button onClick={newGameButtonHandler}>New Game!</button>
                        </div>
                } */}
                </Col>
            </Row>
            {gameVisible ?
                <div>
                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            {/* {gameState.playerNumber === 2 ?

                                <Badge variant="danger">{currentTurn}</Badge>

                                : ''} */}
                            {!gameOver ? <GameButtons playTurnButtonHandler={playTurnButtonHandler} clickable={currentTurn === props.me} /> : ''}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Graphics />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            <Progress />
                        </Col>
                    </Row>
                </div> : ''}

        </>
    )
}

export default Game