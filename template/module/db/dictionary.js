
import constant from '../../config/constants';

let conf={
    name: {
        type : String
    },
    type: {
        type: String
    },
    value: {
        type: Number
    },
    _status:{
        type     : Number,
        default  : 0
    }
}

let statics={
    $getNewPort: async function (opt = {}) {
        return await this.findOneAndUpdate({
            _status: constant.availableStatus,
            type: opt.type,
            name: opt.name
        }, {
            $inc: {
                value: 1
            }
        }).then(data=>{
           return data;
        });
    },
    $create() {
        let model = this;
        let it = new model({
            name: 'NEWPORT',
            type: 'NEWPORT',
            value: 1
        });
        it.save();

    }
};
module.exports= {conf,statics}