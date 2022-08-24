import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { DataService } from '../services/data.service';

import { Device } from '@capacitor/device';

import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  result = null;
  scanActive = false;

  compounds: any[] = [];

  data: any;
  device: any = {};

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private dataService: DataService,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
  ) {}

  async ngOnInit() {
    this.dataService.getCompounds()
      .subscribe(res => {
        this.compounds = res;
      });

    this.getPermission();
  }

  ngAfterViewInit() {
    if (this.platform.is('mobileweb')) {
      console.warn('Debe estar en un dispositivo para activar usar el scanner.');
      return;
    }
    BarcodeScanner.prepare();
  }

  async getPermission(){
    this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    ).then(async (res) => {
      if(res.hasPermission){
        this.deviceInfo();
      }else{
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
          .then(() => this.deviceInfo())
          .catch(async (error) => {
            const alert = await this.alertCtrl.create({
              header: 'No permission',
              message: 'ERROR - 01',
              buttons: [{
                text: 'No',
                role: 'cancel'
              },
              {
                text: 'Open Settings',
                handler: () => {
                }
              }]
            });

            await alert.present();
        });
      }
    })
    .catch(async (error) => {
      const alert = await this.alertCtrl.create({
        header: 'No permission',
        message: 'ERROR - 02',
        buttons: [{
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Open Settings',
          handler: () => {
          }
        }]
      });

      await alert.present();
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.result = result.content;
        this.scanActive = false;
      }
    }
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        // We are fine
        resolve(true);
      } else if (status.denied) {
        // Denied before
        const alert = await this.alertCtrl.create({
          header: 'No permission',
          message: 'Please allow camera access in your settings',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Open Settings',
            handler: () => {
              resolve(false);
              BarcodeScanner.openAppSettings();
            }
          }]
        });

        await alert.present();
      } else {
        resolve(false);
      }
    });
  };

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ngOnDestroy() {
    BarcodeScanner.stopScan();
  }

  getIDUID(type: string) {
    if(type === 'IMEI'){
      return this.uid.IMEI;
    }else if(type === 'ICCID'){
      return this.uid.ICCID;
    }else if(type === 'IMSI'){
      return this.uid.IMSI;
    }else if(type === 'MAC'){
      return this.uid.MAC;
    }else if(type === 'UUID'){
      return this.uid.UUID;
    }
  }

  private async deviceInfo() {
    const uuid = (await Device.getId()).uuid;
    const name = (await Device.getInfo()).name;

    this.device = {
      uuid,
      name,
      imei: this.getIDUID('IMEI') || 'desconocido'
    };
  }

}
