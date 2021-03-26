import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NgLocaleLocalization } from '@angular/common';
import { NotificationService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'my-app-shell';
  apiData: any;
  readonly VAPID_PUBLIC_KEY ='BJ8NQfAvfjgxIMTJG-Iis0FpjyHgolT8BiB9R-YFm0seu-my7dhC4Qope2V8nn7i5UcQ04RiCXxHwGB7023l7Os';
  constructor(
    private http: HttpClient,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private _notificationService : NotificationService
  ) {}

  ngOnInit(): void {

    this.swPush.notificationClicks.subscribe((result) => {
      console.log('notifications clicked afterwards', result);
    });
    this.http.get('http://dummy.restapiexample.com/api/v1/employees').subscribe(
      (res: any) => {
        this.apiData = res.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this.updateService();
  }

  updateService() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(
        () => {
          window.location.reload();
          console.log('Workers updated successfully');
        },
        (error) => {
          console.log('error happens in service worker update', error);
        }
      );
    }
  }


  SendInstructionNotifications(){
    console.log("Sending Notification to all Subscribers ...");
    this._notificationService.send().subscribe(res => {
      console.log('Communicate notification freely !', res);
    },
    err => console.log('error returned', err))
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((result: PushSubscription) => {
        console.log('service to push notification!', result);
        this._notificationService.subscribeToSubscription(result)
        .subscribe(()=> console.log(' Sent push notification to server'),
        (err) => console.log('Could not send subscription to server, reason: ', err))
      })
      .catch((err) => console.error('Could not subscribe to notification', err));
  }

  UnSubscribeToNotifications() {
    this.swPush.unsubscribe().then(
      (result: void) => {
        window.console.log('User unsubscribe from notification ');
        window.alert('user already subscribed for notification');
      },
      (err) => {
        window.alert('could not unsubscribe' + err);
        window.console.log('Could not unsubscribe from notification ', err);
      }
    );

    // this.swPush.notificationClicks.subscribe((result) => {
    //   console.log('notifications clicked unsubscribe', result);
    // });

    // this.swPush.messages.subscribe((result) => {
    //   console.log('notifications notification message on unsubscribed ', result);
    // });
  }

 


  subscribeForNotificationServer(){

    console.log("Sending Notification to all Subscribers ...");
    this._notificationService.send().subscribe(res => {
      console.log('Communicate notification freely !', res);
       
    })
  }

  // {"publicKey":"BJSgF9mSKKe16-vjDbU-A_H6jZca7Hln2hYs4liWchs368FVVmEg6mkyyaaSGQMTX6rFZy7fidN2HKhOk2rwnIM","privateKey":"3Z0od47Fts6XngoC6NcYB6LTGUBVW5nv8HgigXQhydo"}
}
