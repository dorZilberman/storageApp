import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userService } from '../azureAD/azure-ad.service';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {


  constructor(private _http: HttpClient) {
  }

  async create(url: string, order): Promise<any> {
    return await this._http.post(url, order, { responseType: 'text' }).toPromise();
  }

  async getJobByID(url: string, id: string): Promise<any> {
    return await this._http.get(url + `/${id}`, { responseType: 'json' }).toPromise();
  }

  async readByID(url: string, id: string): Promise<any> {
    return await this._http.get(url + `/storage/${id}`, { responseType: 'json' }).toPromise();
  }

  async getPhone(url: string, id: string): Promise<any> {
    return await this._http.get(url + `/phone/${id}`, { responseType: 'json' }).toPromise();
  }

  async readMany(url: string): Promise<any> {
    return await this._http.get(url, { responseType: 'json' }).toPromise();
  }

  async update(url: string, orderID: string, id: string): Promise<any> {
    return await this._http.put(url + `/${id}`, { orderId: orderID, newStatus: 'done' }, { responseType: 'json' }).toPromise();
  }

  async delete(url: string, orderID): Promise<any> {
    return await this._http.delete(url, { params: orderID, responseType: 'text' }).toPromise();
  }


}
