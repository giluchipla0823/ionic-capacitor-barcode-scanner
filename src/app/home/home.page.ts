import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { DataService } from '../services/data.service';

import { Device } from '@capacitor/device';

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
    private dataService: DataService
  ) {}

  async ngOnInit() {
    this.dataService.getCompounds()
      .subscribe(res => {
        this.compounds = res;
      });

    const uuid = (await Device.getId()).uuid;
    const name = (await Device.getInfo()).name;

    this.device = {
      uuid,
      name
    };
  }

  ngAfterViewInit() {
    if (this.platform.is('mobileweb')) {
      console.warn('Debe estar en un dispositivo para activar usar el scanner.');
      return;
    }
    BarcodeScanner.prepare();
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

}
