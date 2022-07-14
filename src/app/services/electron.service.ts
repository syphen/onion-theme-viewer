import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, BrowserWindow, app, shell } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as chokidar from 'chokidar';
//import DecompressZip from 'decompress-zip';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  browserWindow: typeof BrowserWindow;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  remote: typeof remote;
  fs: typeof fs;
  os: typeof os;
  shell: typeof shell;
  path: typeof path;
  chokidar: typeof chokidar;
  //unzip: typeof DecompressZip;
  app: typeof app;

  menu = (data) => {
    this.ipcRenderer.send('menu', data);
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public console(args?:any){
    this.ipcRenderer.send('CONSOLE', args);
  }

  constructor() {
    try {
      this.path = window.require('path');
      this.os = window.require('os');
      this.fs = window.require('fs');
      this.chokidar = window.require('chokidar');
      console.log(this.chokidar);
      //this.unzip = window.require('decompress-zip');
    } catch(err) {}


    // Conditional imports
    if (this.isElectron) {
      this.app = window.require('electron').app;
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.shell = window.require('electron').shell;

      // If you wan to use remote object, pleanse set enableRemoteModule to true in main.ts
      this.remote = window.require('@electron/remote');

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }
}
