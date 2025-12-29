import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private mockApi: MockApiService
  ) {}

  search(query: string, filters: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/search`, { query, filters }).pipe(
      catchError(() => {
        console.log('API not available, using mock data');
        return this.mockApi.search(query, filters);
      })
    );
  }

  getCrawlerStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crawlers`).pipe(
      catchError(() => {
        console.log('API not available, using mock crawler status');
        return this.mockApi.getCrawlerStatus();
      })
    );
  }
}