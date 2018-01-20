import * as _ from 'lodash';

export class DataUtils {

    public static difference(object, base) {
        function changes(object, base) {
            return _.transform(object, function(result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }
}