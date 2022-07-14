import { ChangeDetectorRef, Component, HostListener, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {
  nav = ['recents', 'favorites', 'consoles', 'expert', 'apps', 'settings'];
  currentIndex = 0;
  starting = 0;
  subscriptions = [];
  @HostListener('window:buttonPress', ['$event'])
  buttonPressed(event: any) : void {};

  gridFont = {
    family: '',
    color: '',
    size: ''
  };

  configValue(key){
    var item = this.theme.parsedConfig.find(item => item.key == key);
    if(item){
      return item.value;
    }
    return undefined;
  }

  constructor(
    private router: Router,
    private sanitize: DomSanitizer,
    public theme: ThemeService,
    private cd: ChangeDetectorRef
  ) {
    console.log('main:constructed');
    this.buttonPressed = ($event) => {
      switch($event.detail.name){
        case 'left':
        if(this.currentIndex > 0){
          this.currentIndex = this.currentIndex - 1;
        }
        else {
          this.currentIndex = this.nav.length - 1;
        }
        break;

        case 'right':
        if(this.currentIndex < this.nav.length - 1){
          this.currentIndex = this.currentIndex + 1;
        }
        else {
          this.currentIndex = 0;
        }
        break;

        case 'a':
        this.navTo('/'+this.nav[this.currentIndex]);
        break;
      }

      if(this.currentIndex == 0 && this.starting == 2){
        this.starting = 0;
      }
      else if(this.currentIndex == this.nav.length - 1 && this.starting == 0) {
        this.starting = 2;
      }
      else if(this.currentIndex >= this.starting + 4){
        this.starting = this.starting + 1;
      }
      else if(this.currentIndex < this.starting){
        this.starting = this.starting - 1;
      }
    }

    //this.parseFonts();
  }
  navTo(location){
    this.router.navigate([location]);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.theme.filesChanged.subscribe(() => {
      this.detectChanges();
    }));
  }

  detectChanges(){
    try {
      this.cd.detectChanges();
    } catch(err){}
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes);
  }

  ngOnDestroy(): void {
    console.log('main:destroyed');
    this.buttonPressed = () => void {};
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

}
