import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaserScannerPageRoutingModule } from './laser-scanner-routing.module';

import { LaserScannerPage } from './laser-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaserScannerPageRoutingModule
  ],
  declarations: [LaserScannerPage]
})
export class LaserScannerPageModule {}
