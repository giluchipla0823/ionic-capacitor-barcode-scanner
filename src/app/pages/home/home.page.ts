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
    // this.platform.ready().then(() => {
    //   console.log('PLATFORM READY');

    //   this.update();
    // });
  }

  async ngOnInit() {
  }

  async update() {
    // const url = this.remoteUrl + '/update.json';
    // const url = 'assets/data/app-update/update.json';
    const url = 'https://api.wepark.pro/api/app-update-info';
    const manifest = await this.http.get<Update>(url).toPromise();



    this.showUpdateInfo = true;
    this.remoteVersion = manifest.app.version.name;
    this.installedVersion = (await ApkUpdater.getInstalledVersion()).version.name;

    this.remoteVersionCode = manifest.app.version.code;
    this.installedVersionCode = (await ApkUpdater.getInstalledVersion()).version.code;

    // if (remoteVersionCode > installedVersionCode) {
        // await ApkUpdater.download(
        //     this.remote + '/update.zip',
        //     {
        //         zipPassword: 'aDzEsCceP3BPO5jy',
        //         onDownloadProgress: console.log,
        //         onUnzipProgress: console.log
        //     }
        // );

        // ApkUpdater.download(
        //   'https://raw.githubusercontent.com/kolbasa/cordova-plugin-apkupdater-demo/master/update/update.zip',
        //     {
        //         zipPassword: 'aDzEsCceP3BPO5jy',
                // onDownloadProgress: (e) => {
                //     console.log('Downloading: ' + e.progress + '%');
                // },
        //         onUnzipProgress: (e) => {
        //             console.log('Unzipping: ' + e.progress + '%');
        //         }
        //     },
        //     (resp) => {
        //         console.log('Update can be installed now', resp);
        //     },
        // );

      // if (remoteVersionCode > installedVersionCode) {
      if (true) {
        const loading = await this.loadingCtrl.create({ message: `Descargando... <span>0</span>%` });

        await loading.present();

        ApkUpdater.download(
          'https://api.wepark.pro/api/app-update-download',
          {
            // zipPassword: 'secret',
            onDownloadProgress: (e) => {
              loading.querySelector('.loading-content span').innerHTML = `${e.progress}`;
              console.log('Downloading: ' + e.progress + '%');
            },
            // onUnzipProgress: (e) => {
            //   console.log('Unzipping: ' + e.progress + '%');
            // }
          },
          async () => {
              this.jsonError = null;
              this.hasError = false;
              await loading.dismiss();

              const alert = await this.alertCtrl.create({ message: 'Descarga completada. ¿Desea instalar la actualización?' });

              await alert.present();

              await alert.onDidDismiss();

              ApkUpdater.install();
          },
          async (err) => {
            this.jsonError = JSON.stringify(err);
            this.hasError = true;
            await loading.dismiss();

            const alert = await this.alertCtrl.create({ message: 'Ocurrió un problema en la descarga' });

            await alert.present();
          }
        );
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
