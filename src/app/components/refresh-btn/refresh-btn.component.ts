import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-refresh-btn',
  templateUrl: './refresh-btn.component.html',
  styleUrls: ['./refresh-btn.component.scss']
})
export class RefreshBtnComponent implements OnInit {
  @Output() refreshEmitter = new EventEmitter();
  subscription: Subscription[] = [];
  refresher;
  constructor(private _notificationsService: NotificationsService) {
    this.subscription.push(this._notificationsService.onOrderDeleted(this, this.startRefresh));
  }

  ngOnInit() {
    this.refresher = $('.refresher');
    this.refresher.click(this.startRefresh.bind(this));
    addEventListener('refreshStart', () => {
      this.startRefresh();
    });
    addEventListener('refreshEnd', () => {
      this.endRefresh();
    });
  }

  startRefresh() {
    this.refreshEmitter.emit();
    this.refresher.addClass('loading');
    console.log("IM LOADING");
  }

  endRefresh() {
    this.refresher.removeClass('loading');
    this.refresher.addClass('success');
    console.log("END LOADING");
    setTimeout(() => this.refresher.removeClass('success'), 2000);
  }

  refresh() {
    $('.btn-refresh-error').on('click', () => {
      this.refresher.addClass('loading');
      console.log("IM LOADING ON CLICK");
      addEventListener('refreshEnd', () => {
        this.refresher.removeClass('loading');
        this.refresher.addClass('error');
        console.log("IM ON ERROR");
        setTimeout(() => this.refresher.removeClass('error'), 2000);
      });
    });
  }

  ngOnDestroy() {
    this.subscription.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }
}
