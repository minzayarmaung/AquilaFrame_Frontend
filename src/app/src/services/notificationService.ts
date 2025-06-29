import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../environments/environment';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: Date;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiBaseUrl + '/ws';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private stompClient: Client | null = null;

  constructor(private http: HttpClient, private zone: NgZone) {
    this.connectWebSocket();
  }

  // WebSocket Connection Setup
  connectWebSocket(): void {
    try {
      this.stompClient = new Client({
        brokerURL: undefined, // We'll use webSocketFactory instead
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {},
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log('Connected to WebSocket', frame);
          this.subscribeToNotifications();
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
        }
      });

      this.stompClient.activate();
    } catch (error) {
      console.error('Error setting up WebSocket connection:', error);
    }
  }

  private subscribeToNotifications(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe('/topic/notifications', (message) => {
        if (message.body) {
          try {
            const newNotification: Notification = JSON.parse(message.body);
            newNotification.timestamp = new Date(newNotification.timestamp);

            this.zone.run(() => {
              this.pushNotification(newNotification);
            });
          } catch (error) {
            console.error('Error parsing notification message:', error);
          }
        }
      });
    }
  }

  // Push new notification into the stream
  private pushNotification(notification: Notification): void {
    const current = this.notificationsSubject.getValue();
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
  }

  // Load from REST API
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications) => {
        const processedNotifications = notifications.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        
        this.notificationsSubject.next(processedNotifications);
        const unreadCount = processedNotifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/mark-all-read`, {});
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.connectWebSocket();
    }, 1000);
  }
}