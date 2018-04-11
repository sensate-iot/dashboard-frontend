/*
 * Dashboard root component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent implements OnInit, OnDestroy {
  public id : number;
  public backgroundColor : string;

  constructor(private settings : SettingsService) {
    this.id = settings.getSidebarImageIndex();
    this.backgroundColor = this.settings.getSidebarColor();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
