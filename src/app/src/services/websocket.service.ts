// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface NotificationMessage {
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private serverUrl = 'http://localhost:8080/ws';
  private isConnected = false;

  constructor() {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(socket);
      
      // Disable debug logging
      this.stompClient.debug = null;
      
      this.stompClient.connect({}, 
        () => {
          console.log('✅ Connected to WebSocket');
          this.isConnected = true;
          resolve();
        }, 
        (error: any) => {
          console.error('❌ WebSocket connection error:', error);
          this.isConnected = false;
          reject(error);
        }
      );
    });
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect(() => {
        console.log('🔌 Disconnected from WebSocket');
        this.isConnected = false;
      });
    }
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (this.stompClient && this.isConnected) {
      return this.stompClient.subscribe(topic, callback);
    } else {
      console.warn('⚠️ WebSocket not connected. Cannot subscribe to topic:', topic);
      return null;
    }
  }

  send(destination: string, body: any) {
    if (this.stompClient && this.isConnected) {
      this.stompClient.send(destination, {}, JSON.stringify(body));
    } else {
      console.warn('⚠️ WebSocket not connected. Cannot send message to:', destination);
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}