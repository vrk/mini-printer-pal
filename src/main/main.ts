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
let printDialog: BrowserWindow | null = null;

type Devices = {
  [key: string]: noble.Peripheral;
};
  
let discoveredDevices: Devices = {};

type Characteristics= {
  [key: string]: noble.Characteristic;
};
let discoveredCharacteristics: Characteristics = {};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});


let printfileData: number[] | null = null;
ipcMain.on('print-file', async (event, data: number[]) => {
  printfileData = data;
  createPrintDialog();
})

ipcMain.on('print-to-png', async () => {
  console.log('TODO: print to png');
});

function getInitPrintData() {
  let printData = [];
  let index = 0;

  // ********
  // FROM https://github.com/vivier/phomemo-tools/tree/master#31-header
  // PRINTING HEADER

  // Initialize printer
  printData[index++] = 27;
  printData[index++] = 64;

  // Select justification
  printData[index++] = 27;
  printData[index++] = 97;

  // Justify (0=left, 1=center, 2=right)
  printData[index++] = 0;

  // End of header
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 2;
  printData[index++] = 4;
  // ********


  printData[index++] = 29
  printData[index++] = 118
  printData[index++] = 48

  // Mode: 0=normal, 1=double width, 2=double height, 3=quadruple
  printData[index++] = 0

  // Bytes per line
  printData[index++] = 70
  printData[index++] = 0

  // Number of lines to print in this block.
  printData[index++] = 10;
  printData[index++] = 0

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 70; x++) {
      printData[index++] = 0;
    }
  }
  
  printData[index++] = 27;
  printData[index++] = 100;
  printData[index++] = 2;

  // FOOTER
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 8;
  // \x1f\x11\x0e
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 14;

  // x1f\x11\x07
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 7;
  return printData;
}

ipcMain.on('print-to-bluetooth', async (event, deviceName) => {
  console.log(deviceName);
  if (!printfileData || !deviceName) {
    return;
  }
  if (!discoveredCharacteristics[deviceName]) {
    discoveredCharacteristics[deviceName] = await getWritableCharacteristic(discoveredDevices[deviceName]);
  }
  const copiedData = [...printfileData];
  printfileData = null;
  // discoveredCharacteristics[deviceName].write(Buffer.from(getInitPrintData()), false, (error: string) => {
    discoveredCharacteristics[deviceName].write(Buffer.from(copiedData), false, (error: string) => {
    });
  // });
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

ipcMain.on("close-print-dialog", async (event, arg) => {
  if (!printDialog) {
    return;
  }
  printDialog.close();
  printDialog = null;
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
  if (mainWindow) {
    return;

  } 
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

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

const createPrintDialog = () => {
  if (!mainWindow) {
    return;
  }

  printDialog = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    backgroundColor: 'white', 
    width: 457,
    height: 360,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  printDialog.loadURL(resolveHtmlPath('select-printer.html'));

  printDialog.on('ready-to-show', () => {
    printDialog?.show();
    printDialog?.webContents.send('new-device', Object.keys(discoveredDevices));
    noble.on('discover', async (peripheral) => {
      const { localName } = peripheral.advertisement;
      if (localName === undefined || localName.trim().length === 0) {
        return;
      }
      if (!discoveredDevices[localName]) {
        printDialog?.webContents.send('new-device', [localName]);
      }
      discoveredDevices[localName] = peripheral;
    });
    noble.startScanningAsync();
  });


  printDialog.on('closed', async () => {
    await noble.stopScanningAsync();
    printDialog = null;
  });
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
