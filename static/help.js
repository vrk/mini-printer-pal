const close = document.getElementById('close-btn');
close.addEventListener('click', (event) => {
  event.preventDefault();
  window.electron.ipcRenderer.sendMessage('close-modal-dialog');
})

document.addEventListener("keydown", function(event) {
  const key = event.key; // Or const {key} = event; in ES6+
  if (key === "Escape") {
    window.electron.ipcRenderer.sendMessage('close-modal-dialog');
  }
});