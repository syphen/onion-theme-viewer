import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-recent-screen',
  templateUrl: './recent-screen.component.html',
  styleUrls: ['./recent-screen.component.scss']
})
export class RecentScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;
  starting = 0;

  items = [
    {
      name: 'Paper Mario'
    },{
      name: 'Final Fantasy VII'
    },{
      name: 'NBA Jam',
      favorite: true
    },{
      name: 'Chrono Trigger',
      favorite: true
    },{
      name: 'The Legend of Zelda'
    },{
      name: 'Marvel vs. Capcom 2'
    },{
      name: 'Tetris',
      favorite: true
    },{
      name: 'Super Mario Land'
    }
  ]

  navTo(location){
    this.router.navigate([location]);
  }

  constructor(
    private router: Router,
    public theme: ThemeService
  ) {
    console.log('recent:constructed');
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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('recent:destroyed');
    this.buttonPressed = () => void {};
  }

}
