import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-setting-screen',
  templateUrl: './setting-screen.component.html',
  styleUrls: ['./setting-screen.component.scss']
})
export class SettingScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;
  starting = 0;

  subscriptions = [];

  items = [
    {
      name: 'Power off',
      image: 'color'
    },{
      name: 'Brightness',
      image: 'icon-brightness-48',
      range: {low: 1, high: 10, value: 10},
      change: () => {
        var i = this.items.findIndex(item => item.name == 'Brightness');
        if(i >= 0){
          this.theme.changeBrightness(this.items[i].range.value);
        }
      }
    },{
      name: 'Color',
      image: 'color'
    },{
      name: 'Language',
      image: 'icon-language-48'
    },{
      name: 'Key Mapper',
      image: 'icon-key-setting-48'
    },{
      name: 'BGM Volume',
      image: 'sound-icon',
      range: {low: 0, high: 20, value: 20},
      change: () => {
        var i = this.items.findIndex(item => item.name == 'BGM Volume');
        if(i >= 0){
          this.theme.changeVolume(this.items[i].range.value);
        }
      }
    },{
      name: 'Device Info',
      image: 'icon-device-info-48'
    },{
      name: 'Hardware Test',
      image: 'icon-device-info-48'
    }
  ]

  constructor(
    private router: Router,
    public theme: ThemeService
  ) {
    console.log('setting:constructed');
    this.buttonPressed = ($event) => {
      switch($event.detail.name){
        case 'b':
        this.router.navigate(['/']);
        break;

        case 'up':
        if(this.currentIndex > 0){
          this.currentIndex = this.currentIndex - 1;
        }
        else {
          this.currentIndex = this.items.length - 1;
        }
        break;

        case 'down':
        if(this.currentIndex < this.items.length - 1){
          this.currentIndex = this.currentIndex + 1;
        }
        else {
          this.currentIndex = 0;
        }
        break;

        case 'left':
        if(this.items[this.currentIndex].range){
          if(this.items[this.currentIndex].range.value > this.items[this.currentIndex].range.low){
            this.items[this.currentIndex].range.value = this.items[this.currentIndex].range.value - 1;
            try { this.items[this.currentIndex].change(); } catch(err) {}
          }
        }
        break;

        case 'right':
        if(this.items[this.currentIndex].range){
          if(this.items[this.currentIndex].range.value < this.items[this.currentIndex].range.high){
            this.items[this.currentIndex].range.value = this.items[this.currentIndex].range.value + 1;
            try { this.items[this.currentIndex].change(); } catch(err) {}
          }
        }
        break;
      }

      if(this.currentIndex == 0 && this.starting == this.items.length - 6){
        this.starting = 0;
      }
      else if(this.currentIndex == this.items.length - 1 && this.starting == 0) {
        this.starting = this.items.length - 6;
      }
      else if(this.currentIndex >= this.starting + 6){
        this.starting = this.starting + 1;
      }
      else if(this.currentIndex < this.starting){
        this.starting = this.starting - 1;
      }
    }
  }

  navLeft(index){
    if(this.items[index].range.value > this.items[index].range.low){
      this.items[index].range.value = this.items[index].range.value - 1;
      try { this.items[index].change(); } catch(err) {}
    }
  }
  navRight(index){
    if(this.items[index].range.value < this.items[index].range.high){
      this.items[index].range.value = this.items[index].range.value + 1;
      try { this.items[index].change(); } catch(err) {}
    }
  }

  navTo(location){
    this.router.navigate([location]);
  }

  ngOnInit(): void {
    var i = this.items.findIndex(item => item.name == 'BGM Volume');
    if(i >= 0){
      this.items[i].range.value = this.theme.volume;
    }
    this.subscriptions.push(this.theme.volumeChanged.subscribe(()=>{
      var i = this.items.findIndex(item => item.name == 'BGM Volume');
      this.items[i].range.value = this.theme.volume;
    }));

    i = this.items.findIndex(item => item.name == 'Brightness');
    if(i >= 0){
      this.items[i].range.value = this.theme.brightness;
    }
    this.subscriptions.push(this.theme.volumeChanged.subscribe(()=>{
      i = this.items.findIndex(item => item.name == 'Brightness');
      this.items[i].range.value = this.theme.brightness;
    }));
  }

  ngOnDestroy(): void {
    console.log('setting:destroyed');
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
    this.buttonPressed = () => void {};
  }

}
