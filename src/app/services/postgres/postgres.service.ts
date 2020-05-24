import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userService } from '../azureAD/azure-ad.service';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {

  constructor(private _http: HttpClient, private userService: userService) {
  }

  async create(url: string, order): Promise<any> {
    return await this._http.post(url, order, { responseType: 'text' }).toPromise();
  }

  async read(url: string): Promise<any> {

  }

  async readByID(url: string, id: string): Promise<any> {
    return await this._http.get(url + `/storage/${id}`, { responseType: 'json' }).toPromise();
  }

  async getPhone(url: string, id: string): Promise<any> {
    return await this._http.get(url + `/phone/${id}`, { responseType: 'json' }).toPromise();
  }

  async readMany(url: string, id: string): Promise<any> {
    return await this._http.get(url, { responseType: 'json' }).toPromise();
  }

  async update(url: string, id: string): Promise<any> {
    return await this._http.put(url, { orderId: id, newStatus: 'done' }, { responseType: 'json' }).toPromise();
  }

  async delete(url: string, id): Promise<any> {
    return await this._http.delete(url, { params: id, responseType: 'text' }).toPromise();
  }


}
