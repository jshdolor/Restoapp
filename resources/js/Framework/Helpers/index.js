let propertyValue =  (obj, dot, value) => {

    var path = dot.split('.');

    try {

        for (var i = 0; i < path.length; i ++) {

            if (value !== null && i + 1 === path.length) {

                obj[path[i]] = obj[path[i]] || value;

            }

            obj = obj[path[i]];

        }

        return obj;

    } catch (e) {

        return value;

    }

};

let pluck = (array, key) => {
    return array.map(o => o[key]);
}


export {
    propertyValue,
    pluck
}