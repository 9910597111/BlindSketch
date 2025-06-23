import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Determine server URL based on environment
    let serverUrl: string;
    
    if (import.meta.env.VITE_SERVER_URL) {
      // Use custom server URL from environment
      serverUrl = import.meta.env.VITE_SERVER_URL;
    } else if (window.location.hostname === 'localhost') {
      // Local development
      serverUrl = 'http://localhost:3001';
    } else {
      // Production - you need to set this to your Render backend URL
      serverUrl = 'https://your-render-app-name.onrender.com';
    }
    
    console.log('Connecting to server:', serverUrl);
    
    try {
      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        withCredentials: true
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server:', serverUrl);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
        console.error('Failed to connect to:', serverUrl);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};