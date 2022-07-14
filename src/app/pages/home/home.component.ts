import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  config;
  dragOver;
  themeFolder;
  button;
  watcher;
  error:any;
  muted = false;
  bgAudio = false;
  themeReady = false;
  originalConfig = '';
  changesMade = false;
  oldVolume:any;
  sidebarMsg:any = {
    show: false
  }
  bodyMsg:any = {
    show: false
  }

  subscriptions = [];

  closeError(){
    return new Promise<void>(resolve => {
      if(this.error){
        clearTimeout(this.error.timer);
        this.error.show = false;
        setTimeout(() => {
          this.error = undefined;
          resolve();
        }, 350);
      }
      else {
        resolve();
      }
    })
  }

  displayError(msg, time = 5){
    this.closeError().then(() => {
      this.error = {
        show: false,
        message: msg
      }
      this.error.timer = setTimeout(() => {
        this.error.show = true;
        this.error.timer = setTimeout(() => {
          this.closeError();
        }, time*1000);
      })
    })
  }

  constructor(
    private cd: ChangeDetectorRef,
    private electron: ElectronService,
    private router: Router,
    public theme: ThemeService
  ) {

  }

  updateVolume(){
    if(this.muted){
      this.oldVolume = this.theme.volume;
      this.theme.changeVolume(0);
    }
    else {
      this.theme.changeVolume(this.oldVolume);
    }
  }

  updateConfig(){
    var newConfig = {};
    this.config.forEach(item => {
      if(item.values){
        newConfig[item.key] = {}
        item.values.forEach(tmp => {
          var val = tmp.value;

          if(tmp.type == 'number' || tmp.key == 'red' || tmp.key == 'green' || tmp.key == 'blue'){
            val = parseInt(val);
          }
          newConfig[item.key][tmp.key] = val;
        })
      }
      else {
        var val = item.value;
        if(item.type == 'number' || item.key == 'red' || item.key == 'green' || item.key == 'blue'){
          val = parseInt(val);
        }
        newConfig[item.key] = val;
      }
    })
    this.theme.config = newConfig;
    newConfig = this.parseConfig(newConfig, true);
    this.changesMade = (this.originalConfig != JSON.stringify(newConfig));
    this.detectChanges();
    this.parseFonts();
  }

  parseConfig(config, getReturn = false){

    var items = this.theme.parseConfig(config, true);

    if(getReturn){
      return items;
    }
    else {
      this.config = items;
    }
  }

  @HostListener('window:keyup', ['$event']) windowKeyUp($event):void {
    switch($event.code){
      case 'Up':
      case 'ArrowUp':
      this.buttonPressed('up');
      break;

      case 'Down':
      case 'ArrowDown':
      this.buttonPressed('down');
      break;

      case 'Left':
      case 'ArrowLeft':
      this.buttonPressed('left');
      break;

      case 'Right':
      case 'ArrowRight':
      this.buttonPressed('right');
      break;

      case 'Menu':
      case 'Space':
      this.buttonPressed('menu');
      break;

      case 'Select':
      case 'ShiftRight':
      case 'ShiftLeft':
      this.buttonPressed('select');
      break;

      case 'Start':
      case 'Enter':
      this.buttonPressed('start');
      break;

      default:
      this.buttonPressed($event.code.replace('Key', '').toLowerCase())
      break;
    }
  };

  buttonPressed(name){
    this.button = name;
    this.detectChanges();

    const newEvent = new CustomEvent('buttonPress', {
      bubbles: true,
      detail: { name: name }
    });
    window.dispatchEvent(newEvent);

    setTimeout(() => {
      this.button = '';
      this.detectChanges();
    }, 250);
  }

  message(location, message, type = 'success', time = 5){
    var prom = new Promise<void>((resolve) => {
      if(this[location+'Msg'] && this[location+'Msg'].timer){
        clearTimeout(this[location+'Msg'].timer);
        this[location+'Msg'].show = false;
        setTimeout(() => {
          this[location+'Msg'] = undefined;
          resolve();
        }, 300);
      }
      else {
        resolve();
      }
    })
    prom.then(() => {
      this[location+'Msg'] = {
        type: type,
        message: message
      }
      this[location+'Msg'].timer = setTimeout(() => {
        this[location+'Msg'].show = true;
        this[location+'Msg'].timer = setTimeout(() => {
          this[location+'Msg'].show = false;
          this[location+'Msg'].timer = setTimeout(() => {
            this[location+'Msg'] = undefined;
          }, 500);
        }, time*1000)
      }, 250);
    })
  }

  saveTheme(){
    console.log('Start save')
    this.theme.saveTheme().then((msg) => {
      this.originalConfig = JSON.stringify(this.config);
      this.changesMade = false;
      this.message('sidebar', msg);
    }, err => {
      this.message('sidebar', err, 'error');
    })
  }

  ngOnInit(): void {
    var app = this.electron.remote.app;
    var userPath = app.getPath("userData");

    if(this.electron.fs.existsSync(`${userPath}/lastDir.txt`)){
      var themeDir = this.electron.fs.readFileSync(`${userPath}/lastDir.txt`, 'utf8').trim();

      var config = JSON.parse(this.electron.fs.readFileSync(`${themeDir}/config.json`, 'utf8'));
      var folder = themeDir;

      setTimeout(() => {
        this.theme.changeTheme({folder: folder, config: config});
      })
    }
    if(this.electron.fs.existsSync(`${userPath}/lastVolume.txt`)){
      var volume:any = this.electron.fs.readFileSync(`${userPath}/lastVolume.txt`, 'utf8').trim();
      if(volume != ''){
        volume = parseInt(volume);
        this.theme.changeVolume(volume, false).then(() => {
          if(this.theme.volume == 0){
            this.muted = true;
            this.oldVolume = 20;
          }
        });
      }
    }

    this.subscriptions.push(this.theme.filesChanged.subscribe(() => {
      this.bgAudio = this.theme.hasAudio('bgm.mp3');
    }));
    this.subscriptions.push(this.theme.volumeChanged.subscribe(()=>{
      if(this.muted && this.theme.volume != 0){
        this.muted = false;
        this.oldVolume = this.theme.volume;
      }
      else if(!this.muted && this.theme.volume == 0){
        this.muted = true;
        this.oldVolume = 20;
      }
    }));
    this.subscriptions.push(this.theme.themeChanged.subscribe(() => {
      if(this.theme.config == undefined || this.theme.folder == undefined){
        this.themeFolder = undefined;
        this.config = undefined;
        this.originalConfig = undefined;
        this.changesMade = false;
        this.themeReady = false;
        this.bgAudio = false;
        this.router.navigate(['/']);
      }
      else {
        this.parseConfig(this.theme.config);
        this.themeFolder = this.theme.folder;
        setTimeout(() => {
          var proms = [];

          proms.push(this.parseFonts());
          proms.push(this.parseImages());

          Promise.all(proms).then(() => {
            this.bgAudio = this.theme.hasAudio('bgm.mp3');
            this.originalConfig = JSON.stringify(this.config);
            this.themeReady = true;
          })
        })
      }
    }));
  }

  parseImages(){
    return new Promise<void>((res, rej) => {
      var proms = [];
      var allowed = ['.png', '.jpg', '.jpeg', '.gif'];

      if(this.themeFolder){
        try {
          this.electron.fs.readdirSync(`${this.themeFolder}/skin`).forEach(tmp => {
            var ext = this.electron.path.extname(tmp).trim().toLowerCase();
            if(allowed.indexOf(ext) >= 0){
              proms.push(new Promise<void>((resolve, reject) => {
                var img = new window.Image();
                const contents = this.electron.fs.readFileSync(`${this.themeFolder}/skin/${tmp}`, {encoding: 'base64'});
                img.onload = () => {
                  resolve();
                }
                img.onerror = (err) => {
                  reject();
                }
                img.src = 'data:image/*;base64,'+contents;
              }))
            }
          });
        } catch(err){
          rej(err);
        }
      }

      Promise.all(proms).then(() => {
        res();
      }, err => {
        rej();
      })
    })
  }

  parseFonts(){
    return new Promise<void>((res, rej) => {
      if(this.theme && this.theme.config){
        var fonts = [];
        var proms = [];
        Object.keys(this.theme.config).forEach(key => {
          if(typeof this.theme.config[key] == 'object' && this.theme.config[key].font != undefined && fonts.indexOf(this.theme.config[key].font) < 0){
            proms.push(new Promise<void>((resolve, reject) => {
              try {
                var src = this.theme.config[key].font;
                var tmp = src.split(".", 2);
                var name = tmp[0];
                var type = tmp[1];

                fonts.push(src);
                let font = new (window as any).FontFace(name, this.theme.getFont(src));
                font.load().then(function(loadedFont) {
                  (document as any).fonts.add(loadedFont);
                  resolve();
                }).catch(function(error) {
                  resolve();
                });
              } catch(err) {
                reject();
              }
            }));
          }
        })

        Promise.all(proms).then(() => {
          Object.keys(this.theme.config).forEach(key => {
            if(typeof this.theme.config[key] == 'object' && this.theme.config[key].font != undefined){
              var option = this.theme.config[key];
              var src = option.font;
              var tmp = src.split(".", 2);
              var name = tmp[0];
              var className = name.replace(/[^a-zA-Z0-9]/g, '-');

              switch(key){
                case 'grid':
                this.addClasses([
                  {
                    name: 'rowFont',
                    styles: `font-family: ${name}; font-size: ${option.grid1x4}px; color: ${option.color}`
                  },{
                    name: 'rowFont',
                    modifier: '.selected',
                    styles: `color: ${option.selectedcolor}`
                  },{
                    name: 'gridFont',
                    styles: `font-family: ${name}; font-size: ${option.grid3x4}px; color: ${option.color}`
                  },{
                    name: 'gridFont',
                    modifier: '.selected',
                    styles: `color: ${option.selectedcolor}`
                  }
                ]);
                break;

                case 'hint':
                this.addClasses([
                  {
                    name: 'tipsFont',
                    styles: `font-family: ${name}; font-size: ${option.size}px; color: ${option.color}`
                  }
                ]);
                break;

                case 'list':
                this.addClasses([
                  {
                    name: 'listFont',
                    styles: `font-family: ${name}; font-size: ${option.size}px; color: ${option.color}`
                  },{
                    name: 'listFontSelected',
                    styles: `color: ${option.selectedcolor}`
                  }
                ]);
                break;

                case 'title':
                this.addClasses([
                  {
                    name: 'titleFont',
                    styles: `font-family: ${name}; font-size: ${option.size}px; color: ${option.color}`
                  }
                ]);
                break;
              }
            }
          })
          res();
        }, err => {
          rej();
        });
      }
      else {
        res();
      }
    })
  }

  addClass(name, styles){
    var className = name.replace(/[^a-zA-Z0-9]/g, '-');
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.${className} { ${styles} }`;
    document.getElementsByTagName('head')[0].appendChild(style);
    return className;
  }
  addClasses(items){
    var inner = "";
    items.forEach(item => {
      var className = item.name.replace(/[^a-zA-Z0-9]/g, '-');
      var modifier = item.modifier ? item.modifier : '';
      inner = inner + `
.${className} ${modifier} { ${item.styles} }`;
    })
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = inner;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    })
  }

  drag(e) {
    this.dragOver = true;

    e.preventDefault();
    e.stopPropagation();
  }
  detectChanges(){
    try {
      this.cd.detectChanges();
    } catch(err){}
  }
  checkTheme(themeDir){
    return new Promise((resolve, reject) => {
      if(this.electron.fs.lstatSync(themeDir).isDirectory()){
        var configFound = false;
        var skinFound = false;
        this.electron.fs.readdirSync(themeDir).forEach(tmp => {
          if(tmp.toLowerCase() == 'skin') skinFound = true;
          if(tmp.toLowerCase() == 'config.json') configFound = true;
        })
        if(configFound && skinFound){
          resolve(themeDir.replace(/\/$/, ""));
        }
        else if(!configFound && !skinFound){
          reject(`No 'config.json' or 'skin' folder found`);
        }
        else if(!skinFound){
          reject(`No 'skin' folder found`);
        }
        else {
          reject('No config.json found');
        }
        //
      }
      else {
        reject('Must be directory or contents of a directory');
      }
    })
  }
  dropFiles(e) {
    this.dragOver = false;
    e.preventDefault();
    var checkTheme = new Promise((resolve, reject) => {
      var files = Array.from(e.dataTransfer.files);
      if(files.length == 1){
        var file:any = files[0];
        var themeDir:any = file.path;
        if(this.electron.fs.lstatSync(themeDir).isDirectory()){
          var configFound = false;
          var skinFound = false;
          this.electron.fs.readdirSync(themeDir).forEach(tmp => {
            if(tmp.toLowerCase() == 'skin') skinFound = true;
            if(tmp.toLowerCase() == 'config.json') configFound = true;
          })
          if(configFound && skinFound){
            resolve(themeDir.replace(/\/$/, ""));
          }
          else if(!configFound && !skinFound){
            reject(`No 'config.json' or 'skin' folder found`);
          }
          else if(!skinFound){
            reject(`No 'skin' folder found`);
          }
          else {
            reject(`No 'config.json' found`);
          }
          //
        }
        else {
          reject('Must be directory or contents of a directory');
        }
      }
      else {
        var configFound = false;
        var skinFound = false;
        var themeDir:any = "";
        files.forEach((file:any) => {
          if(this.electron.path.basename(file.path) == 'skin') skinFound = true;
          if(this.electron.path.basename(file.path) == 'config.json') {
            configFound = true;
            themeDir = file.path.replace('config.json' , '');
          }
        })
        if(configFound && skinFound){
          resolve(themeDir.replace(/\/$/, ""));
        }
        else if(!configFound && !skinFound){
          reject(`No 'config.json' or 'skin' folder found`);
        }
        else if(!skinFound){
          reject(`No 'skin' folder found`);
        }
        else {
          reject(`No 'config.json' found`);
        }
      }
    })

    checkTheme.then((themeDir) => {
      var config = JSON.parse(this.electron.fs.readFileSync(`${themeDir}/config.json`, 'utf8'));
      var folder = themeDir;

      setTimeout(() => {
        this.theme.changeTheme({folder: folder, config: config});
      })
    }, err => {
      this.displayError(err);
    })
  }
}
