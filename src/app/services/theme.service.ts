import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  folder;
  config;
  parsedConfig;
  watcher;
  brightness:any = 10;
  volume:any = 20;
  fileChanged = 0;
  error:any;

  changes: Subject<any> = new Subject();
  files: Subject<any> = new Subject();
  volumes: Subject<any> = new Subject();
  brightnesses: Subject<any> = new Subject();

  constructor(
    private electron: ElectronService
  ) {}

  getFont(src){
    return this.electron.fs.readFileSync(`${this.folder}/${src}`);
  }

  getAudio(name){
    return `file://${this.folder}/sound/${name}?t=${this.fileChanged}`;
  }
  hasAudio(name){
    return this.electron.fs.existsSync(`${this.folder}/sound/${name}`);
  }

  getImage(name, override = false){
    if(this.hasImage(name)){
      return `file://${this.folder}/skin/${name}.png?t=${this.fileChanged}`;
    }
    else if(override) {
      return `./assets/default/${name}.png?t=${this.fileChanged}`;
    }
    else {
      return '';
    }
  }
  hasImage(name){
    return this.electron.fs.existsSync(`${this.folder}/skin/${name}.png`);
  }

  changeBrightness(brightness, update = true){
    return new Promise<void>((resolve, reject) => {
      this.brightness = brightness;
      if(update) this.brightnesses.next(brightness);
      resolve();
    })
  }

  changeVolume(volume, update = true){
    return new Promise<void>((resolve, reject) => {
      this.volume = volume;
      if(update) this.volumes.next(volume);

      var app = this.electron.remote.app;
      var userPath = app.getPath("userData");

      try {
        if(this.electron.fs.existsSync(`${userPath}/lastVolume.txt`)) this.electron.fs.unlinkSync(`${userPath}/lastVolume.txt`);
        this.electron.fs.writeFileSync(`${userPath}/lastVolume.txt`, this.volume.toString());
        resolve();
      } catch(err){
        reject(err);
      }
    })
  }

  changeTheme(options:any = {}){
    if(options.folder != undefined){
      if(this.folder != undefined) {
        this.watcher.unwatch(this.folder);
        this.watcher.off('change');
      }

      var app = this.electron.remote.app;
      var userPath = app.getPath("userData");

      if(this.electron.fs.existsSync(`${userPath}/lastDir.txt`)) this.electron.fs.unlinkSync(`${userPath}/lastDir.txt`);
      this.electron.fs.writeFileSync(`${userPath}/lastDir.txt`, options.folder);

      this.folder = options.folder;
      this.watcher = this.electron.chokidar.watch(this.folder, {ignored: /^\./, persistent: true, awaitWriteFinish: true});
      this.watcher.on('change', (path) => {
        this.fileChanged = (new Date()).getTime();
        this.files.next();
      })
    }
    if(options.config != undefined){
      var add:any = {
        name: options.config.name,
        hideIconTitle: false,
        batteryPercentage: {
          visible: false
        }
      };

      if(options.config.batteryPercentage == undefined || options.config.batteryPercentage.red == undefined) add.batteryPercentage.red = 0;
      if(options.config.batteryPercentage == undefined || options.config.batteryPercentage.green == undefined) add.batteryPercentage.green = 0;
      if(options.config.batteryPercentage == undefined || options.config.batteryPercentage.blue == undefined) add.batteryPercentage.blue = 0;

      this.config = {...add, ...options.config};

    }
    this.changes.next();
  }

  cancelTheme(){
    this.config = undefined;
    this.folder = undefined;
    this.changes.next();
  }

  saveTheme(){
    return new Promise((resolve, reject) => {
      if(this.folder && this.config){
        this.electron.fs.writeFile(`${this.folder}/config.json`, JSON.stringify(this.config), (err) => {
          if(err){
            reject(err);
          }
          else {
            resolve('Theme config saved');
          }
        })
      }
      else {
        reject('Theme folder or config cannot be found.')
      }
    })
  }

  parseConfig(config = this.config, returned = false){
    var items = [];
    Object.keys(config).forEach(key => {
      var item:any = {
        key: key
      }
      if(typeof config[key] == 'object'){
        var values = [];
        Object.keys(config[key]).forEach(tmp => {
          var val:any = {
            key: tmp,
            value: this.config[key][tmp]
          }

          if(typeof val.value == 'number' || val.key == 'red' || val.key == 'blue' || val.key == 'blue') val.type = 'number';
          if(val.key == 'red' || val.key == 'blue' || val.key == 'blue') { val.min = 0; val.max = 255; }
          if(typeof val.value == 'boolean') val.type = 'boolean';
          if(typeof val.value == 'string' && val.value.indexOf('#') >= 0) val.type = 'color';
          values.push(val);
        })
        item.values = values;
      }
      else {
        item.value = config[key];
        if(typeof item.value == 'number') item.type = 'number';
        if(typeof item.value == 'boolean') item.type = 'boolean';
      }
      items.push(item);
    })

    this.parsedConfig = items;
    if(returned) return items;
  }

  themeChanged = this.changes.asObservable();
  filesChanged = this.files.asObservable();
  volumeChanged = this.volumes.asObservable();
}
