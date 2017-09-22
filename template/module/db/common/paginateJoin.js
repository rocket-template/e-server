
import  mongoose from 'mongoose';
import errors   from '../../error';

//exclude password
let formatRequestParams = async function(data){
    data.select  = data.select || '';
    data.limit = parseInt(data.limit)||10;
    data.limit   = data.limit < 1 ? 10 : data.limit > 100 ? 100 : data.limit;
    data.page    = data.page  < 1 ? 1  : data.page;
    data.skip    = data.skip  < 0 ? 0  : data.skip;

    return data;
};

let queryRecords = async function(data, option, srcModel, status){
    try {
        data = await formatRequestParams(data);
    } catch(err) {
        return err;
    }

    try {
        let aggregate = option;

        let query = srcModel.aggregate(aggregate);
        query = await query.exec();
        return errors.success({
            limit : data.limit,
            page  : data.page,
            skip  : data.skip,
            result  : query
        });
    }catch(err){
        console.log(err);
        return errors.format(err);
    }
};

export default async function(data,option, model,status = [1]){

    try {
        let  res = await queryRecords(data, option, model, status);
        return res;
    } catch(err) {
        return err;
    }
};
