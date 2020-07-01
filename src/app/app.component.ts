import { Component } from '@angular/core';
import { PostgresService } from './services/postgres/postgres.service';
import { ContextService } from './services/context/context.service';
import { MsalService } from '@azure/msal-angular';
import { userService } from './services/azureAD/azure-ad.service';
import { HttpClient } from '@angular/common/http';
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
  constructor(private authService: MsalService, private userService: userService, private _postgres: PostgresService,
    private _context: ContextService, private http: HttpClient) {

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
          this.startRefreshEvent = new CustomEvent('refreshStart');
          this.endRefreshEvent = new CustomEvent('refreshEnd');
          dispatchEvent(this.startRefreshEvent);
          this.onRefresh();
        } else {
          alert("נחסמת");
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

  waitingFilter(item) {
    return (item.status == "waiting") ? true : false;
  }

  readyFilter(item) {
    return (item.status != "waiting") ? true : false;

  }
}
