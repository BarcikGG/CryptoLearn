import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_SOCKET_URL } from '../utils/config';

export const SocketContext = createContext<Socket<any, any> | null>(null);

export const useSocket = (): Socket<any, any> | null => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<any, any> | null>(null);

  useEffect(() => {
    const newSocket = io(BASE_SOCKET_URL, {
      reconnectionAttempts: Infinity,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
