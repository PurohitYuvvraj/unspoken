const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getEntries: () => ipcRenderer.invoke('get-entries'),
  addEntry: (entry) => ipcRenderer.invoke('add-entry', entry),
  deleteEntry: (id) => ipcRenderer.invoke('delete-entry', id),
});