/*
 * Sidebar logic implementation.
 */

import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { ROUTES } from './sidebar-routes.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  public color: string;
  public menuItems: object;
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;

  constructor(public settingsService: SettingsService) {
    this.menuItems = ROUTES;
    this.activeFontColor = 'rgba(0,0,0,.6)';
    this.normalFontColor = 'rgba(255,255,255,.8)';
    this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
  }

  ngOnInit() {
    this.color = this.settingsService.getSidebarFilter();
  }
}
