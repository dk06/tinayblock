const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
// const {autoUpdater, dialog } = require('electron');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
// Module to control application life.
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let template = [];
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const server = 'https://github.com/dk06/tinayblock'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
autoUpdater.setFeedURL(feed)

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/index.html`);
  return win;
}


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});


// setInterval(() => {
//   // autoUpdater.checkForUpdates()
// }, 60000)

// var ServerChaKey=require('./ServerChaKey.js');

// function createWindow () {
//  // autoUpdater.checkForUpdates()

//   // Create the browser window.
//   mainWindow = new BrowserWindow({width:2000, height: 900})

//   // and load the index.html of the app.
//   mainWindow.loadURL(`file://${__dirname}/index.html`)

 
//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()
//  mainWindow.webContents.openDevTools()
//  autoUpdater.checkForUpdates();

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     ServerChaKey.mIChaKey.CloseChaKey();
//     mainWindow = null
//   })
// }



// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
  
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.

// // autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
// //   const dialogOpts = {
// //     type: 'info',
// //     buttons: ['Restart', 'Later'],
// //     title: 'Application Update',
// //     message: process.platform === 'win32' ? releaseNotes : releaseName,
// //     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
// //   }

// //   dialog.showMessageBox(dialogOpts, (response) => {
// //     if (response === 0) autoUpdater.quitAndInstall()
// //   })
// // })

// // autoUpdater.on('error', message => {
// //   console.error('There was a problem updating the application')
// //   console.error(message)
// // })

// let win;

// function sendStatusToWindow(text) {
//   log.info(text);
//   // win.webContents.send('message', text);
// }

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//   sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.');
// })
// autoUpdater.on('error', (err) => {
//   sendStatusToWindow('Error in auto-updater. ' + err);
// })
// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// })
// autoUpdater.on('update-downloaded', (info) => {
//   sendStatusToWindow('Update downloaded');
// });