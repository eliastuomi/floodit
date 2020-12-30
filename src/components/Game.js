import React, { useState, useEffect } from 'react'
import GameBoard from './GameBoard.js'
import saveService from '../services/saves'
import DropdownMenu from './DropdownMenu'


import { useDispatch, useSelector } from 'react-redux'
import { setGameGrid, setPlayerTurn, setGameVisible, setPlayerNumber, setColorNumber, setGameState } from '../reducers/mainReducer'


const Game = props => {

    const dispatch = useDispatch()
    const gameState = useSelector(state => state.gameState)
    const gameVisible = useSelector(state => state.gameVisible)
    const user = useSelector(state => state.user)



    // const gameGrid = useSelector(state => state.gameGrid)
    // const playerTurn = useSelector(state => state.playerTurn)
    // const playerNumber = useSelector(state => state.playerNumber)
    // const colorNumber = useSelector(state => state.colorNumber)
    // const dim = useSelector(state => state.dim)

    const [saves, setSaves] = useState([])

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

    const getAvailableColors = (grid, cn, pn) => {
        if (grid.length === 0) return []
        const pColors = []
        for (let i = 0; i < cn; i++) pColors.push(i + 1)

        if (pn === 1) return pColors.filter(c => c !== grid[0][0][0])
        else return pColors.filter(c => c !== grid[0][0][0] && c !== grid[grid.length - 1][grid[0].length - 1][0])
    }

    const myTurn = props.players[gameState.playerTurn - 1] === props.me
    const availableColors = gameState.gameGrid ? getAvailableColors(gameState.gameGrid, gameState.colorNumber, gameState.playerNumber) : []


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

    const startingPoint = gameState.playerTurn && gameState.playerTurn === 1 ? [0, 0] : [gameState.gameGrid[0].length - 1, gameState.gameGrid.length - 1]


    const checkNeighbour = (grid, x, y) => {
        if (x === -1) return false
        else if (y === -1) return false
        else if (x === grid[0].length) return false
        else if (y === grid.length) return false
        else return true
    }

    const draw = ctx => {
        ctx.clearRect(0, 0, gameState.gameGrid[0].length * 15, gameState.gameGrid.length * 15)

        for (let x = 0; x < gameState.gameGrid[0].length; x++) {
            for (let y = 0; y < gameState.gameGrid.length; y++) {

                ctx.fillStyle = getColor(gameState.gameGrid[y][x][0])
                //ctx.shadowColor = 'black'
                //ctx.shadowBlur = 4 ;
                ctx.fillRect(x * 15, y * 15, 15, 15)

                if (checkNeighbour(gameState.gameGrid, x + 1, y) && gameState.gameGrid[y][x][0] !== gameState.gameGrid[y][x + 1][0]) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.moveTo(x * 15 + 15, y * 15);
                    ctx.lineTo(x * 15 + 15, y * 15 + 15);
                    ctx.stroke();
                    ctx.closePath()
                }
                if (checkNeighbour(gameState.gameGrid, x, y + 1) && gameState.gameGrid[y][x][0] !== gameState.gameGrid[y + 1][x][0]) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.moveTo(x * 15, y * 15 + 15);
                    ctx.lineTo(x * 15 + 15, y * 15 + 15);
                    ctx.stroke();
                    ctx.closePath()

                }
            }
        }
    }

    const getColor = colorIndex => {
        switch (colorIndex) {
            case 1:
                return '#ff3300' //red
            case 2:
                return '#0000ff' //blue
            case 3:
                return '#00ff00' //green
            case 4:
                return '#ffff00' //yellow
            case 5:
                return '#cc00cc' //purple
            case 6:
                return 'turquoise'
            default:
                return 'black'
        }
    }


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

            //dispatch(setAvailableColors(getAvailableColors(newGrid, colorNumber)))

        } while (gameIsValid(newGrid))

        const newGameState = {
            ...gameState,
            gameGrid: newGrid.slice(0),
            playerTurn: 1,
        }

        dispatch(setGameState(newGameState))
        props.handleUpdate(newGameState)
        //dispatch(setGameGrid(newGrid.slice(0)))
    }

    const changeTurn = () => {
        const newTurn = gameState.playerNumber === 1 ? 1 : gameState.playerTurn === 1 ? 2 : 1
        return newTurn
        //dispatch(setPlayerTurn(newTurn))
    }

    const gameIsOver = (grid) => {
        const tGrid = grid.map(a => a.map(b => b[1])).flat()

        if (tGrid.filter(x => x === 0).length === 0) return true
        return false
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

        //dispatch(setGameGrid(tempToOriginal))

        if (gameIsOver(tempToOriginal)) alert('voitit')

        //dispatch(setAvailableColors(getAvailableColors(tempToOriginal, colorNumber)))
        //changeTurn()
    }



    const playTurnButtonHandler = col => {
        playTurn(col)
    }

    const newGameButtonHandler = () => {
        newGame(gameState.w, gameState.h)
        dispatch(setGameVisible(true))
        // props.setSettingsVisible(false)
    }

    const endGameButtonHandler = () => {
        dispatch(setGameVisible(false))
        // props.setSettingsVisible(true)
    }

    // const saveGameButtonHandler = () => {
    //     console.log('saves')
    //     addSaveGame()
    // }


    const buttonstyle = {
        height: '50px',
        width: '50px',
    }

    return (

        <div>
            <div style={{ marginTop: '5px' }}>
                {
                    gameVisible ?
                        <div>
                            <button onClick={newGameButtonHandler} style={{ float: 'left' }}>New Game!</button>
                            <button onClick={endGameButtonHandler} style={{ float: 'left' }}>Settings</button>
                            {/* <button onClick={saveGameButtonHandler} style={{ float: 'left' }}>Save</button>
                            <DropdownMenu loadFiles={saves} loadFunc={loadSaveGameById}></DropdownMenu> */}
                        </div> :
                        <div>
                            <button onClick={newGameButtonHandler}>New Game!</button>
                        </div>
                }
            </div>
            <div style={{ clear: 'left' }}></div>
            {gameVisible ?
                <div>
                    <div>
                        {myTurn ?
                            availableColors.map(color => {
                                return <button
                                    style={{
                                        marginTop: '5px',
                                        marginBottom: '6px',
                                        marginRight: '5px',
                                        //border: getColor(color),
                                        backgroundColor: getColor(color),
                                        ...buttonstyle
                                    }}
                                    key={color}
                                    onClick={() => playTurnButtonHandler(color)}>
                                </button>
                            })
                            : ''}
                    </div>
                    <GameBoard
                        width={gameState.gameGrid[0].length * 15}
                        height={gameState.gameGrid.length * 15}
                        draw={draw}>
                    </GameBoard>
                </div> : ''}

        </div>
    )
}

export default Game