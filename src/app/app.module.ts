import { BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MsalModule } from '../../node_modules/@azure/msal-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersComponent } from './containers/orders/orders.component';
import {TableModule,DropdownModule, MultiSelectModule,CalendarModule, 
  CheckboxModule, TabViewModule, ButtonModule} from '../../node_modules/primeng';
import { FormsModule } from '@angular/forms';
import { IconsModule } from './icons/icons.module';
import { HttpClientModule } from '@angular/common/http';
import { FilterArrayPipe } from './pipes/filter-array.pipe';
import { RefreshBtnComponent } from './components/refresh-btn/refresh-btn.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    FilterArrayPipe,
    RefreshBtnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    IconsModule,
    CalendarModule,
    CheckboxModule,
    TabViewModule,
    HttpClientModule,
    ButtonModule,
    MsalModule.forRoot({
      auth: {
        clientId: '5afdca2d-1b20-4a80-b949-07469fe2883e',
        authority: 'https://login.microsoftonline.com/78820852-55fa-450b-908d-45c0d911e76b',
        redirectUri: 'https://storageapp.azurewebsites.net'
      },
      cache: {
        cacheLocation: 'localStorage',
      },
    }, {
      popUp: false,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
