import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { userService } from './services/azureAD/azure-ad.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private _userService: userService) {}

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return (!(this._userService.getUserID() === ''));
  }
  
}
