const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

// 1. Establish SQLite Connection in Safe App Data path
const dbPath = path.join(app.getPath('userData'), 'unsent-letters.db');

function initDatabase() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection failed:', err);
  });

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_name TEXT,
        message TEXT NOT NULL,
        emotion TEXT,
        color TEXT,
        tags TEXT,
        is_favorite INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load local build or dev environment server
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

// 2. IPC Channel Setup for Database CRUD
ipcMain.handle('get-entries', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM entries ORDER BY id DESC', [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
});

ipcMain.handle('add-entry', async (event, entry) => {
  const { recipient, message, emotion, color, tags } = entry;
  const timestamp = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO entries (recipient_name, message, emotion, color, tags, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [recipient, message, emotion, color, tags, timestamp],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
});

ipcMain.handle('delete-entry', async (event, id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM entries WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});