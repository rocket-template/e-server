import errors   from '../../error';


let
queryRecords = async function(data, model, option){
    try{
        let aggregate = option;

        let count = model.aggregate(aggregate);

        count = await count.exec();

        let countTotal = count.length > 0 ? count[0].count : 0;
        return errors.success({
            countTotal
        });
    }catch(err){
        return errors.format(err);
    }
};

export default async function(data,model, option){

    try {
        let res = await queryRecords(data, model, option);
        return res;
    } catch(err) {
        return err;
    }
};

