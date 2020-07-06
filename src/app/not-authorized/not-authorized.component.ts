import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../services/appState/app-state.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private _appState: AppStateService) {
    this._appState.pageNotAuthorized = true;
    console.log("Authorized");
  }

  ngOnInit() {
  }

}
