import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceInformationPageRoutingModule } from './device-information-routing.module';

import { DeviceInformationPage } from './device-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceInformationPageRoutingModule
  ],
  declarations: [DeviceInformationPage]
})
export class DeviceInformationPageModule {}
