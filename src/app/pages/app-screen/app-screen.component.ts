import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-app-screen',
  templateUrl: './app-screen.component.html',
  styleUrls: ['./app-screen.component.scss']
})
export class AppScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;
  starting = 0;

  items = [
    {
      name: 'The Onion Installer',
      description: 'Add features to your system...',
      icon: 'onion-installer'
    },{
      name: 'File Explorer',
      description: 'DinguxCommander',
      icon: 'commander'
    },{
      name: 'Play Activity',
      description: 'Game usage tracker.',
      icon: 'play-activity'
    },{
      name: 'Onion Manual',
      description: 'Find help on how to use it',
      icon: 'onion-manual'
    },{
      name: 'Onion Launcher',
      description: 'Launch your games at boot.',
      enabled: false,
      command: () => {
        var i = this.items.findIndex(item => item.name == 'Onion Launcher');
        if(i >= 0){
          this.items[i].enabled = !this.items[i].enabled;
        }
      },
      icon: {
        enabled: 'onion-launcher-enabled',
        disabled: 'onion-launcher-disabled'
      }
    },{
      name: 'RetroArch',
      description: 'RetroArch Settings',
      icon: 'retroarch'
    },{
      name: 'Time Machine',
      description: 'Remove years from console names',
      icon: 'time-machine'
    },{
      name: 'Dot files remover',
      description: 'Removes files created by MacOSX',
      icon: 'dot-file-remover'
    },{
      name: 'Little Sound DJ',
      description: '8-bit music tracker.',
      icon: 'little-sound-dj'
    },{
      name: 'Theme Switcher',
      description: 'Change and add themes easily.',
      icon: 'theme-switcher'
    }
  ]

  getIcon(item){
    var img = '';
    if(item.enabled == undefined){
      img = item.icon;
    }
    else {
      if(item.enabled === true){
        img = item.icon.enabled;
      }
      else {
        img = item.icon.disabled;
      }
    }
    return `./assets/apps/${img}.png`;
  }

  navTo(location){
    this.router.navigate([location]);
  }

  constructor(
    private router: Router,
    public theme: ThemeService
  ) {
    console.log('app:constructed');
    this.buttonPressed = ($event) => {
      switch($event.detail.name){
        case 'b':
        this.router.navigate(['/']);
        break;

        case 'a':
        if(this.items[this.currentIndex].command != undefined){
          this.items[this.currentIndex].command();
        }
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
      }

      if(this.currentIndex == 0 && this.starting == this.items.length - 4){
        this.starting = 0;
      }
      else if(this.currentIndex == this.items.length - 1 && this.starting == 0) {
        this.starting = this.items.length - 4;
      }
      else if(this.currentIndex >= this.starting + 4){
        this.starting = this.starting + 1;
      }
      else if(this.currentIndex < this.starting){
        this.starting = this.starting - 1;
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('app:destroyed');
    this.buttonPressed = () => void {};
  }
}
