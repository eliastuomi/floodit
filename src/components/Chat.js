import { useState } from "react";
import { Toast, Button, InputGroup, Form, Badge } from 'react-bootstrap';


const Chat = (props) => {

    const [message, setMessage] = useState('')

    return (
        <div>
            <h4 className="text-center"><Badge variant="primary" >CHAT</Badge></h4>
            {props.chatLog.map(m => {
                return (
                    <Toast key={m.id}>
                        <Toast.Header closeButton={false}>
                            <strong className={m.sender === props.me ? 'ml-auto' : 'mr-auto'}>{m.sender}</strong>
                        </Toast.Header>
                        <Toast.Body><div className={m.sender === props.me ? 'text-right' : 'text-left'}>{m.message}</div></Toast.Body>
                    </Toast>
                )
            })}
            <InputGroup className="mb-3">
                <Form.Control
                    aria-describedby="basic-addon1"
                    placeholder={'say something'}
                    value={message}
                    onChange={(event) => { setMessage(event.target.value) }} />
                <InputGroup.Append>
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            props.handleSendChat(message)
                            setMessage('')
                        }}>Send</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>

    )
}

export default Chat