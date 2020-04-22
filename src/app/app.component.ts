import { Component, OnDestroy } from '@angular/core';
import { PostgresService } from './services/postgres.service';
import { ContextService } from './services/context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'storageApp';
  orders;
  constructor(private _postgres: PostgresService, private _context: ContextService) {
    this.onRefresh();
  }
  onRefresh() {
    console.log('res');
    this._postgres.readMany(this._context.postgressUrl).then((res) => {
      res.forEach(order => {
        //@ts-ignore
        order.orderdate = new Date(order.orderdate).format("dd/mm/yy");
      });
      this.orders = (Array.isArray(res)) ? res : [];
    });
  }
  onCancel(selected: any[]) {
    selected.forEach((itemId) => {
      this._postgres.update(this._context.postgressUrl, itemId).then((res) => {
        this.orders = (Array.isArray(res)) ? res : [];
      })
    })
  }

  waitingFilter(item) {
    return (item.status == "waiting") ? true : false;
  }

  readyFilter(item) {
    return (item.status != "waiting") ? true : false;

  }
}
