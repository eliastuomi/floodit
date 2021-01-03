import { useState } from "react";

import { useDispatch, useSelector } from 'react-redux'
import { setGameState } from '../reducers/mainReducer'
import { Button } from 'react-bootstrap';




const Settings = (props) => {
    const dispatch = useDispatch()
    // const playerNumber = useSelector(state => state.playerNumber)
    const gameState = useSelector(state => state.gameState)

    const [settings, setSettings] = useState({ 'w': 10, 'h': 10, 'cn': 5, 'pn': 1 })

    const handleSettingsChange = (event, component) => {
        if (component === 'w') setSettings({ ...settings, 'w': Number(event.target.value) })
        if (component === 'h') setSettings({ ...settings, 'h': Number(event.target.value) })
        if (component === 'cn') setSettings({ ...settings, 'cn': Number(event.target.value) })
        if (component === 'pn') setSettings({ ...settings, 'pn': Number(event.target.value) })
    }
    const handleSubmit = () => {

        const newGameState = {
            ...gameState,
            w: settings['w'],
            h: settings['h'],
            colorNumber: settings['cn'],
            playerNumber: settings['pn']
        }
        dispatch(setGameState(newGameState))
    }

    // const textStyle = {
    //     display: 'inline-block',
    //     width: '50px'
    // }
    // const sliderStyle = {
    //     display: 'inline-block',
    // }
    // const counterStyle = {
    //     display: 'inline-block',
    // }

    return (
        <div>
            <div>

                <div>
                    {/* <div style={textStyle}>Width</div> */}
                    Width
                    <input
                        // style={sliderStyle}
                        type={'range'}
                        min={10}
                        max={100}
                        value={settings['w']}
                        onChange={(e) => handleSettingsChange(e, 'w')}
                    />
                    {/* <div style={counterStyle}>{settings['w']}</div> */}
                    {settings['w']}
                </div>

                <div>
                    Height
                    <input
                        type={'range'}
                        min={10}
                        max={100}
                        value={settings['h']}
                        onChange={(e) => handleSettingsChange(e, 'h')}
                    />
                    {settings['h']}
                </div>
                <div>
                    Colors
                    <input
                        type={'range'}
                        min={3}
                        max={6}
                        value={settings['cn']}
                        onChange={(e) => handleSettingsChange(e, 'cn')}
                    />
                    {settings['cn']}
                </div>
                <div>
                    Players
                    <input
                        type={'range'}
                        min={1}
                        max={2}
                        value={settings['pn']}
                        onChange={(e) => handleSettingsChange(e, 'pn')}
                    />
                    {settings['pn']}
                </div>
                <div>
                    {gameState.w !== settings['w'] ||
                        gameState.h !== settings['h'] ||
                        gameState.playerNumber !== settings['pn'] ||
                        gameState.colorNumber !== settings['cn'] ?
                        <Button
                            variant="primary"
                            onClick={() => handleSubmit()}>
                            Save Settings</Button> : ''}
                </div>
            </div>

        </div>
    )
}

export default Settings