import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AuthenticationService } from './shared/services/authentication.service' ;
import { UserService } from './shared/services/user.service';

@Component({
  templateUrl: 'app.html'
})
export class GasStationApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListPage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private push: Push,
    private device: Device,
    private headerColor: HeaderColor,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Ínicio', component: HomePage },
      { title: 'Lista', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.headerColor.tint('#488aff');
      this.statusBar.backgroundColorByHexString('#488aff');
      this.splashScreen.hide();

      const device = {
        model: this.device.model,
        spec: JSON.stringify({ platform: this.device.platform, uuid: this.device.uuid, version: this.device.cordova })
      }

      const serialized = localStorage.getItem('br.com.gasin');
      const context = serialized ? JSON.parse(serialized) : undefined;

      if (!context) {
        this.userService
        .createUser({ nickname: 'anonymous', email: `${this.generateRandomHash()}@gasin.com.br`, password: this.generateRandomHash() })
        .subscribe((user: any) => {
          this.authenticationService
            .login(user.email, user.password)
            .subscribe((context: any) => {
              let serialized = localStorage.getItem('br.com.gasin');
              let ctxt = serialized ? JSON.parse(serialized) : undefined;

              this.authenticationService.createDevice(device, this.device.uuid, ctxt)
                .subscribe((response: boolean) => {
                  // DEVICE CREATED
                }, (error: Error) => {
                  // ERROR DEVICE
                });
            }, (error: any) => {
              console.warn(error);
            });
        }, (error: any) => {
          console.warn(error);
        });
      }

      this.pushSetup();
    });
  }

  pushSetup() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: { senderID: '256624249194' },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  generateRandomHash(): string {
    return Math.random().toString(36).substring(3);
  }
}
