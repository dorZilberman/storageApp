import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userService } from '../azureAD/azure-ad.service';

@Injectable({
  providedIn: 'root'
})
export class PostgresService {

  private userID;

  constructor(private _http: HttpClient, private userService: userService) {
  }

  async create(url: string, order): Promise<any> {
    return await this._http.post(url, order, { responseType: 'text' }).toPromise();
  }

  async getJobByID(url: string): Promise<any> {
    this.userID = this.userService.getUserID();
    return await this._http.get(url + `/${this.userID}`, { responseType: 'json' }).toPromise();
  }

  async readByID(url: string): Promise<any> {
    return await this._http.get(url + `/storage/${this.userID}`, { responseType: 'json' }).toPromise();
  }

  async getPhone(url: string): Promise<any> {
    return await this._http.get(url + `/phone/${this.userID}`, { responseType: 'json' }).toPromise();
  }

  async readMany(url: string): Promise<any> {
    return await this._http.get(url, { responseType: 'json' }).toPromise();
  }

  async update(url: string, orderID: string): Promise<any> {
    return await this._http.put(url + `/${this.userID}`, { orderId: orderID, newStatus: 'done' }, { responseType: 'json' }).toPromise();
  }

  async delete(url: string, orderID): Promise<any> {
    return await this._http.delete(url, { params: orderID, responseType: 'text' }).toPromise();
  }


}
