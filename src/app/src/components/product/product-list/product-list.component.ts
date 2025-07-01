// product-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

export interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
}

export interface NotificationMessage {
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private stompClient: any;
  private serverUrl = 'http://localhost:8080/ws';
  private apiUrl = 'http://localhost:8080/api/products';
  
  showNotification = false;
  notificationMessage = '';
  fadeOut = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initializeWebSocket();
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
  }

  private initializeWebSocket() {
    const socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        const notification: NotificationMessage = JSON.parse(message.body);
        this.showNotificationToast(notification.message);
        // Reload products when notification received
        this.loadProducts();
      });
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
      // Continue with sample data if WebSocket fails
    });
  }

  private showNotificationToast(message: string) {
    this.notificationMessage = message;
    this.showNotification = true;
    this.fadeOut = false;

    setTimeout(() => {
      this.fadeOut = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 300);
    }, 3000);
  }

  private loadProducts() {
    this.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products from backend:', error);
        // Fallback to sample data if backend is not available
        this.loadSampleProducts();
      }
    });
  }

  private loadSampleProducts() {
    this.products = [
      {
        id: 1,
        name: 'MacBook Pro M3',
        category: 'Laptops',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
        description: 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for professional work and creative tasks.',
        inStock: true,
        rating: 4.8
      },
      {
        id: 2,
        name: 'iPhone 15 Pro',
        category: 'Smartphones',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        description: 'Pro camera system with 48MP main lens, A17 chip, titanium design with premium build quality.',
        inStock: true,
        rating: 4.7
      },
      {
        id: 3,
        name: 'Dell XPS 13',
        category: 'Laptops',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        description: 'Ultra-thin laptop with Intel Core i7, 16GB RAM. Compact design with powerful performance.',
        inStock: false,
        rating: 4.5
      },
      {
        id: 4,
        name: 'iPad Pro 12.9"',
        category: 'Tablets',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        description: 'M2 chip, Liquid Retina display, Apple Pencil support. Perfect for digital artists and professionals.',
        inStock: true,
        rating: 4.6
      },
      {
        id: 5,
        name: 'Samsung Galaxy S24',
        category: 'Smartphones',
        price: 899,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        description: 'Latest Android flagship with AI features, advanced camera system, and premium display.',
        inStock: true,
        rating: 4.4
      },
      {
        id: 6,
        name: 'Sony WH-1000XM5',
        category: 'Audio',
        price: 399,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
        description: 'Premium noise-canceling headphones with exceptional sound quality and comfort.',
        inStock: true,
        rating: 4.9
      }
    ];
  }

  // API Methods
  private getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  private addProductToBackend(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }

  private updateProductInBackend(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  private deleteProductFromBackend(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Component Methods
  addNewProduct() {
    const techProducts = [
      'MacBook Air M3', 'Gaming Laptop ROG', 'Surface Pro 10', 'ThinkPad X1',
      'iPhone 16', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14',
      'iPad Mini', 'Galaxy Tab S9', 'Surface Tablet', 'Kindle Oasis',
      'AirPods Pro 3', 'Galaxy Buds Pro', 'Bose QuietComfort', 'Beats Studio'
    ];
    
    const categories = ['Laptops', 'Smartphones', 'Tablets', 'Audio', 'Accessories'];
    const randomProduct = techProducts[Math.floor(Math.random() * techProducts.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const newProduct: Product = {
      name: randomProduct,
      category: randomCategory,
      price: Math.floor(Math.random() * 2000) + 299,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      description: `Latest ${randomProduct} with advanced features, cutting-edge technology, and premium build quality. Perfect for professionals and enthusiasts.`,
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      rating: 4.0 + Math.random() * 1 // Rating between 4.0 and 5.0
    };

    // Try to add to backend first
    this.addProductToBackend(newProduct).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        // The WebSocket will handle the notification and reload
      },
      error: (error) => {
        console.error('Error adding product to backend:', error);
        // Fallback: add locally and show notification
        const localProduct = { ...newProduct, id: Date.now() };
        this.products.push(localProduct);
        this.showNotificationToast(`Admin has added ${newProduct.name} product`);
      }
    });
  }

  editProduct(product: Product) {
    // For demo purposes, just update the name and price
    const updatedProduct: Product = {
      ...product,
      name: product.name + ' (Updated)',
      price: product.price + Math.floor(Math.random() * 200) - 100 // ±100 price change
    };

    if (product.id) {
      this.updateProductInBackend(product.id, updatedProduct).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          // The WebSocket will handle the notification and reload
        },
        error: (error) => {
          console.error('Error updating product:', error);
          // Fallback: update locally
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.showNotificationToast(`Admin has updated ${updatedProduct.name} product`);
          }
        }
      });
    }
  }

  deleteProduct(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.deleteProductFromBackend(productId).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        // The WebSocket will handle the notification and reload
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        // Fallback: delete locally
        this.products = this.products.filter(p => p.id !== productId);
        this.showNotificationToast(`Admin has deleted ${product.name} product`);
      }
    });
  }

  // Utility Methods
  getInStockCount(): number {
    return this.products.filter(p => p.inStock).length;
  }

  getOutOfStockCount(): number {
    return this.products.filter(p => !p.inStock).length;
  }

  getTotalValue(): string {
    const total = this.products.reduce((sum, product) => sum + product.price, 0);
    return new Intl.NumberFormat('en-US').format(total);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  trackByProduct(index: number, product: Product): number {
    return product.id || index;
  }
}