const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'VyomAi Dashboard',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false, // Don't show until ready-to-show
  });

  // Load the Next.js local server
  mainWindow.loadURL('http://localhost:3000');

  // Once loaded, show the window (prevents white flashing)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // mainWindow.maximize(); // Optional: start maximized
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// When Electron is ready, create the window
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
