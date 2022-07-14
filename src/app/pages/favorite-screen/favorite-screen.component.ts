import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-favorite-screen',
  templateUrl: './favorite-screen.component.html',
  styleUrls: ['./favorite-screen.component.scss']
})
export class FavoriteScreenComponent implements OnInit {
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  currentIndex = 0;
  starting = 0;

  items = [
    {
      name: 'Chrono Trigger'
    },{
      name: 'Dr. Mario'
    },{
      name: 'Shining Force'
    },{
      name: 'Tetris Attack'
    },{
      name: 'Dig Dug'
    },{
      name: 'Donkey Kong Country'
    },{
      name: 'Bust-a-Move'
    },{
      name: 'Chrono Trigger'
    },{
      name: 'The Legend of Zelda: A Link to the Past'
    },{
      name: 'NBA Jam'
    },{
      name: 'Tetris'
    }
  ]

  navTo(location){
    this.router.navigate([location]);
  }

  constructor(
    private router: Router,
    public theme: ThemeService
  ) {
    console.log('favorite:constructed');
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
    console.log('favorite:destroyed');
    this.buttonPressed = () => void {};
  }

}
