import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { SettingsModel } from 'src/app/models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit,OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  settings : SettingsModel = {} as SettingsModel;

  constructor(private appStates:AppStates,
              private commonUseUtil:CommonUseUtil) {
    appStates.listenSettings()
    .pipe(takeUntil(this.destroy$))
    .subscribe((settings:SettingsModel)=>{
      this.settings = settings;
    })
  }

  ngOnInit() {
  }


  onCropChange(event:any){
    this.settings.isCrop = event.target.checked;
    console.log("onCropChange",event.target.checked,this.settings);
    this.commonUseUtil.saveSettings(this.settings)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
