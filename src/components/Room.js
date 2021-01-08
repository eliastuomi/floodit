import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

import roomService from '../services/room'
import Join from './Join'
import Settings from './Settings'
import Game from './Game.js'
import Chat from './Chat.js'

import { setGameVisible, setGameState, setCurrentRoom, setRoomId, setShowRooms, setGameover } from '../reducers/mainReducer'
import socketIOClient from "socket.io-client"

import { Button, Form, Col, Row, Badge } from 'react-bootstrap';

const SOCKET_SERVER_URL = "http://localhost:3001"


const Room = (props) => {
    const dispatch = useDispatch()
    const currentRoom = useSelector(state => state.currentRoom)
    const roomId = useSelector(state => state.roomId)
    const showRooms = useSelector(state => state.showRooms)
    const gameState = useSelector(state => state.gameState)

    const [nickName, setNickName] = useState('')
    const [chatLog, setChatLog] = useState([])

    const socketRef = useRef()


    useEffect(() => {

        // socketRef.current = socketIOClient(SOCKET_SERVER_URL)
        socketRef.current = socketIOClient()

        roomId && isHost() && socketRef.current.emit('create', roomId)
        roomId && !isHost() && socketRef.current.emit('join', { roomId: roomId, roomObject: currentRoom })

        roomId && !isHost() && socketRef.current.on('leave_host', (data) => {
            dispatch(setCurrentRoom(null))
            dispatch(setRoomId(null))
            dispatch(setGameover(true))
            dispatch(setGameVisible(false))
            dispatch(setShowRooms(false))
            alert('host left')
        })

        roomId && isHost() && socketRef.current.on('leave_room', (data) => {
            dispatch(setGameover(true))
            dispatch(setGameVisible(false))
            dispatch(setCurrentRoom(data))
            alert('player left')
        })

        // roomId && socketRef.current.on('page_refresh', () => {
        //     alert('opponent left')
        //     window.location.reload(false);
        // })

        roomId && socketRef.current.on('update_game', (data) => {
            dispatch(setGameState(data))
        })

        roomId && socketRef.current.on('game_over', (data) => {
            dispatch(setGameover(true))
            alert(data)
        })

        roomId && socketRef.current.on('send_message', (data) => {
            setChatLog(chatLog => [...chatLog, data])
        })

        roomId && socketRef.current.on('start_game', (data) => {
            dispatch(setGameState(data))
            dispatch(setGameVisible(true))
            dispatch(setGameover(false))
        })


        roomId && socketRef.current.on('update_room', (data) => {
            dispatch(setCurrentRoom(data))
        })

        roomId && window.addEventListener('beforeunload', () => pageRefresh())


        return () => {
            roomId && window.removeEventListener('beforeunload', () => pageRefresh(roomId))
            socketRef.current.disconnect()

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId])

    const pageRefresh = (id) => {

        isHost() && handleLeaveHost()
        !isHost() && handleLeave()

    }

    const handleCreate = async () => {
        const createdRoom = await roomService.create({
            nickName: nickName,
            w: gameState.w,
            h: gameState.h,
            colorNumber: gameState.colorNumber,
            playerNumber: gameState.playerNumber
        })
        dispatch(setCurrentRoom(createdRoom))
        dispatch(setRoomId(createdRoom.id))
        socketRef.current.emit('new_availableroom', createdRoom)
    }

    const handleLeaveHost = async () => {
        const deletedRoom = await roomService.remove(currentRoom.id)
        dispatch(setCurrentRoom(null))
        dispatch(setRoomId(null))
        dispatch(setGameover(true))
        dispatch(setGameVisible(false))
        socketRef.current.emit('leave_host', { roomId: deletedRoom.id })
    }


    const handleLeave = async () => {
        const roomObject = {
            ...currentRoom,
            users: currentRoom.users.filter(u => u !== nickName)
        }
        const updatedRoom = await roomService.join(currentRoom.id, roomObject)
        socketRef.current.emit('leave_room', { roomId: updatedRoom.id, roomObject: updatedRoom })
        socketRef.current.emit('new_availableroom', updatedRoom)
        dispatch(setCurrentRoom(null))
        dispatch(setRoomId(null))
        dispatch(setGameover(true))
        dispatch(setGameVisible(false))
    }

    const handleJoinRoom = async (roomObject) => {
        const joinedRoom = await roomService.join(roomObject.id, roomObject)
        dispatch(setCurrentRoom(joinedRoom))
        dispatch(setRoomId(joinedRoom.id))
    }

    const handleSendChat = (message) => {
        const chatObject = {
            sender: nickName,
            message: message,
            id: chatLog.length + 1
        }
        //dispatch(setChatLog([...chatLog, chatObject]))
        socketRef.current.emit('send_message', { roomId: roomId, chatObject: chatObject })

    }

    const isHost = () => {
        if (currentRoom && currentRoom.host === nickName) return true
        return false
    }

    const handleUpdate = (gameState) => {
        socketRef.current.emit('update_game', { roomId: roomId, gameState: gameState })
    }

    const handleGameOver = (text) => {
        socketRef.current.emit('game_over', { roomId: roomId, text: text })
    }

    const handleShowRooms = () => {
        dispatch(setShowRooms(!showRooms))
    }

    const handleStartGame = (gameState) => {
        socketRef.current.emit('start_game', { roomId: roomId, gameState: gameState })
    }

    const showRoomComponent = () => (
        <div>
            <Join handleJoinRoom={handleJoinRoom} nickName={nickName} />
            <Button
                variant="outline-primary"
                block
                onClick={handleShowRooms}>
                Hide rooms</Button>
        </div>
    )

    const createRoomComponent = () => (
        <Form>
            <Form.Group>
                <Form.Control value={nickName}
                    placeholder={'set username'}
                    onChange={(event) => setNickName(event.target.value.length > 10 ? nickName : event.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                {nickName !== '' ? <Button
                    variant="outline-primary"
                    block
                    onClick={handleCreate}>
                    Create room</Button> : ''}
            </Form.Group>
            <Form.Group>
                {nickName !== '' ? <Button
                    variant="outline-primary"
                    block
                    onClick={handleShowRooms}>
                    Show rooms</Button> : ''}
            </Form.Group>
        </Form>
    )



    return (
        <>
            { !currentRoom ?
                <Row>
                    <Col md={{ span: 4, offset: 4 }}>
                        {!showRooms ?
                            <>
                                {createRoomComponent()}
                                <Settings />

                            </>
                            :
                            <>
                                {showRoomComponent()}
                            </>
                        }
                    </Col>
                </Row> :


                <div>
                    {/* <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            <div className="text-center"><Badge variant="danger">HOST: {currentRoom.users[0].toUpperCase()}</Badge></div>
                        </Col>
                    </Row>
                    <br></br> */}
                    <div>
                        {
                            currentRoom.users.length === currentRoom.playerNumber ?
                                <div>
                                    <Game me={nickName} handleUpdate={handleUpdate} handleStart={handleStartGame} isHost={isHost()} gameOver={handleGameOver}>
                                    </Game>
                                </div> : ''
                        }
                    </div>
                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            <Chat handleSendChat={handleSendChat} me={nickName} chatLog={chatLog} />
                            {isHost() ?
                                <div>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        block
                                        onClick={() => handleLeaveHost()}>
                                        Leave room</Button>
                                        <br></br>

                                </div> :
                                <div>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        block
                                        onClick={() => handleLeave()}>
                                        Leave</Button>
                                        <br></br>
                                </div>

                            }
                        </Col>
                    </Row>
                </div>
            }

        </>
    )
}

export default Room