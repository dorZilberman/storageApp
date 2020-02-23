import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
    this.subscription.push(this._notificationsService.onOrderDeleted(this, this.refresh));
  }

  ngOnInit() {
    this.refresher = $('.refresher');
    this.refresher.click(this.refresh.bind(this));
  }
  refresh() {
    console.log('refresh');
    console.log(this);
    this.refreshEmitter.emit();
    this.refresher.addClass('loading')

    setTimeout(() => {
      this.refresher.removeClass('loading')
      this.refresher.addClass('success')
      setTimeout(() => this.refresher.removeClass('success'), 2000)
    }, 1500)
    $('.btn-refresh-error').on('click', () => {
      this.refresher.addClass('loading')

      setTimeout(() => {
        this.refresher.removeClass('loading')
        this.refresher.addClass('error')

        setTimeout(() => this.refresher.removeClass('error'), 2000)

      }, 1500)
    })
  }

  ngOnDestroy() {
    console.log('onDestroy');
    this.subscription.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }
}
