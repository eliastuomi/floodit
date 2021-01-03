import { useState } from "react";
import { Table, Button } from 'react-bootstrap';


const Chat = (props) => {

    const [message, setMessage] = useState('')

    return (
        <div>
            <h3>Chat</h3>
            <Table>
                <tbody>

                    {props.chatLog.map(m => {
                        return (
                            <tr key={m.id}>
                                <td>
                                    {m.sender} sanoi:
                                </td>
                                <td>
                                    {m.message}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <input placeholder={'say something'} value={message} onChange={(event) => { setMessage(event.target.value) }}></input>
            <Button
                variant="primary"
                onClick={() => {
                    props.handleSendChat(message)
                    setMessage('')
                }}>Send</Button>
        </div>
    )
}

export default Chat