var TINYENV = {
	mode: "DEV", // "PROD" or "DEV", do not change this and use at it is
	DEV: {
		envName: "Development"
	},
	PROD: {
		envName: "Production"
	}
}

console.log('THE APP IS RUNNNING IN ' + TINYENV.mode + ' mode.');