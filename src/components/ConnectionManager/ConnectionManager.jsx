import { socket } from '../../socket';

function ConnectionManager(props) {
    function connect() {
      socket.connect();
    }
  
    function disconnect() {
      socket.disconnect();
    }
  
    return (
      <>
        <button onClick={ connect }>Connect</button>
        <button onClick={ disconnect }>Disconnect</button>
      </>
    );
}

export default ConnectionManager;