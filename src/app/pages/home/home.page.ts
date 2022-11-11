/* eslint-disable max-len */
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';

import ApkUpdater, {Update} from 'cordova-plugin-apkupdater';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  compounds: any[] = [];

  remoteUrl: string;
  remoteVersion: any;
  installedVersion: any;
  remoteVersionCode: any;
  installedVersionCode: any;
  showUpdateInfo = false;
  hasError = false;
  jsonError: string;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.platform.ready().then(() => {
      console.log('PLATFORM READY');

      this.checkVersions();
    });
  }

  async ngOnInit() {
  }

  async checkVersions() {

  }

  async update() {
      const url = 'https://raw.githubusercontent.com/giluchipla0823/ionic-capacitor-barcode-scanner/app-updating/update/app-debug.json';
      const manifest = await this.http.get<Update>(url).toPromise();

      this.showUpdateInfo = true;
      this.remoteVersion = manifest.app.version.name;
      this.remoteVersionCode = manifest.app.version.code;

      const installedVersion = (await ApkUpdater.getInstalledVersion()).version;

      this.installedVersion = installedVersion.name;
      this.installedVersionCode = installedVersion.code;

      if (this.remoteVersionCode > this.installedVersionCode) {
        const loading = await this.loadingCtrl.create({ message: `Descargando... <span>0</span>%` });

        await loading.present();

        ApkUpdater.download(
          'https://raw.githubusercontent.com/giluchipla0823/ionic-capacitor-barcode-scanner/app-updating/update/app-debug.zip',
          {
            onDownloadProgress: (e) => {
              loading.querySelector('.loading-content span').innerHTML = `${e.progress}`;
              console.log('Downloading: ' + e.progress + '%');
            },
          },
          async () => {
              this.jsonError = null;
              this.hasError = false;
              await loading.dismiss();

              const alert = await this.alertCtrl.create({ message: 'Descarga completada. ¿Desea instalar la actualización?' });

              await alert.present();

              await alert.onDidDismiss();

              ApkUpdater.install(
                () => {
                  console.log('aplicación instalada');
                },
                async () => {
                  const alert2 = await this.alertCtrl.create({ message: 'Creo que algo paso mientras instalabas' });

                  await alert2.present();
                }
              );
          },
          async (err) => {
            this.jsonError = JSON.stringify(err);
            this.hasError = true;
            await loading.dismiss();

            const alert = await this.alertCtrl.create({ message: 'Ocurrió un problema en la descarga' });

            await alert.present();
          }
        );
      } else {
        const alert = await this.alertCtrl.create({ message: 'La aplicación está actualizada' });

        await alert.present();
      }

      // WITH ZIP

      // ApkUpdater.download(
      //   'https://raw.githubusercontent.com/kolbasa/cordova-plugin-apkupdater-demo/master/update/update.zip',
      //   {
      //     zipPassword: 'aDzEsCceP3BPO5jy',
      //     onDownloadProgress: (e) => {
      //       loading.querySelector('.loading-content span').innerHTML = `${e.progress}`;
      //       console.log('Downloading: ' + e.progress + '%');
      //     },
      //     onUnzipProgress: (e) => {
      //       console.log('Unzipping: ' + e.progress + '%');
      //     }
      //   },
      //   async () => {
      //       await loading.dismiss();

      //       const alert = await this.alertCtrl.create({ message: 'Descarga completada. ¿Desea instalar la actualización?' });

      //       await alert.present();

      //       await alert.onDidDismiss();

      //       ApkUpdater.install();
      //   },
      //   async () => {
      //     await loading.dismiss();

      //     const alert = await this.alertCtrl.create({ message: 'Ocurrió un problema en la descarga' });

      //     await alert.present();
      //   }
      // );

      // With APK
      // ApkUpdater.download(
      //   'https://github.com/kolbasa/cordova-plugin-apkupdater-demo/raw/master/Demo.apk',
      //   {
      //     onDownloadProgress: (e) => {
      //       loading.querySelector('.loading-content span').innerHTML = `${e.progress}`;
      //       console.log('Downloading: ' + e.progress + '%');
      //     },
      //   },
      //   async () => {
      //       await loading.dismiss();

      //       const alert = await this.alertCtrl.create({ message: 'Descarga completada. ¿Desea instalar la actualización?' });

      //       await alert.present();

      //       await alert.onDidDismiss();

      //       ApkUpdater.install();
      //   },
      //   async () => {
      //     await loading.dismiss();

      //     const alert = await this.alertCtrl.create({ message: 'Ocurrió un problema en la descarga' });

      //     await alert.present();
      //   }
      // );
  }
}
