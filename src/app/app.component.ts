import { Component, OnInit } from '@angular/core';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';

declare let webNotification;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  ws1;
  BTC; XRP; ETH; BCH; LTC; MIOTA; OMG; GNT;
  coins = ["BTC", "XRP", "ETH", "BCH", "LTC", "MIOTA", "OMG", "GNT"];
  name;
  min;
  max;
  CoinReminder = [];
  RealitimeData;
  ngOnInit() {
    this.ws1 = new $WebSocket("wss://ws-ap2.pusher.com/app/9197b0bfdf3f71a4064e?protocol=7&client=js&version=4.1.0&flash=false");
    this.disp();
  }

  startTrigger() {
    console.log(this.name + " ===" + this.min + " ===" + this.max);
    const triggerValue = {
      'cointype': this.name,
      'min': this.min,
      'max': this.max
    };
    this.CoinReminder.push(triggerValue);
    this.name = '';
    this.min = '';
    this.max = '';
  }

  checkTimer() {

    console.log();
    // this.CoinReminder.forEach(element => {

    for (let i = 0; i < this.CoinReminder.length; i++) {
      const element = this.CoinReminder[i];
      const coinVal = this.RealitimeData[element.cointype];
      if (coinVal <= element.min) {
        console.log('MINIMUN ' + element);
        this.customAlert({ 'coinType': element.cointype, 'coinVal': coinVal, 'ReminderType': 'MINIMUN' });
        this.CoinReminder.splice(i, 1);

      } else if (coinVal >= element.max) {
        console.log('MAXIMUM  ' + element);
        this.customAlert({ 'coinType': element.cointype, 'coinVal': coinVal, 'ReminderType': 'MAXIMUM' });
        this.CoinReminder.splice(i, 1);
      }
    }
  }

  customAlert(body) {
    webNotification.showNotification(body.coinType, {
      body: body.coinVal + '----' + body.ReminderType,
      icon: '../favicon.ico',
      onClick: function onNotificationClicked() {
        console.log('Notification clicked.');
      },
      autoClose: 5000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function onShow(error, hide) {
      if (error) {
        window.alert('Unable to show notification: ' + error.message);
      } else {
        console.log('Notification Shown.');

        setTimeout(function hideNotification() {
          console.log('Hiding notification....');
          hide(); //manually close the notification (you can skip this if you use the autoClose option)
        }, 5000);
      }
    });
  }


  disp() {
    const ws = this.ws1;

    ws.onMessage(
      (msg: MessageEvent) => {
        // console.log("onMessage ", msg.data);
        // console.log(JSON.parse(msg.data));
        const data = JSON.parse(msg.data);

        if (data.data) {

          this.RealitimeData = JSON.parse(data.data).message.data;

          this.BTC = this.RealitimeData.BTC;
          this.XRP = this.RealitimeData.XRP;
          this.ETH = this.RealitimeData.ETH;
          this.BCH = this.RealitimeData.BCH;
          this.LTC = this.RealitimeData.LTC;
          this.MIOTA = this.RealitimeData.MIOTA;
          this.OMG = this.RealitimeData.OMG;
          this.GNT = this.RealitimeData.GNT;
          this.checkTimer();
        }
      },
      { autoApply: false }
    );


    // send with default send mode (now default send mode is Observer)
    ws.send({ "event": "pusher:subscribe", "data": { "channel": "my-channel" } }).subscribe(
      (msg) => {
        // console.log("next", msg.data);


      },
      (msg) => {
        console.log("error", msg);
      },
      () => {
        console.log("complete");
      }
    );


    // ws.close(false);    // close
    // ws.close(true);    // clos
  }




}
