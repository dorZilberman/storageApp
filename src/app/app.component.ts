import { Component } from '@angular/core';
import { PostgresService } from './services/postgres/postgres.service';
import { ContextService } from './services/context/context.service';
import { userService } from './services/azureAD/azure-ad.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppStateService } from './services/appState/app-state.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'storageApp';
  orders;
  private startRefreshEvent: CustomEvent;
  private endRefreshEvent: CustomEvent;
  constructor(private _router: Router, private userService: userService, private _postgres: PostgresService,
    private _context: ContextService, public _appState: AppStateService, private http: HttpClient) {
    this._appState.pageNotAuthorized = false;
    this._appState.pageNotFound = false;

    this.http.get('/.auth/me').toPromise().then((data) => {
      let ans = data[0].user_claims.find(prop => {
        if (prop.typ === 'preferred_username') {
          return prop;
        }
      });
    let id = ans.val.split('@')[0];
    this._postgres.getJobByID(this._context.serverURL, id).then((answer) => {
      if (answer.jobTitle === 'אפסנאי') {
        this.userService.setUserID(id);
        if (this._router.url == '/orders') {
          this.startRefreshEvent = new CustomEvent('refreshStart');
          this.endRefreshEvent = new CustomEvent('refreshEnd');
          dispatchEvent(this.startRefreshEvent);
          this.onRefresh();
        } else {
          this._appState.pageNotFound = true;
        }
      } else if (!(this._router.url == "/404")) {
        this._appState.pageNotAuthorized = true;
        this._router.navigate(['403']);
      } else {
        this._appState.pageNotFound = true;
      }
    });
    });
  }

  onRefresh() {
    this._postgres.readByID(this._context.serverURL, this.userService.getUserID()).then((res) => {
      res.forEach(order => {
        //@ts-ignore
        order.orderdate = new Date(order.orderdate).format("dd/mm/yy");
      });
      this.orders = (Array.isArray(res)) ? res : [];
      dispatchEvent(this.endRefreshEvent);
    });
  }
  onCancel(selected: any[]) {
    selected.forEach((itemId) => {
      this._postgres.update(this._context.serverURL, itemId, this.userService.getUserID()).then((res) => {
        this.orders = (Array.isArray(res)) ? res : [];
      });
    });
    this.onRefresh();
  }

  onLogOut() {
    window.location.href = 'https://storageapp.azurewebsites.net/.auth/logout';
  }

  waitingFilter(item) {
    return (item.status == "waiting") ? true : false;
  }

  readyFilter(item) {
    return (item.status != "waiting") ? true : false;

  }
  expandBtn(){
    document.getElementById('logOutIcon').classList.add('icon-opened')
    document.getElementById('logOutBtn').classList.add('btn-opened')
  }
  collapseBtn(){
    document.getElementById('logOutIcon').classList.remove('icon-opened')
    document.getElementById('logOutBtn').classList.remove('btn-opened')
  }
}
