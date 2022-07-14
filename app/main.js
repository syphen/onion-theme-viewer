"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var url = require("url");
var win = null;
var image = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    require('@electron/remote/main').initialize();
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    var width = 1200;
    var height = 800;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: (size.width - width) / 2,
        y: (size.height - height) / 2,
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
        electron_1.protocol.registerFileProtocol("video", function (request, cb) {
            var pathname = request.url.replace("video://", "");
            cb({ path: pathname });
        });
        electron_1.protocol.registerFileProtocol("file", function (request, cb) {
            var pathname = decodeURI(request.url.replace("file://", ""));
            cb({ path: pathname });
        });
    }
    else {
        // Path when running electron executable
        var pathIndex = './index.html';
        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }
        electron_1.protocol.registerFileProtocol("video", function (request, cb) {
            var pathname = request.url.replace("video://", "");
            cb({ mimeType: "video/mp4", path: pathname });
        });
        electron_1.protocol.registerFileProtocol("file", function (request, cb) {
            var pathname = decodeURI(request.url.replace("file://", ""));
            cb({ path: pathname });
        });
        win.loadURL(url.format({
            pathname: path.join(__dirname, pathIndex),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
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
    electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
    if (serve) {
        image = electron_1.nativeImage.createFromPath(path.join(__dirname, '../src/assets/icon.png'));
    }
    else {
        image = electron_1.nativeImage.createFromPath(path.join(__dirname, '../dist/assets/icon.png'));
    }
    if (process.platform == 'darwin') {
        electron_1.app.dock.setIcon(image);
    }
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
    electron_1.ipcMain.on('watch', function (e, data) {
    });
    electron_1.ipcMain.on('menu', function (e, data) {
        var menu = new electron_1.Menu();
        data.forEach(function (item) {
            menu.append(new electron_1.MenuItem(item));
        });
        //console.log(data, e.sender.);
        // Append more menu items…
        menu.popup();
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map