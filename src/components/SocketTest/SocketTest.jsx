import { useState, useEffect } from 'react';
import { socket } from '../../socket';
import ConnectionManager from '../ConnectionManager/ConnectionManager';
import MyForm from '../MyForm/MyForm';

function SocketTest() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      <p>State: { '' + isConnected }</p>
      <ConnectionManager />
      <MyForm />
    </div>
  );
}

export default SocketTest;