import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {

  constructor(private _http: HttpClient) {
  }

  async create(url: string, order): Promise<any> {
    return await this._http.post(url, order, { responseType: 'text' }).toPromise();
  }

  async read(url: string): Promise<any> {

  }

  async readMany(url: string): Promise<any> {
    return await this._http.get(url, { responseType: 'json' }).toPromise();
  }

  async update(url: string, id: string): Promise<any> {
    return await this._http.put(url, { orderId: id, newStatus: 'done' }, { responseType: 'json' }).toPromise();
  }

  async delete(url: string, id): Promise<any> {
    return await this._http.delete(url,{params:id , responseType:'text'}).toPromise();
  }


}
