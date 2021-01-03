import { useSelector } from 'react-redux'


const Progress = props => {
    const gameState = useSelector(state => state.gameState)
    const currentRoom = useSelector(state => state.currentRoom)


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
        return ret.map(p => [p[0]/all, p[1]])
    }

    return (
        <ul>
            {playerProgress().map(prog => {
                return (
                    <li key={prog[1]}>player {currentRoom.users[prog[1]]} progress {prog[0]}</li>
                )
            })}
        </ul>
    )
}

export default Progress