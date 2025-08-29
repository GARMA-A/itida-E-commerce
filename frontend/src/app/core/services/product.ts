import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilter } from '../models/product';
import { ApiResponse, PaginationResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  /**
   * Get all products with optional filtering and pagination
   */
  getProducts(filter?: ProductFilter, page: number = 1, limit: number = 10): Observable<PaginationResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filter) {
      if (filter.category) params = params.set('category', filter.category);
      if (filter.brand) params = params.set('brand', filter.brand);
      if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.featured !== undefined) params = params.set('featured', filter.featured.toString());
      if (filter.search) params = params.set('search', filter.search);
    }

    return this.http.get<PaginationResponse<Product>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Search products by query
   */
  searchProducts(query: string, page: number = 1, limit: number = 10): Observable<PaginationResponse<Product>> {
    const params = new HttpParams()
      .set('search', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginationResponse<Product>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string, page: number = 1, limit: number = 10): Observable<PaginationResponse<Product>> {
    const params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginationResponse<Product>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 6): Observable<PaginationResponse<Product>> {
    const params = new HttpParams()
      .set('featured', 'true')
      .set('limit', limit.toString());

    return this.http.get<PaginationResponse<Product>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create product (admin only)
   */
  createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update product (admin only)
   */
  updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete product (admin only)
   */
  deleteProduct(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get product categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get product brands
   */
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Private error handler
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Product Service Error:', error);
    return throwError(() => ({
      message: error.error?.message || 'An error occurred while fetching products',
      status: error.status || 500,
      error: error.error
    }));
  };
}
