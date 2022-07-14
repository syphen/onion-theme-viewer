import { app, screen, protocol, ipcMain, Menu, BrowserWindow, MenuItem, NativeImage, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as chokidar from 'chokidar';

let win: BrowserWindow = null;
let image: NativeImage = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
  require('@electron/remote/main').initialize();

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  const width = 1200;
  const height = 800;

  // Create the browser window.
  win = new BrowserWindow({
    x: (size.width - width)/2,
    y: (size.height - height)/2,
    width: width,
    height: height,
    minWidth: 800,
    minHeight: 600,
    icon: image,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      webSecurity: false,
      allowRunningInsecureContent: (serve) ? true : false
    },
  });

  require("@electron/remote/main").enable(win.webContents);

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4400');
    protocol.registerFileProtocol("video", (request, cb) => {
      const pathname = request.url.replace("video://", "");
      cb({ path: pathname });
    });
    protocol.registerFileProtocol("file", (request, cb) => {
      const pathname = decodeURI(request.url.replace("file://", ""));
      cb({ path: pathname });
    });
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }
    protocol.registerFileProtocol("video", (request, cb) => {
      const pathname = request.url.replace("video://", "");
      cb({ mimeType: "video/mp4", path: pathname });
    });
    protocol.registerFileProtocol("file", (request, cb) => {
      const pathname = decodeURI(request.url.replace("file://", ""));
      cb({ path: pathname });
    });
    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  if (serve) {
    image = nativeImage.createFromPath(
      path.join(__dirname, '../src/assets/icon.png')
    );
  } else {
    image = nativeImage.createFromPath(
      path.join(__dirname, '../dist/assets/icon.png')
    );
  }
  if(process.platform == 'darwin'){
    app.dock.setIcon(image);
  }

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('watch', (e, data) => {

  })

  ipcMain.on('menu', (e, data) => {
    const menu = new Menu();

    data.forEach(item => {
      menu.append(new MenuItem(item));
    });

    //console.log(data, e.sender.);

    // Append more menu items…

    menu.popup();
  });

} catch (e) {
  // Catch Error
  // throw e;
}
