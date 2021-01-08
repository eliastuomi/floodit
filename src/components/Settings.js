import { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux'
import { setGameState } from '../reducers/mainReducer'
import { Button, Form, Badge, ButtonGroup, ToggleButton } from 'react-bootstrap';




const Settings = (props) => {
    const dispatch = useDispatch()
    // const playerNumber = useSelector(state => state.playerNumber)
    const gameState = useSelector(state => state.gameState)

    const [settings, setSettings] = useState({ 'w': 25, 'h': 25, 'cn': 5, 'pn': 1 })

    useEffect(() => {
        setSettings({ w: gameState.w, h: gameState.h, cn: gameState.colorNumber, pn: gameState.playerNumber })
    }, [gameState])

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


    return (
        <div>
            <Form>
                <Form.Group>
                    <h5 className="text-center"><Badge variant="secondary" >WODTH</Badge></h5>
                    <ButtonGroup className="d-flex" toggle>
                        <Button
                            variant="secondary"
                            onClick={() => setSettings({ ...settings, 'w': Math.max(settings['w'] - 5, 0) })}>
                            -</Button>
                        <Button
                            variant="secondary"
                            disabled={true}>
                            {settings['w']}</Button>
                        <Button
                            variant="secondary"
                            onClick={() => setSettings({ ...settings, 'w': Math.min(settings['w'] + 5, 100) })}>
                            +</Button>
                    </ButtonGroup>
                </Form.Group>
                <Form.Group>
                    <h5 className="text-center"><Badge variant="secondary" >HEIGHT</Badge></h5>
                    <ButtonGroup className="d-flex" toggle>
                        <Button
                            variant="secondary"
                            onClick={() => setSettings({ ...settings, 'h': Math.max(settings['h'] - 5, 0) })}>
                            -</Button>
                        <Button
                            variant="secondary"
                            disabled={true}>
                            {settings['h']}</Button>
                        <Button
                            variant="secondary"
                            onClick={() => setSettings({ ...settings, 'h': Math.min(settings['h'] + 5, 100) })}>
                            +</Button>
                    </ButtonGroup>
                </Form.Group>
                <Form.Group>
                    <h5 className="text-center"><Badge variant="secondary" >COLORS</Badge></h5>
                    <ButtonGroup className="d-flex" toggle>
                        {[3, 4, 5, 6].map(val => {
                            return (
                                <ToggleButton
                                    key={val}
                                    type="radio"
                                    variant="secondary"
                                    value={val}
                                    checked={settings['cn'] === val}
                                    onChange={(e) => handleSettingsChange(e, 'cn')}>
                                    {val}</ToggleButton>
                            )
                        })
                        }
                    </ButtonGroup>
                </Form.Group>
                <Form.Group>
                    <h5 className="text-center"><Badge variant="secondary" >PLAYERS</Badge></h5>
                    <ButtonGroup className="d-flex" toggle>
                        <ToggleButton
                            type="radio"
                            variant="secondary"
                            value={1}
                            checked={settings['pn'] === 1}
                            onChange={(e) => handleSettingsChange(e, 'pn')}>
                            1</ToggleButton>
                        <ToggleButton
                            type="radio"
                            variant="secondary"
                            value={2}
                            checked={settings['pn'] === 2}
                            onChange={(e) => handleSettingsChange(e, 'pn')}>
                            2</ToggleButton>
                    </ButtonGroup>
                </Form.Group>
                <Form.Group>
                    {gameState.w !== settings['w'] ||
                        gameState.h !== settings['h'] ||
                        gameState.playerNumber !== settings['pn'] ||
                        gameState.colorNumber !== settings['cn'] ?
                        <Button
                            variant="outline-primary"
                            block
                            onClick={() => handleSubmit()}>
                            Save Settings</Button> : ''}
                </Form.Group>
            </Form>
        </div>
    )
}

export default Settings