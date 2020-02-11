import { BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

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
    ButtonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
