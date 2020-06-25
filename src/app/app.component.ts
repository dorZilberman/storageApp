import { Component } from '@angular/core';
import { PostgresService } from './services/postgres/postgres.service';
import { ContextService } from './services/context/context.service';
import { MsalService } from '@azure/msal-angular';
import { userService } from './services/azureAD/azure-ad.service';
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
  constructor(private authService: MsalService, private userService: userService, private _postgres: PostgresService, private _context: ContextService) {
    this.authService.loginPopup({
      extraScopesToConsent: ["user.read", "openid", "profile"]
    }).then((user) => {
      let id = user.account.userName.split('@')[0];
      this.userService.setUserID(id);
      this._postgres.getJobByID(this._context.serverURL).then((answer) => {
        if (answer.jobTitle === 'אפסנאי') {
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
    this._postgres.readByID(this._context.serverURL).then((res) => {
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
      this._postgres.update(this._context.serverURL, itemId).then((res) => {
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
