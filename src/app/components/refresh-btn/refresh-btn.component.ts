import { Component, OnInit,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-refresh-btn',
  templateUrl: './refresh-btn.component.html',
  styleUrls: ['./refresh-btn.component.scss']
})
export class RefreshBtnComponent implements OnInit {
  @Output() refresh = new EventEmitter();
  constructor() { }
  
  ngOnInit() {
    let refresher = $('.refresher')
    refresher.click(() => {
      console.log('refresh');
      this.refresh.emit();
      refresher.addClass('loading')

      setTimeout(function () {
        refresher.removeClass('loading')
        refresher.addClass('success')
        setTimeout(() => refresher.removeClass('success'), 2000)
      }, 1500)
    })
    console.log($('.icon-refresh')[0].onclick);
    $('.btn-refresh-error').on('click', () => {
      refresher.addClass('loading')

      setTimeout(function () {
        refresher.removeClass('loading')
        refresher.addClass('error')

        setTimeout(() => refresher.removeClass('error'), 2000)

      }, 1500)
    })

  }

}
