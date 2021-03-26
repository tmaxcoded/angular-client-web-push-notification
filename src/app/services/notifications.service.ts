import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class NotificationService{

  constructor(private _httpService: HttpClient){

  }


  subscribeToSubscription(sub: any){
    return this._httpService.post('http://localhost:3000/api/subscribe/notifications',sub)
  }

  send(){
    return this._httpService.post('http://localhost:3000/api/instruction/notification',null)
  }
}