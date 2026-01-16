import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, body, options);
  }

  put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, body, options);
  }

  patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}${endpoint}`, body, options);
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`, options);
  }
}
