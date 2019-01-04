// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {shell} = require('electron');

openLink = function(link){
	shell.openExternal(link);
};

window.onload = function(){
	setTimeout(function(){
		console.log = (function (old_function, div_log) { 
	    return function (text) {
	        old_function(text);
	        if (div_log){
	        	div_log.innerHTML += '\n'+JSON.stringify(text);
	        }
	    };
		} (console.log.bind(console), document.getElementById("console-log")));
	}, 2000);
};