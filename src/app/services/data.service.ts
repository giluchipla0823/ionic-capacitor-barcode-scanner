/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  headers: any = {
    'X-CustomHttpHeader': 'CUSTOM_VALUE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  };

  constructor(
    private http: HttpClient
  ) { }

  getCompounds(): Observable<any> {
    return this.http.post(`${BASE_URL}/compounds`, {}, this.headers);
  }

  getData() {
    return this.http.get('https://api.glcp-demos.es/api/test');
  }
}
