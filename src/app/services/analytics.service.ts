import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl;
  private socket: Socket | null = null;
  private realTimeAnalytics = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private mockApi: MockApiService
  ) {
    // Only initialize socket in development or when backend is available
    if (!environment.production) {
      try {
        this.socket = io(environment.socketUrl);
      } catch (error) {
        console.log('Socket connection failed, continuing without real-time updates');
      }
    }
  }

  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`).pipe(
      catchError(() => {
        console.log('API not available, using mock analytics');
        return this.mockApi.getAnalytics();
      })
    );
  }

  getRealTimeAnalytics(): Observable<any> {
    return this.realTimeAnalytics.asObservable();
  }

  initializeRealTimeUpdates() {
    if (this.socket) {
      this.socket.on('searchAnalytics', (data: any) => {
        this.realTimeAnalytics.next(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}