import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-screen',
  templateUrl: './expert-screen.component.html',
  styleUrls: ['./expert-screen.component.scss']
})
export class ExpertScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;

  consoles = [
    {
      name: 'easyrpg'
    },{
      name: 'gearboygbc'
    },{
      name: 'genesis_plus_gx'
    },{
      name: 'lutro'
    },{
      name: 'mame2003'
    },{
      name: 'mgba'
    },{
      name: 'theodore'
    },{
      name: 'vba_next'
    }
  ]

  navTo(location){
    this.router.navigate([location]);
  }

  constructor(
    private router: Router
  ) {
    console.log('expert:constructed');
    this.buttonPressed = ($event) => {
      switch($event.detail.name){
        case 'b':
        this.router.navigate(['/']);
        break;

        case 'left':
        var min = 0;
        var max = 2;
        if(this.currentIndex > max){
          min = 3;
          max = this.consoles.length-1;
        }
        if(this.currentIndex == 0 || this.currentIndex == 6){
          this.currentIndex = this.consoles.length - 1;
        }
        else if(this.currentIndex > min){
          this.currentIndex = this.currentIndex - 1;
        }
        else {
          this.currentIndex = max;
        }
        break;

        case 'right':
        var min = 0;
        var max = 2;
        if(this.currentIndex > max){
          min = 3;
          max = this.consoles.length-1;
        }
        if(this.currentIndex == 5){
          this.currentIndex = 3;
        }
        else if(this.currentIndex < max){
          this.currentIndex = this.currentIndex + 1;
        }
        else if(this.currentIndex == this.consoles.length - 1){
          this.currentIndex = 6;
        }
        else {
          this.currentIndex = min;
        }
        break;

        case 'up':
        if(this.currentIndex < 3) {
          if(this.currentIndex + 6 >= this.consoles.length){
            this.currentIndex = this.consoles.length - 1;
          }
          else {
            this.currentIndex = this.currentIndex + 6;
          }
        }
        else {
          this.currentIndex = this.currentIndex - 3;
        }
        console.log(this.currentIndex, this.consoles.length);
        break;

        case 'down':
        if(this.currentIndex >= 6) {
          this.currentIndex = this.currentIndex - 6;
        }
        else if(this.currentIndex + 3 >= this.consoles.length){
          this.currentIndex = this.consoles.length - 1;
        }
        else {
          this.currentIndex = this.currentIndex + 3;
        }
        break;
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('expert:destroyed');
    this.buttonPressed = () => void {};
  }
}
