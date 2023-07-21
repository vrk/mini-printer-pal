const form = document.querySelector("form");

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const { destination } = data;
    if (destination === "topng") {
      window.electron.ipcRenderer.sendMessage('print-to-png');
      window.electron.ipcRenderer.sendMessage('close-print-dialog');
    } else {
      window.electron.ipcRenderer.sendMessage('print-to-bluetooth', data.get('printer-name'));
      window.electron.ipcRenderer.sendMessage('close-print-dialog');
    }
  },
  false,
);

const cancel = document.getElementById('cancel-btn');
cancel.addEventListener('click', (event) => {
  event.preventDefault();
  window.electron.ipcRenderer.sendMessage('close-print-dialog');
})

document.addEventListener("keydown", function(event) {
  const key = event.key; // Or const {key} = event; in ES6+
  if (key === "Escape") {
    window.electron.ipcRenderer.sendMessage('close-print-dialog');
  }
});

const optionPlaceholder = document.getElementById("option-placeholder");
window.electron.ipcRenderer.on('new-device', (devices) => {
  const selectElement = document.getElementById("select-printer");
  for (const deviceName of devices) {
    const option = document.createElement('option');
    option.innerHTML = deviceName;
    option.value = deviceName;
    if (deviceName.toLowerCase().startsWith("m0")) {
      option.selected = true;
      selectElement.prepend(option)
      optionPlaceholder.innerHTML = "other devices:";
    } else {
      option.selected = false;
      selectElement.append(option)
    }
  }
});

const selectElement = document.getElementById("select-printer");
const radioButtons = document.querySelectorAll('input[name="destination"]');
for (const radioButton of radioButtons) {
  const lastSelected = localStorage.getItem("last-selected-input");
  if (lastSelected && lastSelected == radioButton.value) {
    radioButton.checked = true;
    selectElement.disabled = radioButton.value !== "toprinter";
  }
  radioButton.addEventListener("click", () => {
    localStorage.setItem("last-selected-input", radioButton.value);
    if (radioButton.value === "toprinter") {
      selectElement.disabled = false;
    } else {
      selectElement.disabled = true;
    }
  })
}
