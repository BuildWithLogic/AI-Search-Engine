import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3001/api';
  private socket: Socket;
  private realTimeAnalytics = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3001');
  }

  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`);
  }

  getRealTimeAnalytics(): Observable<any> {
    return this.realTimeAnalytics.asObservable();
  }

  initializeRealTimeUpdates() {
    this.socket.on('searchAnalytics', (data) => {
      this.realTimeAnalytics.next(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}