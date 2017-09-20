import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';

import { FirebaseService } from '../pages/firebase.service';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { GasStationPage } from '../pages/gas-station/gas-station';
import { FilterPage } from '../pages/filter/filter';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
  apiKey: "AIzaSyDiH2tM2VkKoZWgAhI89y2ixvOKr908nsw",
  authDomain: "gasstation-981b8.firebaseapp.com",
  databaseURL: "https://gasstation-981b8.firebaseio.com",
  storageBucket: "gasstation-981b8.appspot.com",
  messagingSenderId: "256624249194"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    GasStationPage,
    FilterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    GasStationPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    LaunchNavigator,
    FirebaseService,
    Geolocation,    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
