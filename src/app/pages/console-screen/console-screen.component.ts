import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-console-screen',
  templateUrl: './console-screen.component.html',
  styleUrls: ['./console-screen.component.scss']
})
export class ConsoleScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;

  consoles = [
    {
      name: 'Atari',
      image: './assets/atari.png'
    },{
      name: 'Gameboy',
      image: './assets/gb.png'
    },{
      name: 'Genesis',
      image: './assets/md.png'
    },{
      name: 'NES',
      image: './assets/fc.png'
    },{
      name: 'Playstation',
      image: './assets/ps.png'
    },{
      name: 'SNES',
      image: './assets/sfc.png'
    }
  ]

  constructor(
    private router: Router,
    public theme: ThemeService
  ) {
    console.log('console:constructed');
    this.buttonPressed = ($event) => {
      switch($event.detail.name){
        case 'b':
        this.router.navigate(['/']);
        break;

        case 'left':
        var min = 0;
        var max = 3;
        if(this.currentIndex > max){
          min = 4;
          max = this.consoles.length-1;
        }
        if(this.currentIndex > min){
          this.currentIndex = this.currentIndex - 1;
        }
        else {
          this.currentIndex = max;
        }
        break;

        case 'right':
        var min = 0;
        var max = 3;
        if(this.currentIndex > max){
          min = 4;
          max = this.consoles.length-1;
        }
        if(this.currentIndex < max){
          this.currentIndex = this.currentIndex + 1;
        }
        else {
          this.currentIndex = min;
        }
        break;

        case 'up':
        if(this.currentIndex >= 4) {
          this.currentIndex = this.currentIndex - 4;
        }
        else if(this.currentIndex + 4 >= this.consoles.length){
          this.currentIndex = this.consoles.length - 1;
        }
        else {
          this.currentIndex = this.currentIndex + 4;
        }
        break;

        case 'down':
        if(this.currentIndex >= 4) {
          this.currentIndex = this.currentIndex - 4;
        }
        else if(this.currentIndex + 4 >= this.consoles.length){
          this.currentIndex = this.consoles.length - 1;
        }
        else {
          this.currentIndex = this.currentIndex + 4;
        }
        break;
      }
    }
  }

  navTo(location){
    this.router.navigate([location]);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('console:destroyed');
    this.buttonPressed = () => void {};
  }
}
