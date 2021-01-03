import React from 'react'
import { useSelector } from 'react-redux'

const GameButtons = props => {
    const gameState = useSelector(state => state.gameState)

    const getAvailableColors = (grid, cn, pn) => {
        if (grid.length === 0) return []
        const pColors = []
        for (let i = 0; i < cn; i++) pColors.push(i + 1)

        if (pn === 1) return pColors.filter(c => c !== grid[0][0][0])
        else return pColors.filter(c => c !== grid[0][0][0] && c !== grid[grid.length - 1][grid[0].length - 1][0])
    }

    const availableColors = gameState.gameGrid ? getAvailableColors(gameState.gameGrid, gameState.colorNumber, gameState.playerNumber) : []

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

    const buttonstyle = {
        height: '50px',
        width: '50px',
    }

    return (
        <div>
            {
                availableColors.map(color => {
                    return <button
                        style={{
                            marginTop: '5px',
                            marginBottom: '6px',
                            marginRight: '5px',
                            //border: getColor(color),
                            backgroundColor: props.clickable ? getColor(color) : 'grey',
                            ...buttonstyle
                        }}
                        key={color}
                        disabled={!props.clickable}
                        onClick={() => props.playTurnButtonHandler(color)}>
                    </button>
                })
            }
        </div>
    )

}

export default GameButtons