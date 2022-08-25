import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';

import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-device-information',
  templateUrl: './device-information.page.html',
  styleUrls: ['./device-information.page.scss'],
})
export class DeviceInformationPage implements OnInit {

  device: any = {};
  hasGrantedPermission = false;

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
  ) { }

  ngOnInit() {
    this.getDeviceInfo();
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );

      if (!result.hasPermission) {
        const alert = await this.alertCtrl.create({
          message: 'Debe brindar permisos para obtener el IMEI del dispositivo',
          buttons: [
            {
              text: 'OK',
              role: 'confirmed',
            }
          ]
        });

        await alert.present();

        await alert.onDidDismiss();

        await this.getImei();
      }

      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }

    this.hasGrantedPermission = true;

    return this.uid.IMEI;
  }

  private async getDeviceInfo() {
    if (this.platform.is('capacitor')) {
      const imei = await this.getImei();
      const uuid = (await Device.getId()).uuid;
      const name = (await Device.getInfo()).name;

      if (this.hasGrantedPermission) {
        this.device = {
          uuid,
          name,
          imei
        };
      }
    }
  }

}
