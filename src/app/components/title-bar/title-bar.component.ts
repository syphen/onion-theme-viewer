import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

  @Input() title:any;

  batteryColor(){
    var color = 'rgb(0,0,0)';
    if(this.theme.config.batteryPercentage && this.theme.config.batteryPercentage.red && this.theme.config.batteryPercentage.green && this.theme.config.batteryPercentage.blue){
      var r = this.theme.config.batteryPercentage.red;
      var g = this.theme.config.batteryPercentage.green;
      var b = this.theme.config.batteryPercentage.blue;
      color = `rgb(${r},${g},${b})`;
    }
    return color;
  }

  constructor(
    public theme: ThemeService
  ) { }

  ngOnInit(): void {
  }

}
