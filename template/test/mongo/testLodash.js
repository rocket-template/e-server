/**
 * Created by zhangmike on 16/8/18.
 */

/*var assign = require('lodash.assign')

var d = assign({url:"aaa"},{
	url:"bbb",
	pageurl:"ccc"
})

console.log(d)*/

var _ = require("lodash");

var obj = {
	"transferSize": {
		"median": "1688917",
		"mean": "1688998",
		"min": "1688886",
		"p10": "1688886",
		"p90": "1689190",
		"p99": "1689190",
		"max": "1689190"
	},
	"contentSize": {
		"median": "1892895",
		"mean": "1892895",
		"min": "1892895",
		"p10": "1892895",
		"p90": "1892895",
		"p99": "1892895",
		"max": "1892895"
	},
	"requests": {
		"median": "68",
		"mean": "68",
		"min": "68",
		"p10": "68",
		"p90": "68",
		"p99": "68",
		"max": "68"
	},
	"contentTypes": {
		"html": {
			"transferSize": {
				"median": "58282",
				"mean": "58282",
				"min": "58282",
				"p10": "58282",
				"p90": "58282",
				"p99": "58282",
				"max": "58282"
			},
			"contentSize": {
				"median": "100746",
				"mean": "100746",
				"min": "100746",
				"p10": "100746",
				"p90": "100746",
				"p99": "100746",
				"max": "100746"
			},
			"requests": {
				"median": "1",
				"mean": "1",
				"min": "1",
				"p10": "1",
				"p90": "1",
				"p99": "1",
				"max": "1"
			}
		},
		"css": {
			"transferSize": {
				"median": "16498",
				"mean": "16495",
				"min": "16490",
				"p10": "16490",
				"p90": "16498",
				"p99": "16498",
				"max": "16498"
			},
			"contentSize": {
				"median": "84585",
				"mean": "84585",
				"min": "84585",
				"p10": "84585",
				"p90": "84585",
				"p99": "84585",
				"max": "84585"
			},
			"requests": {
				"median": "2",
				"mean": "2",
				"min": "2",
				"p10": "2",
				"p90": "2",
				"p99": "2",
				"max": "2"
			}
		},
		"javascript": {
			"transferSize": {
				"median": "71096",
				"mean": "71093",
				"min": "71079",
				"p10": "71079",
				"p90": "71105",
				"p99": "71105",
				"max": "71105"
			},
			"contentSize": {
				"median": "194986",
				"mean": "194986",
				"min": "194986",
				"p10": "194986",
				"p90": "194986",
				"p99": "194986",
				"max": "194986"
			},
			"requests": {
				"median": "6",
				"mean": "6",
				"min": "6",
				"p10": "6",
				"p90": "6",
				"p99": "6",
				"max": "6"
			}
		},
		"image": {
			"transferSize": {
				"median": "1541161",
				"mean": "1541248",
				"min": "1541131",
				"p10": "1541131",
				"p90": "1541452",
				"p99": "1541452",
				"max": "1541452"
			},
			"contentSize": {
				"median": "1511392",
				"mean": "1511392",
				"min": "1511392",
				"p10": "1511392",
				"p90": "1511392",
				"p99": "1511392",
				"max": "1511392"
			},
			"requests": {
				"median": "57",
				"mean": "57",
				"min": "57",
				"p10": "57",
				"p90": "57",
				"p99": "57",
				"max": "57"
			}
		},
		"font": {
			"transferSize": {
				"median": "0",
				"mean": "0",
				"min": "0",
				"p10": "0",
				"p90": "0",
				"p99": "0",
				"max": "0"
			},
			"contentSize": {
				"median": "0",
				"mean": "0",
				"min": "0",
				"p10": "0",
				"p90": "0",
				"p99": "0",
				"max": "0"
			},
			"requests": {
				"median": "0",
				"mean": "0",
				"min": "0",
				"p10": "0",
				"p90": "0",
				"p99": "0",
				"max": "0"
			}
		},
		"plain": {
			"transferSize": {
				"median": "219",
				"mean": "219",
				"min": "219",
				"p10": "219",
				"p90": "219",
				"p99": "219",
				"max": "219"
			},
			"contentSize": {
				"median": "36",
				"mean": "36",
				"min": "36",
				"p10": "36",
				"p90": "36",
				"p99": "36",
				"max": "36"
			},
			"requests": {
				"median": "1",
				"mean": "1",
				"min": "1",
				"p10": "1",
				"p90": "1",
				"p99": "1",
				"max": "1"
			}
		},
		"favicon": {
			"transferSize": {
				"median": "1660",
				"mean": "1660",
				"min": "1660",
				"p10": "1660",
				"p90": "1660",
				"p99": "1660",
				"max": "1660"
			},
			"contentSize": {
				"median": "1150",
				"mean": "1150",
				"min": "1150",
				"p10": "1150",
				"p90": "1150",
				"p99": "1150",
				"max": "1150"
			},
			"requests": {
				"median": "1",
				"mean": "1",
				"min": "1",
				"p10": "1",
				"p90": "1",
				"p99": "1",
				"max": "1"
			}
		}
	},
	"responseCodes": {
		"200": {
			"median": "68",
			"mean": "68",
			"min": "68",
			"p10": "68",
			"p90": "68",
			"p99": "68",
			"max": "68"
		}
	},
	"domains": {
		"median": "13",
		"mean": "13",
		"min": "13",
		"p10": "13",
		"p90": "13",
		"p99": "13",
		"max": "13"
	},
	"expireStats": {
		"median": "2592000",
		"mean": "1814400",
		"min": "0",
		"p10": "604800",
		"p90": "2592000",
		"p99": "2592000",
		"max": "2592000"
	},
	"lastModifiedStats": {
		"median": "334594",
		"mean": "331984",
		"min": "-1",
		"p10": "86743",
		"p90": "492589",
		"p99": "939514",
		"max": "939514"
	}
}

var js = {};
/*function Entity(key){
	this.key = key;
	this.children = [];
}
var entity = new Entity("root");*/
function rev(cx,obj){
	Object.keys(obj).forEach(function(c){
		if (obj[c].max === undefined){
			rev(c,obj[c])
		}else{
			if (cx!=null){
				if (js[cx]){
					js[cx][c] = obj[c].max;
				}else{
					js[cx] = {}
					js[cx][c] = obj[c].max;
				}
			}else{
				js[c] = obj[c].max
			}
		}
	});
};

/*function rev(cx,obj){
	Object.keys(obj).forEach(function(c){
		if (obj[c].max === undefined){
			rev(entity)
		}else{
			if (cx!=null){
				if (js[cx]){
					js[cx][c] = obj[c].max;
				}else{
					js[cx] = {}
					js[cx][c] = obj[c].max;
				}
			}else{
				js[c] = obj[c].max
			}
		}
	});
};*/
rev()

console.log(js);
