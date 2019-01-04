ipc = require('electron').ipcRenderer;

window.onload = init();

function init() {
  ipc.send('onFindChaKey');
}

ipc.on('ErrMsg', function (event, ErrMsg) {
  console.log(ErrMsg);
  if (ErrMsg == 'ChaKey was out of system.'){
  	window.location.hash = '#!/';
  }
})

function displayOnDevice(first_line, second_line){
	ipc.send('onShowAddressBnt', first_line, second_line);
}


// 			!!!!!IMPORTANT!!!!
// 			REFACTOR THIS CODE
function openNav() {
  document.getElementById("app-navbar").style.width = "300px";
}

function closeNav() {
  document.getElementById("app-navbar").style.width = "0px";
}


$(document).ready(function () {
  $(document).on("click", '#landing-hide-btn', function () {
    $(".landing-page").hide();
  });
});
// 			!!!!!IMPORTANT!!!!