import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCountSubject = new BehaviorSubject<number>(0);
  
  public loading$ = this.loadingSubject.asObservable();
  public loadingCount$ = this.loadingCountSubject.asObservable();

  /**
   * Show loading indicator
   */
  show(): void {
    const currentCount = this.loadingCountSubject.value + 1;
    this.loadingCountSubject.next(currentCount);
    this.loadingSubject.next(true);
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    const currentCount = Math.max(0, this.loadingCountSubject.value - 1);
    this.loadingCountSubject.next(currentCount);
    
    if (currentCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Check if loading
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Force hide all loading states
   */
  hideAll(): void {
    this.loadingCountSubject.next(0);
    this.loadingSubject.next(false);
  }

  /**
   * Get loading state as observable
   */
  getLoadingState(): Observable<boolean> {
    return this.loading$;
  }
}
