import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss'],
})
export class ImageContainerComponent  implements OnInit {
  private readonly TAG = '[ImageContainerComponent]';
  @Input() imageUrl : string = '';
  @Input() imageUrlBackup : string = '';
  @Input() isViewImage : boolean = false;
  isSkeletonShow: boolean = true;
  constructor() { }

  ngOnInit() {
    // this.initLoadSrc();
    setTimeout(()=>{
      this.isSkeletonShow = false;
    },5000)
  }

  // async initLoadSrc(){
  //   this.src = await this.CommonUseService.fetchImageAsBase64(this.imageUrl);
  // }

  onImageError($event: any) {
    // console.log(this.TAG,"onImageError",$event,this.imageUrlBackup);
    // (<any> $event).target.src = this.imageUrlBackup;
    // (<any> $event).target.style.opacity = '0';
    // setTimeout(()=>{
    //   (<any> $event).target.style.opacity = '1';
    // },2000);
  }

}
