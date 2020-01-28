import { Component } from '@angular/core';
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
    this._postgres.readMany(this._context.postgressUrl).then((res) => {
      console.log(res);
        this.orders = (Array.isArray(res))? res: [];
    });

  }

  onCancel(selected: any[]) {
    selected.forEach((itemId) => {
      this._postgres.update(this._context.postgressUrl, itemId).then((res) => {
        console.log(res);
        this.orders = (Array.isArray(res))? res: [];
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
