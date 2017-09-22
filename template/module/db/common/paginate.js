import errors   from '../../error';

let formatPopulation = async function(data){
    if(!data.population)
        return data;

    for(let key in data.population){
        let
        op = {
            path : key
        };

        if(data.population[key].select)
            op['select'] = data.population[key].select;

        if(data.population[key].options)
            op['options'] = data.population[key].options;

        if(data.population[key].match)
            op['match'] = data.population[key].match;

        data.population[key] = op;
    }

    return data;
};
//exclude password
let formatRequestParams = async function(data){
    data.select  = data.select || '';
    data.limit = parseInt(data.limit)||10;
    data.limit   = data.limit < 1 ? 10 : data.limit > 100 ? 100 : data.limit;
    data.page    = data.page  < 1 ? 1  : data.page;
    data.skip    = data.skip  < 0 ? 0  : data.skip;

    return data;
};

let queryRecords = async function(data, model,status){
    try {
        data = await formatRequestParams(data);
        data = await formatPopulation(data);
    } catch(err) {
        return err;
    }
    let
        trimeddata = data.filter;
    try {
        let  query = model.find(trimeddata);
        let status = data.status
        query = query
            .where('_status').in(status)
            .limit(data.limit)
            .skip(data.limit * (data.page - 1))
            .sort(data.sort);

        if(data.population){
            for(let key in data.population){
                query = query.populate(data.population[key]);
            }
        }

        if(data.select){
            query = query.select(data.select);
        }

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

export default async function(data,model){

    try {
        let  res = await queryRecords(data, model);
        return res;
    } catch(err) {
        return err;
    }
};
