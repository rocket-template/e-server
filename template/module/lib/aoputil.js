
import meld from 'meld';
class User {
    constructor() {

    }
    doSomething(a, b) {
        return ReturnData(a + b);
    }
    getSomething() {
        console.log(123);
    }
}

function ReturnData(data, info , code) {
    return {
        data: data,
        info: info || 'success',
        code: code || 200
    };
}
ReturnData.SUCCESS = 'succss';
ReturnData.FAIL = 'fail';
ReturnData.SUCCESSCODE = 200;

User.prototype = {
    constructor: User,
    doSomething: function(a, b) {
        return ReturnData(a + b);
    },
    getSomething: function () {
        console.log(123);
    }
};
function Branch() {

}
Branch.prototype = {
    constructor: Branch,
    doIt: function(a, b) {
        return ReturnData(a + b);
    },
    getIt: function() {
        1 / 0;

        //return 123;
    }
};

var beans = [User, Branch];
var gb = {};

beans.forEach(function (current) {
    gb[current.name] = new current();
    Object.keys(gb[current.name].__proto__).forEach(function (cur) {
        if (/^do\w+/.test(cur)) {
            meld.after(gb[current.name], cur, function(result) {
                console.info(result.info, result.data);
            });
        }
    })
});

gb['User'].doSomething(1,2);
gb['User'].getSomething();
gb['Branch'].doIt(5,6);