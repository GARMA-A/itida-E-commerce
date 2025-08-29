import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order';
import { ApiResponse, PaginationResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Create new order
   */
  createOrder(orderData: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get user's orders
   */
  getUserOrders(page: number = 1, limit: number = 10): Observable<PaginationResponse<Order>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginationResponse<Order>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update order status (admin only)
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/status`, { status })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/cancel`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all orders (admin only)
   */
  getAllOrders(page: number = 1, limit: number = 10, status?: Order['status']): Observable<PaginationResponse<Order>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginationResponse<Order>>(`${this.apiUrl}/admin/all`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Private error handler
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Order Service Error:', error);
    return throwError(() => ({
      message: error.error?.message || 'An error occurred with order processing',
      status: error.status || 500,
      error: error.error
    }));
  };
}