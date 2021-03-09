const NodeCache = require("node-cache");
const myCache = new NodeCache({checkperiod: 0});

module.exports = {
    set (key, data) {
        return myCache.set(key, data);
    },
    get (key) {
        return myCache.get(key);
    },
    checkIfExist(key) {
        return myCache.has(key);
    },
    delete(key) {
        return myCache.del(key);
    },
    cleanAll() {
        myCache.close();
    },
};
