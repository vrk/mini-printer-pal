/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { dialog, app, BrowserWindow, shell, ipcMain,Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import contextMenu from 'electron-context-menu';
import noble from "@abandonware/noble";



contextMenu({
	showSaveImageAs: true
});



const WINDOW_WIDTH_SMALL = 600;
const WINDOW_WIDTH_LARGE = 1100;
const WINDOW_HEIGHT = 800;

const WINDOW_WIDTH_MAIN_MENU = 800;
const WINDOW_HEIGHT_MAIN_MENU = 550;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

let characteristic: noble.Characteristic | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('print-file', async (event, data: number[]) => {
  if (!characteristic) {
    characteristic = await getWritableCharacteristic(discoveredDevices['M02S']);
  }
  characteristic.write(Buffer.from(data), false, (error: string) => {
    console.log('done', error);
  });
})
  
async function getWritableCharacteristic(peripheral: noble.Peripheral) {
  await peripheral.connectAsync();
  const results = await peripheral.discoverAllServicesAndCharacteristicsAsync();
  const { characteristics } = results;
  console.log(results, characteristics);
  const [characteristic] = characteristics.filter(characteristic => { 
    return characteristic.properties.includes('write');
  })
  return characteristic;
}

ipcMain.on('resize-window', async (event, type: string) => {
  if (mainWindow) {
    if (type === "editImage") {
      mainWindow?.center();
      mainWindow.setSize(WINDOW_WIDTH_LARGE, WINDOW_HEIGHT);
    } else if (type === "mainMenu") {
      mainWindow.setSize(WINDOW_WIDTH_MAIN_MENU, WINDOW_HEIGHT_MAIN_MENU);
      mainWindow.center();
    }
  }
});

ipcMain.on("quit", async (event, arg) => {
  app.quit();
});

ipcMain.on("choose-file", async (event, arg) => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png","jpg","jpeg"] }]
  });

  const { canceled, filePaths } = result;
  if (canceled) {
    return;
  }
  const fileData = await fs.promises.readFile(filePaths[0])
  const base64 = fileData.toString('base64');
  event.reply("file-chosen", base64);
});


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  scanDevices();

  mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#d1deb6', 
    width: WINDOW_WIDTH_MAIN_MENU,
    height: WINDOW_HEIGHT_MAIN_MENU,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    // const iconPath = path.join(__dirname, '../../assets/pengy-bigger.png');
    // const appIcon = new Tray(iconPath)
    // const contextMenu = Menu.buildFromTemplate([
    //   { label: 'Item1', type: 'radio' },
    //   { label: 'Item2', type: 'radio' }
    // ]);
  
    // // Make a change to the context menu
    // contextMenu.items[1].checked = false
  
    // // Call this again for Linux because we modified the context menu
    // appIcon.setContextMenu(contextMenu)
  
  })
  .catch(console.log);

type Devices = {
  [key: string]: noble.Peripheral;
};
  
let discoveredDevices: Devices = {};
async function scanDevices(scanDurationInMs=5000) {
  discoveredDevices = {};

  noble.on('discover', async (peripheral) => {
    const { localName } = peripheral.advertisement;
    if (localName === undefined || localName.trim().length === 0) {
      return;
    }
    discoveredDevices[localName] = peripheral;
  });
  noble.startScanningAsync();

  await delay(scanDurationInMs);

  await noble.stopScanningAsync();
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
