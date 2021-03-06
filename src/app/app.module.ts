// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { RatingComponent } from '../pages/index';
import { HttpModule } from '@angular/http';

// SERVICES

import { AuthenticationService } from './shared/services/authentication.service';
import { UserService } from './shared/services/user.service';
import { ContextService } from './shared/services/context.service';
import { PlaceService } from './shared/services/place.service';
import { InteractionService } from './shared/services/interaction.service';

// PIPE

import { MomentPipe } from './shared/pipes/moment.pipe';

// IONIC
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { BrMaskerModule } from 'brmasker-ionic-3';

// NATIVE
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';
import { StatusBar } from '@ionic-native/status-bar';

// PIPE
import { TransformDistancePipe, FilterPipe, GasStationPage, ListPage, HomePage, IntroPage } from '../pages/index';

// COMPONENT
import { GasStationApp } from './app.component';

@NgModule({
  declarations: [
    GasStationApp,
    HomePage,
    ListPage,
    GasStationPage,
    TransformDistancePipe,
    FilterPipe,
    RatingComponent,
    IntroPage,
    MomentPipe
  ],
  imports: [
    BrowserModule,
    BrMaskerModule,
    IonicModule.forRoot(GasStationApp),
    IonicModule,
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    GasStationApp,
    HomePage,
    ListPage,
    GasStationPage,
    IntroPage
  ],
  providers: [
    AuthenticationService,
    ContextService,
    Device,
    Geolocation,
    GoogleMaps,
    HeaderColor,
    InteractionService,
    LaunchNavigator,
    StatusBar,
    SplashScreen,
    PlaceService,
    Push,
    UserService,
    MomentPipe,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  exports: [
    MomentPipe
  ]
})
export class AppModule {}
