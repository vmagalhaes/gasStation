import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { ListPage } from '../list/list';
import { GasStationPage } from '../gas-station/gas-station';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  latlngUser: any;
  latilong: any;
  listPage = { title: 'List', component: ListPage };
  loading: any;
  gasStation: any;
  gasStations: any[] = [];
  filteredGasStations: any[] = [];
  backIsHide: boolean = false;
  searchButton: boolean = false;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  icons = {
    start: new google.maps.MarkerImage(
    // URL
    'assets/images/vol.png',
    // (width,height)
    new google.maps.Size( 48, 48 ),
    // The origin point (x,y)
    new google.maps.Point( 0, 0 ),
    // The anchor point (x,y)
    new google.maps.Point( 22, 32 )
    ),
    end: new google.maps.MarkerImage(
    // URL
    'http://i.imgur.com/svzzuiv.png',
    // (width,height)
    new google.maps.Size( 48, 48 ),
    // The origin point (x,y)
    new google.maps.Point( 0, 0 ),
    // The anchor point (x,y)
    new google.maps.Point( 25, 40 )
    )
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation
  ) {
    this.presentLoadingDefault();
    this.getMap();
  }

  openList() {
    this.navCtrl.popToRoot();
  }

  loadMap() {
    this.gasStation = this.navParams.get('gasStation') || undefined;
    this.backIsHide = this.navParams.get('backIsHide') || false;
    this.gasStations = this.navParams.get('gasStations') || [];

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 10,
      center: this.latlngUser,
      scrollwheel: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false
    });

    //SEARCH BOX
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    this.map.addListener('bounds_changed', (a: any) => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', (a: any) => {
      this.clearOverlays();      
      let places = searchBox.getPlaces();
      let bounds = new google.maps.LatLngBounds();
      places.forEach((place: any) => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      
        this.searchGasStations(place);
      });
    });
    
    // this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.setOptions({
    //   polylineOptions: {
    //     strokeWeight: 3,
    //     strokeOpacity: 0.9,
    //     strokeColor: '#488AFF'
    //   }
    // , suppressMarkers: true });

    if (this.gasStation) {
        this.latilong = new LatLng(parseFloat(this.gasStation.latitude), parseFloat(this.gasStation.longitude));
      } else {
        this.latilong = this.latlngUser;
      }

    this.loading.dismiss();
    
    this.calculateAndDisplayRoute();
  }

  addInfoWindow(gasStation: any) {
    let gasStationModal = this.modalCtrl.create(GasStationPage, {
      gasStation: gasStation,
      latlngUser: this.latlngUser
    });
    gasStationModal.present();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.latlngUser,
      destination: this.latilong,
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC
    }, (response, status) => {
      let leg = response.routes[0].legs[0];
      let marker = this.makeMarker(leg.end_location, this.icons.end, this.gasStation);
      this.filteredGasStations.push(marker);
      this.addInfoWindow(this.gasStation);
    });
  }

  makeMarker(position, icon, gasStation) {
    let marker = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: gasStation.name
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.addInfoWindow(gasStation);
    });

    this.map.setZoom(17);
    this.map.panTo(marker.position);

    return marker;
  }

  getMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latlngUser = new LatLng(resp.coords.latitude, resp.coords.longitude);
      this.loadMap();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando mapa'
    });

    this.loading.present();
  }

  openSearchButton() {
    if (this.searchButton) {
      this.searchButton = false;
    } else {
      this.searchButton = true;      
    }
  }

  searchGasStations(place: any) {
    let circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      fillColor: '#FF0000',
      fillOpacity: 0,
      map: this.map,
      center: new LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
      radius: 1000
    });

    let bounds = circle.getBounds();

    if (this.gasStations) {
      this.gasStations.forEach((gasStation: any) => {
        let marker = new google.maps.Marker({
          position: new LatLng(gasStation.latitude, gasStation.longitude)
        });
        
        if (google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(), circle.getCenter()) <= circle.getRadius()) {
          let gas = this.makeMarker(new LatLng(gasStation.latitude, gasStation.longitude), this.icons.end, gasStation);
          this.filteredGasStations.push(gas);
        } else {
          console.log('OUTSIDE');
        }
      });
    }

    this.map.fitBounds(bounds);
  }

  clearOverlays() {
    while(this.filteredGasStations.length) { this.filteredGasStations.pop().setMap(null); }
    this.filteredGasStations.length = 0;
  }
}
