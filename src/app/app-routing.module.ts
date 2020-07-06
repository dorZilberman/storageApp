import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './containers/orders/orders.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LoginGuard } from './login.guard';


const routes: Routes = [
  {path:'',redirectTo: 'orders',pathMatch:'full', canActivate: [LoginGuard]},
  {path:'orders' , component:OrdersComponent},
  {path: '404', component: NotFoundComponent},
  {path: '403', component: NotAuthorizedComponent},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
