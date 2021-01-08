import { useSelector } from 'react-redux'
import { ProgressBar, Form } from 'react-bootstrap';



const Progress = props => {
    const gameState = useSelector(state => state.gameState)
    const currentRoom = useSelector(state => state.currentRoom)

    const getVariant = colorIndex => {
        switch (colorIndex) {
            case 1:
                return 'red'
            case 2:
                return 'indigo'
            case 3:
                return 'green'
            case 4:
                return 'yellow'
            case 5:
                return 'purple'
            case 6:
                return 'aqua'
            default:
                return 'gray'
        }
    }

    const classes = [gameState.gameGrid[0][0][0], gameState.gameGrid[gameState.gameGrid[0].length - 1][gameState.gameGrid.length - 1][0]]
    const colors = [getVariant(classes[0]), getVariant(classes[1])]


    const playerProgress = () => {
        let ret = []
        for (let i = 0; i < gameState.playerNumber; i++) {
            ret.push([0, i])
            for (let x = 0; x < gameState.gameGrid[0].length; x++) {
                for (let y = 0; y < gameState.gameGrid.length; y++) {
                    if (gameState.gameGrid[y][x][1] === i + 1) ret[i] = [ret[i][0] + 1, ret[i][1]]
                }
            }
        }
        const all = gameState.gameGrid[0].length * gameState.gameGrid.length
        return ret.map(p => [p[0] / all, p[1]])
    }

    return (
        <div>

            {playerProgress().map(prog => {
                return (
                    <div key={prog[1]} className="w3-light-grey w3-round" style={{marginTop:'4px', marginBottom:'4px'}}>
                        <div key={prog[1]} className={`w3-container w3-round w3-${colors[prog[1]]}`} style={{ width: `${String(prog[0] * 100 * gameState.playerNumber)}%` }}>{currentRoom.users[prog[1]]}</div>
                    </div>

                )
            })}
        </div>
    )
}

export default Progress