import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const Graphics = props => {
    const gameState = useSelector(state => state.gameState)

    const canvasRef = useRef(null)

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

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        draw(context)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState])



    const boardStyle = {
        outline: "black 2px solid",
        marginLeft: '2px'
    }

    return (
        <canvas ref={canvasRef} width={gameState.gameGrid[0].length * 15} height={gameState.gameGrid.length * 15} style={boardStyle}> </canvas>
    )

}

export default Graphics