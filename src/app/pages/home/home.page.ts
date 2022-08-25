import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  compounds: any[] = [];

  constructor(
    private dataService: DataService,
  ) { }

  async ngOnInit() {
    this.dataService.getCompounds()
      .subscribe(res => {
        this.compounds = res;
      });
  }
}
