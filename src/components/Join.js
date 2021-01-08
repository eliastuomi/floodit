import { useEffect, useRef, useState } from "react";
import roomService from '../services/room'
import socketIOClient from "socket.io-client"
import { Button, Table } from 'react-bootstrap';



const SOCKET_SERVER_URL = "http://localhost:3001"


const Join = (props) => {
    const [availableRooms, setAvailableRooms] = useState([])
    const socketRef = useRef()


    useEffect(() => {
        roomService
            .getAll()
            .then(response => {
                setAvailableRooms(response.data.filter(r => r.users.length < r.playerNumber))
            })
            .catch(error => {
                console.log('fail')
            })

        // socketRef.current = socketIOClient(SOCKET_SERVER_URL)
        socketRef.current = socketIOClient()


        socketRef.current.on('new_availableroom', (room) => {
            setAvailableRooms(availableRooms => [...availableRooms, room].filter(r => r.users.length < r.playerNumber))
        })

        socketRef.current.on('updated_availableroom', (room) => {
            setAvailableRooms(availableRooms => availableRooms.map(r => r.id === room.id ? room : r).filter(r => r.users.length < r.playerNumber))
        })

        socketRef.current.on('remove_availableroom', (id) => {
            setAvailableRooms(availableRooms => availableRooms.filter(r => r.id !== id))
        })

        return () => socketRef.current.disconnect()

    }, [])

    return (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Host</th>
                    <th>W</th>
                    <th>H</th>
                    <th>colors</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {availableRooms.map(room => {
                    return (
                        <tr key={room.id}>
                            <td>{room.host}</td>
                            <td>{room.w}</td>
                            <td>{room.h}</td>
                            <td>{room.colorNumber}</td>
                            <td><Button
                                variant="primary"
                                onClick={() => props.handleJoinRoom({ ...room, users: room.users.concat(props.nickName) })}>
                                Join</Button></td>
                        </tr>
                    )
                }
                )}
            </tbody>
        </Table>
    )
}

export default Join