import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  search(query: string, filters: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/search`, { query, filters });
  }

  getCrawlerStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crawlers`);
  }
}