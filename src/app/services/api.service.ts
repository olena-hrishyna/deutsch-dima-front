import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  static prepareParams(params: any): HttpParams | null {
    return params ? new HttpParams({ fromObject: params }) : null;
  }

  static prepareHeaders(headers: any): HttpHeaders | null {
    return headers ? new HttpHeaders(headers) : null;
  }

  static prepareOptions(
    paramsObj?: any,
    headersObj?: any
  ): { params?: HttpParams; headers?: HttpHeaders } {
    const params = ApiService.prepareParams(paramsObj);
    const headers = ApiService.prepareHeaders(headersObj);

    return {
      ...(params && { params }),
      ...(headers && { headers }),
    };
  }

  static getEndpoint(url: string): string {
    return `${environment.api}${url}`;
  }

  postRequest2(url: string, body: any, init?: any): Observable<any> {
    return this.http.request(
      new HttpRequest('POST', ApiService.getEndpoint(url), body, init)
    );
  }

  postRequest(
    url: string,
    body?: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.post(
      ApiService.getEndpoint(url),
      body,
      ApiService.prepareOptions(params, headers)
    );
  }

  patchRequest(
    url: string,
    body?: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.patch(
      ApiService.getEndpoint(url),
      body,
      ApiService.prepareOptions(params, headers)
    );
  }

  getRequest(url: string, params?: any, headers?: any): Observable<any> {
    return this.http.get(
      ApiService.getEndpoint(url),
      ApiService.prepareOptions(params, headers)
    );
  }

  putRequest(
    url: string,
    body: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.put(
      ApiService.getEndpoint(url),
      body,
      ApiService.prepareOptions(params, headers)
    );
  }

  deleteRequest(url: string): Observable<any> {
    return this.http.delete(ApiService.getEndpoint(url));
  }
}
