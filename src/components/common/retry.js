const ipcRenderer = require('electron').ipcRenderer;

document.getElementById('btn-rtry').addEventListener('click', function() {
    ipcRenderer.send('_rTry');
});