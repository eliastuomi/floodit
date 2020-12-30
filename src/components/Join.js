import { useEffect, useRef, useState } from "react";
import roomService from '../services/room'
import socketIOClient from "socket.io-client"
const SOCKET_SERVER_URL = "http://localhost:3001"


const Join = (props) => {

    const [roomsAvailable, setRoomsAvailable] = useState([])
    const socketRef = useRef()


    useEffect(() => {
        roomService
            .getAll()
            .then(response => {
                setRoomsAvailable(response.data)
            })
            .catch(error => {
                console.log('fail')
            })

        socketRef.current = socketIOClient(SOCKET_SERVER_URL)

        socketRef.current.on('update_showrooms_fromserver', (room) => {
            console.log('CLIENT SAI PÄIVITYKSEN UUDESTA HUONEESTA', room)
            setRoomsAvailable(roomsAvailable => [...roomsAvailable, room])
        })

        socketRef.current.on('update_showrooms', (room) => {
            setRoomsAvailable(roomsAvailable => roomsAvailable.map(r => r.id === room.id ? room : r))
        })

        return () => socketRef.current.disconnect()

    }, [])

    return (
        <div>
            <ul>
                {roomsAvailable.map(room => {
                    return (
                        <li key={room.id}>{room.roomName} --- {room.host} --- {room.users}
                            <button onClick={() => props.handleJoinRoom({ ...room, users: room.users.concat(props.userName) })}>Join</button></li>

                    )
                }
                )}
            </ul>
        </div>
    )
}

export default Join