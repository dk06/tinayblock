// Config all coins details for two configurations: DEV and PROD
var Coins = {
	DEV: {
		BTC: {
			name: 'Bitcoin', 
			symbol: 'BTC', 
			bip_44_code: '0',
			library: 'W3Bitcoin',
			has_own_generate_root: true,
			wallet: {	"privateKey":"cPTdes3aAr2zUBPWsKzv6B6NQq1WKg84nQz3oChP2xLYtgRa1Cse",
								"publicKey":"2N6zfNLnYd52jmKD9eF6haPjETEs9e25zrB"},
			form_fields: {
				send: [
					{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
					{ key: 'value', name: 'Amount', default: '', unit: 'BTC' },
					{ key: 'fee', name: 'Transaction Fee', default: '0.000678', unit: '' }
				]
			}
		},

		ETH: {
			name: 'Ether', 
			symbol: 'ETH', 
			bip_44_code: '60',
			library: 'W3Ether',
			wallet: {	"privateKey":"2C017C8F07E4FC1B010F3ABBA59E11634B1D88D9431207CB77733C401EB90360",
								"publicKey":"0x366d1dd8558B59398439a01fb6935F6f40EBCD60"},
			form_fields: {
				send: [
					{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
					{ key: 'value', name: 'Amount', default: '', unit: 'ETH' },
					{ key: 'gasPrice', name: 'Gas Price', default: '1', unit: '' },
					{ key: 'gasLimit', name: 'Gas Limit', default: '21000', unit: '' }
				]
			}
		}

		// BCH: {
		// 	name: 'Bitcoin Cash', 
		// 	symbol: 'BCH', 
		// 	bip_44_code: '145',
		// 	library: 'W3BitcoinCash',
		// 	has_own_generate_root: true,
		// 	wallet: {	"privateKey":"cRr2FLe1sCvKt9cmmx6ZfEFsjKStQLmKHLMHLaz4VHeJGPJXeHAM",
		// 						"publicKey":"bchtest:qr3l7nzxxthrvzucgm2l66ld9xt42a8apullqlwjhy", 
		// 						"legacyAddress": "n2JVX1dx1A933zzwFNWhgjqGYnXympvqh7"},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'BCH' },
		// 			{ key: 'fee', name: 'Transaction Fee', default: '0.001', unit: '' }
		// 		]
		// 	}
		// },

		// IOTA: {
		// 	name: 'IOTA',
		// 	symbol: 'IOTA',
		// 	bip_44_code: '888',
		// 	library: 'W3Iota',
		// 	has_own_generate_root: false,
		// 	rateUrl: 'https://www.okex.com/api/v1/ticker.do?symbol=iota_usdt',
		// 	provider: 'https://nodes.testnet.iota.org:443',
		// 	devNetUrl: 'https://devnet.thetangle.org/transaction/',
		// 	wallet: {	"privateKey":"IAY9KWLMMELYRJKSVZOEEKJQTOSNKAFLYWEMUZLYDMX9YGOFDPPAUNUIASHLYXFMGDGFQGIMCLBMKR9EMDHENY9JX9LVBJXFRWYYGEQZUVFI",
		// 						"publicKey":"GBQNWTP9VVGHDAWHQMGLL9HCBDHUWMKFJRKRBVLMVHIDVMQIBPFVLZXGNAJYAZZRDRYODIJLX9DC9ZEMD"},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'IOTA' }
		// 		]
		// 	}
		// },

		// LTC: {
		// 	name: 'Litecoin',
		// 	symbol: 'LTC',
		// 	bip_44_code: '2',
		// 	library: 'W3LiteCoin',
		// 	has_own_generate_root: false,
		// 	rateUrl: 'https://www.okex.com/api/v1/ticker.do?symbol=ltc_usdt',
		// 	provider: '',
		// 	devNetUrl: '',
		// 	wallet: {	"privateKey":"",
		// 						"publicKey":""},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'LTC' }
		// 		]
		// 	}
		// }
	},

	PROD: {
		BTC: {
			name: 'Bitcoin', 
			symbol: 'BTC', 
			bip_44_code: '0',
			library: 'W3Bitcoin',
			has_own_generate_root: true,
			wallet: {	"privateKey":"cNStKLtwPbcg46tVXakvjHYvper1cyG38Q5wr7ryrUJGs8R9tb38",
								"publicKey":"muv8JgWmTtCfQNswQn6xN7PvugyHQMvN7v"},
			form_fields: {
				send: [
					{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
					{ key: 'value', name: 'Amount', default: '', unit: 'BTC' },
					{ key: 'fee', name: 'Transaction Fee', default: '0.000678', unit: '' }
				]
			}
		},

		ETH: {
			name: 'Ether', 
			symbol: 'ETH', 
			bip_44_code: '60',
			library: 'W3Ether',
			wallet: {	"privateKey":"986f881c1d513aa7d0ede27705a7cf6e02e6e0cb50b05ea09f000c562a666468",
								"publicKey":"0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba"},
			form_fields: {
				send: [
					{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
					{ key: 'value', name: 'Amount', default: '', unit: 'ETH' },
					{ key: 'gasPrice', name: 'Gas Price', default: '1', unit: '' },
					{ key: 'gasLimit', name: 'Gas Limit', default: '21000', unit: '' }
				]
			}
		}

		// BCH: {
		// 	name: 'Bitcoin Cash', 
		// 	symbol: 'BCH', 
		// 	bip_44_code: '145',
		// 	library: 'W3BitcoinCash',
		// 	has_own_generate_root: true,
		// 	wallet: {	"privateKey":"cRr2FLe1sCvKt9cmmx6ZfEFsjKStQLmKHLMHLaz4VHeJGPJXeHAM",
		// 						"publicKey":"bchtest:qr3l7nzxxthrvzucgm2l66ld9xt42a8apullqlwjhy", 
		// 						"legacyAddress": "n2JVX1dx1A933zzwFNWhgjqGYnXympvqh7"},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'BCH' },
		// 			{ key: 'fee', name: 'Transaction Fee', default: '0.001', unit: '' }
		// 		]
		// 	}
		// },

		// IOTA: {
		// 	name: 'IOTA',
		// 	symbol: 'IOTA',
		// 	bip_44_code: '4218',
		// 	library: 'W3Iota',
		// 	has_own_generate_root: false,
		// 	rateUrl: 'https://www.okex.com/api/v1/ticker.do?symbol=iota_usdt',
		// 	provider: 'https://nodes.testnet.iota.org:443',
		// 	devNetUrl: 'https://devnet.thetangle.org/transaction/',
		// 	wallet: {	"privateKey":"IAY9KWLMMELYRJKSVZOEEKJQTOSNKAFLYWEMUZLYDMX9YGOFDPPAUNUIASHLYXFMGDGFQGIMCLBMKR9EMDHENY9JX9LVBJXFRWYYGEQZUVFI",
		// 						"publicKey":"GBQNWTP9VVGHDAWHQMGLL9HCBDHUWMKFJRKRBVLMVHIDVMQIBPFVLZXGNAJYAZZRDRYODIJLX9DC9ZEMD"},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'IOTA' }
		// 		]
		// 	}
		// },

		// LTC: {
		// 	name: 'Litecoin',
		// 	symbol: 'LTC',
		// 	bip_44_code: '2',
		// 	library: 'W3LiteCoin',
		// 	has_own_generate_root: false,
		// 	rateUrl: 'https://www.okex.com/api/v1/ticker.do?symbol=ltc_usdt',
		// 	provider: '',
		// 	devNetUrl: '',
		// 	wallet: {	"privateKey":"",
		// 						"publicKey":""},
		// 	form_fields: {
		// 		send: [
		// 			{ key: 'to', name: 'Recipient Address', default: '', unit: ''},
		// 			{ key: 'value', name: 'Amount', default: '', unit: 'LTC' }
		// 		]
		// 	}
		// }
	}
};

// Load all coins config as per environment and export to app
var CoinList = Coins[TINYENV.mode];

try{
	module.exports = CoinList;
}
catch(error){
	console.warn(error);
}