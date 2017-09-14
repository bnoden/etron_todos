const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 420
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 130,
    title: 'New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => (addWindow = null));
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear First',
        accelerator: process.platform === 'darwin' ? 'Command+1' : 'Ctrl+1',
        click() {
          mainWindow.webContents.send('todo:clearfirst');
        }
      },
      {
        label: 'Clear Last',
        accelerator: process.platform === 'darwin' ? 'Command+Z' : 'Ctrl+Z',
        click() {
          mainWindow.webContents.send('todo:clearlast');
        }
      },
      {
        label: 'Clear All',
        click() {
          mainWindow.webContents.send('todo:clearall');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'DEBUG',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'F12',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        label: 'Reload',
        accelerator: process.platform === 'darwin' ? 'Command+R' : 'Ctrl+R',
        click(item, app) {
          app.reload();
        }
      }
    ]
  });
}
