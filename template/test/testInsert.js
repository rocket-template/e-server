/**
 * Created by zhangmike on 16/8/22.
 */
function insertReturn(text){
	var newText = text;
	for (var i = 0,length = newText.length; i < length; i++){
		if (i % 3 === 0){
			newText = newText.substring(0, i) + "\n" + newText.substring(i, newText.length);
		}
	}
	return newText;
};

//console.log(insertReturn("abcdefjhijk"))
var pfMap = {};
var b = [
	{
		a1:{
			advice:1,
			b:2
			}
	},
	{
		b1:{
			advice:"按时交电费看来就爱上了看见对方立刻就爱是快乐的解放了会计师的,\n撒的发生的发生了",
			b:3
		}

	},{
		b1:{
			advice:"按时交电费看来就爱上了看见对方立刻就爱是快乐的解放了会计师的,\n撒的发生的发生了",
			b:3
		}

	},{
		b2:{
			advice:2,
			b:4
		}
	}
];
var cx = [];
b.forEach(function(c){
	Object.keys(c).forEach(function(key){
		if (!pfMap[key]) {
			pfMap[key] = c[key].advice
		}else {
			console.log("performance...",pfMap[key] === c[key].advice)
			if (pfMap[key] === c[key].advice) {
				return;
			}
		}
		var obj = [];
		obj[0] = c[key].advice;
		obj[1] = c[key].b;
		cx.push(obj);
	});
})
console.log(cx)