// const remote = require('remote')

// const MenuItem = remote.require('menu-item')
// const Menu = remote.require('menu')

// module.exports = createMenu

// // create menu
// // null -> null
// function createMenu() {
//   const menu = Menu.buildFromTemplate(menuTempl())
//   Menu.setApplicationMenu(menu)
// }

// // create a menu template
// // null -> obj
// function menuTempl () {
//   const menu = []
//   menu.push({
//     label: 'Electron',
//     submenu: [
//       {
//         label: 'About Electron',
//         selector: 'hide:'
//       }
//     ]
//   })
//   menu.push({
//     label: 'Edit',
//     submenu: [
//       {
//         label: 'Undo',
//         accelerator: 'Command+Z',
//         selector: 'undo:'
//       },
//       {
//         label: 'Redo',
//         accelerator: 'Shift+Command+Z',
//         selector: 'redo:'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: 'Cut',
//         accelerator: 'Command+X',
//         selector: 'cut:'
//       },
//       {
//         label: 'Copy',
//         accelerator: 'Command+C',
//         selector: 'copy:'
//       },
//       {
//         label: 'Paste',
//         accelerator: 'Command+V',
//         selector: 'paste:'
//       },
//       {
//         label: 'Select All',
//         accelerator: 'Command+A',
//         selector: 'selectAll:'
//       },
//     ]
//   })
//   menu.push({
//     label: 'View',
//     submenu: [
//       {
//         label: 'Reload',
//         accelerator: 'Command+R',
//         click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
//       },
//       {
//         label: 'Toggle DevTools',
//         accelerator: 'Alt+Command+I',
//         click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
//       },
//     ]
//   })
//   menu.push({
//     label: 'Window',
//     submenu: [
//       {
//         label: 'Minimize',
//         accelerator: 'Command+M',
//         selector: 'performMiniaturize:'
//       },
//       {
//         label: 'Close',
//         accelerator: 'Command+W',
//         selector: 'performClose:'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: 'Bring All to Front',
//         selector: 'arrangeInFront:'
//       },
//     ]
//   })
//   return menu
// }
// 
// 
const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)