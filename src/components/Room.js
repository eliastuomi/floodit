import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'

import roomService from '../services/room'
import Join from './Join'
import Settings from './Settings'
import Game from './Game.js'
import { setGameVisible, setGameState } from '../reducers/mainReducer'
import socketIOClient from "socket.io-client"
const SOCKET_SERVER_URL = "http://localhost:3001"

//KORJAA: HOSTILLA EI PÄIVITY CURRENTROOM, KUN JOKU LIITTYY HUONEESEEN
//KORJAA: KUN JOKU LIITTYY HUONEESEEN, 'SHOW ROOMS' KOHDASSA EI PÄIVITY MYÖSKÄÄN
// --> YLIPÄÄTÄÄN KUN JOKU LIITTYY HUONEESEEN, PITÄÄ TÄMÄN KORVATA KAIKKIEN HUONEET

const Room = (props) => {
    const dispatch = useDispatch()


    const [userName, setUserName] = useState('')
    const [chat, setChat] = useState('')

    const [currentRoom, setCurrentRoom] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [showRooms, setShowRooms] = useState(false)
    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL)

        roomId && isHost() && socketRef.current.emit('create', roomId)
        roomId && !isHost() && socketRef.current.emit('join', { roomId: roomId, roomObject: currentRoom })

        roomId && socketRef.current.on('update_game', (data) => {
            dispatch(setGameState(data))
            dispatch(setGameVisible(true))
        })


        roomId && socketRef.current.on('update_room', (data) => {
            setCurrentRoom(data)
        })

        return () => {
            roomId && isHost() && handleLeaveHost()
            socketRef.current.disconnect()
        }
    }, [roomId])

    const handleCreate = async () => {
        const createdRoom = await roomService.create({
            userName: userName
        })
        setCurrentRoom(createdRoom)
        setRoomId(createdRoom.id)
        socketRef.current.emit('update_showrooms_toserver', createdRoom)
    }

    //OK, TOSIN EI POTKI MUITA POIS HUONEESTA... USEEFFECT RETURN?
    const handleLeaveHost = async () => {
        const deletedRoom = await roomService.remove(currentRoom.id)
        setCurrentRoom(null)
        setRoomId(null)
    }


    const handleLeave = async () => {
        const roomObject = {
            roomName: currentRoom.roomName,
            host: currentRoom.host,
            users: currentRoom.users.filter(u => u !== userName),
            chatLog: currentRoom.chatLog
        }
        const updatedRoom = await roomService.join(currentRoom.id, roomObject)
        socketRef.current.emit('update_room', { roomId: updatedRoom.id, roomObject: updatedRoom })
        setCurrentRoom(null)
        setRoomId(null)
    }

    const handleSendChat = async () => {
        const roomObject = {
            roomName: currentRoom.roomName,
            host: currentRoom.host,
            users: currentRoom.users,
            chatLog: [...currentRoom.chatLog, [userName, chat]]
        }
        const updatedRoom = await roomService.join(currentRoom.id, roomObject)
        socketRef.current.emit('update_room', { roomId: updatedRoom.id, roomObject: updatedRoom })
    }

    const isHost = () => {
        if (currentRoom && currentRoom.host === userName) return true
        return false
    }

    const handleJoinRoom = async (roomObject) => {
        const joinedRoom = await roomService.join(roomObject.id, roomObject)
        setCurrentRoom(joinedRoom)
        setRoomId(joinedRoom.id)
    }

    const handleUpdate = (gameState) => {
        socketRef.current.emit('update_game', { roomId: roomId, gameState: gameState })
    }

    return (
        <div>
            { !currentRoom ?
                <div>
                    {!showRooms ?
                        <div>
                            <input placeholder={'set username'} value={userName} onChange={(event) => setUserName(event.target.value)}></input>
                            <button onClick={handleCreate}>Create room</button>
                            <button onClick={() => setShowRooms(!showRooms)}>Show rooms</button>
                        </div> :
                        <div>
                            <Join handleJoinRoom={handleJoinRoom} userName={userName} />
                            <button onClick={() => setShowRooms(!showRooms)}>Hide rooms</button>
                        </div>
                    }
                </div> :
                <div>
                    {isHost() ?
                        <div>
                            you are host in {currentRoom.roomName}
                            <button onClick={handleLeaveHost}>Leave room</button>
                            <div>
                                <Settings />
                            </div>
                        </div> :
                        <div>
                            you are in {currentRoom.roomName}
                            <button onClick={() => handleLeave()}>Leave</button>
                        </div>}
                    <div>
                        <ul>
                            <li>Chatti</li>
                            {currentRoom.chatLog.map(m => {
                                return (
                                    <li key={m[0] + m[1]}>{m[0]} sanoi: {m[1]}</li>
                                )
                            })}
                        </ul>
                        <input placeholder={'say something'} value={chat} onChange={(event) => setChat(event.target.value)}></input>
                        <button onClick={handleSendChat}>Send</button>
                    </div>
                    <div>
                        {
                            true ?
                                <div>
                                    <Game me={userName} players={currentRoom.users} handleUpdate={handleUpdate}>
                                    </Game>
                                </div> : ''
                        }
                    </div>

                </div>
            }

        </div>
    )
}

export default Room