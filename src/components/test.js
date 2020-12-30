import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001";


const Test = (props) => {
    const [list, setList] = useState(['yksi', 'kaksi'])
    const [input, setInput] = useState('kolme')
    const roomId = 1000
    const socketRef = useRef()


    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL)

        socketRef.current.on('data_from_server', (data) => {
            console.log(data)
            setList(list => [...list, data])
        })


        return () => socketRef.current.disconnect()
        
    }, [])

    const sendData = (data) => {
        socketRef.current.emit('data_to_server', data)
        //setList(list => [...list, input])
    }


    const handleClick = () => {
        sendData(input)
    }


    return (
        <div>
            <input value={input} onChange={(event) => setInput(event.target.value)}></input>
            <button onClick={handleClick}>tästä</button>
            {list.map(a => <p key={a}>{a}</p>)}

        </div>
    )
}

export default Test