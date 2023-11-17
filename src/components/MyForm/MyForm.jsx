import { useState } from 'react';
import { socket } from '../../socket';

function MyForm(props) {
    const [value, setValue] = useState('');
    const [room, setRoom] = useState("");
  
    function onSubmit(event) {
      event.preventDefault();
        socket.emit("join-room", value);
    }

    socket.on("joined-room", (receivedData) => {
        console.log(`receivedData = ${receivedData}`)
        setRoom(receivedData);
    });

    function leaveRoom() {
        socket.emit("leave-room", room);
    }

    socket.on("left-room", () => {
        setRoom("");
    })
  
    return (
      <div>
          <form onSubmit={ onSubmit }>
            <input onChange={ e => setValue(e.target.value) } />
            <button type="submit">Join room</button>
          </form>
            <p>{room}</p>
            <button onClick={leaveRoom}>leave room</button>
      </div>
    );
}

export default MyForm;