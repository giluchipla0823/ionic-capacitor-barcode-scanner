import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { DataWedge } from 'capacitor-datawedge';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-laser-scanner',
  templateUrl: './laser-scanner.page.html',
  styleUrls: ['./laser-scanner.page.scss'],
})
export class LaserScannerPage implements OnInit, AfterViewInit, OnDestroy {

  result = null;
  scanStarted = false;
  scanEnabled = false;

  private scannerSound = new Audio('assets/audio/barcode.wav');

  constructor(
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    if (this.platform.is('capacitor')) {
      // Register scan listener to receive barcode data
      DataWedge.addListener('scan', event => {
        this.scannerSound.play();
        this.result = event.data;
        this.cdr.detectChanges();
      });

      this.enableScanner();
    }
  }

  async startScanner() {
    this.scanStarted = true;

    if (this.platform.is('capacitor')) {
      await DataWedge.startScanning();
    }
  }

  async stopScanner() {
    this.scanStarted = false;

    if (this.platform.is('capacitor')) {
      await DataWedge.stopScanning();
    }
  }

  async enableScanner() {
    this.scanEnabled = true;

    if (this.platform.is('capacitor')) {
      await DataWedge.enableScanner();
    }
  }

  async disableScanner() {
    this.scanEnabled = false;

    if (this.platform.is('capacitor')) {
      await DataWedge.disableScanner();
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
    this.disableScanner();
  }

}
