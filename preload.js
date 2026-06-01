const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("chillmemoBridge", {
  setInteractive(interactive) {
    ipcRenderer.send("chillmemo:set-interactive", Boolean(interactive));
  },
});
