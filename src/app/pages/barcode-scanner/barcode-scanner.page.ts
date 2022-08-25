import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.page.html',
  styleUrls: ['./barcode-scanner.page.scss'],
})
export class BarcodeScannerPage implements OnInit, AfterViewInit, OnDestroy {

  result = null;
  scanActive = false;

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.prepare();
    }
  }

  async startScanner() {
    if (!this.platform.is('capacitor')) {
      const alert = await this.alertCtrl.create({
        message: 'Para iniciar el scanner debe estar en un dispositivo móvil'
      });

      await alert.present();
      return;
    }

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

  async stopScanner() {
    if (this.platform.is('capacitor')) {
      await BarcodeScanner.stopScan();
    }

    this.scanActive = false;
  }

  ngOnDestroy() {
    this.stopScanner();
  }

}
