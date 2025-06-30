import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notificationService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() username: string = ''; 

  @ViewChild('notificationDropdown') notificationDropdown!: ElementRef;
  
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isNotificationDropdownOpen = false;
  isLoadingNotifications = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private notificationService: NotificationService
  ) {}

  // ngOnInit(): void {
  //   // Subscribe to notifications and unread count
  //   this.subscriptions.add(
  //     this.notificationService.notifications$.subscribe(notifications => {
  //       this.notifications = notifications;
  //     })
  //   );

  //   this.subscriptions.add(
  //     this.notificationService.unreadCount$.subscribe(count => {
  //       this.unreadCount = count;
  //     })
  //   );

  //   // Load initial notifications
  //   this.loadNotifications();
  // }

  ngOnInit(): void {
  this.notificationService.connectWebSocket(); // connect WebSocket

    this.notificationService.notifications$.subscribe((notifications) => {
      notifications.forEach(notification => {
        this.notifications.unshift(notification);
        this.unreadCount++;
      });
    });
  this.loadNotifications(); // initial HTTP load
}


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // Clean up event listener if still attached
    document.removeEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
  }

  // Toggle notification dropdown
  toggleNotificationDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    
    if (this.isNotificationDropdownOpen) {
      this.loadNotifications();
      // Close dropdown when clicking outside
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
      }, 0);
    } else {
      document.removeEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
    }
  }

  // Close dropdown when clicking outside
  private closeDropdownOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.notificationDropdown && !this.notificationDropdown.nativeElement.contains(target)) {
      this.isNotificationDropdownOpen = false;
      document.removeEventListener('click', this.closeDropdownOnOutsideClick.bind(this));
    }
  }

  closeNotificationDropdown() {
  this.isNotificationDropdownOpen = false;
}


  // Load notifications from backend
  loadNotifications(): void {
    if (this.isLoadingNotifications) return;
    
    this.isLoadingNotifications = true;
    this.notificationService.loadNotifications();
    
    // ✅ IMPROVED: Remove the artificial delay in production
    setTimeout(() => {
      this.isLoadingNotifications = false;
    }, 500);
  }

  // Mark notification as read
  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    
    if (!notification.isRead && notification.id) { // ✅ ADDED: Check if id exists
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.loadNotifications(); // Refresh the list
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  // Mark all notifications as read
  markAllAsRead(event: Event): void {
    event.stopPropagation();
    
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications(); // Refresh the list
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  // Delete notification
  deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation();
    
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.loadNotifications(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  // Get notification icon based on type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'error': return 'bi-x-circle-fill text-danger';
      default: return 'bi-info-circle-fill text-info';
    }
  }

  // Format timestamp
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  // TrackBy function for ngFor optimization
  trackNotification(index: number, notification: Notification): number {
    return notification.id || index; // ✅ IMPROVED: Fallback to index if id is undefined
  }

  logout(event?: Event): void { // ✅ ADDED: Return type
    if (event) event.preventDefault();
    localStorage.removeItem('loggedIn');
    localStorage.clear(); // clears everything
    this.router.navigate(['/login']);
  }
}