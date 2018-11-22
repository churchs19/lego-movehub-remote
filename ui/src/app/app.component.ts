import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'movehub-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'battery_20',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_20_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_30',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_30_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_50',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_50_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_60',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_60_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_80',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_80_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_90',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_90_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_alert',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_alert_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_std',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_std_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_full',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_full_48px.svg')
        );
        iconRegistry.addSvgIcon(
            'battery_unknown',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_battery_unknown_48px.svg')
        );
    }

    ngOnInit() {}
}
