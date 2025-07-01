// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
}