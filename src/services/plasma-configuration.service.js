const { config } = require('rxjs');
var PlasmaConfigurationModel = require('../models/plasma-configuration.model');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
    async saveTestModel() {
        saveNewModel();
        return true;
    },
    async getAll() {
        var configModels = await PlasmaConfigurationModel.find({active: true}, function (err, result) {
            if (err) throw err;
            return result;
        });
        var configurations = [];
        configModels.forEach(function (config) {
            configurations.push(map(config));
        });
        return configurations;
    },
    async get(configurationCode) {
        var configModel =  await PlasmaConfigurationModel.findOne({ code: configurationCode, active: true }, function (err, result) {
            if (err) throw err;
            return result;
        });
        if (configModel) {
            return map(configModel);
        }
        return null;
    },
    async validConfigurationCode(configurationCode) {
        return await this.get(configurationCode) !== null;
    },
    async saveConfiguration(configuration) {
        if (configuration.code == "") {
            configuration.code = generateCode(6);
            var model = new PlasmaConfigurationModel({
                code: configuration.code,
                viewType: configuration.viewType,
                lineType: configuration.lineType,
                time: configuration.time,
                createdDate: new Date().toISOString(),
                createdBy: 'bserrano',
                active: true,
                sections: configuration.sections
            });
            model.save(function (err, obj) {
                if (err) throw err;
                return obj;
            });
        } else {
            var model = PlasmaConfigurationModel.updateOne(
                { code: configuration.code }, 
                { 
                    viewType: configuration.viewType,
                    lineType: configuration.lineType,
                    time: configuration.time,
                    active: true,
                    sections: configuration.sections 
                }, 
                function (err, result) {
                if (err) throw err;
                return result;
            });
        }
    },
    async delete(id) {
        return await PlasmaConfigurationModel.updateOne(
            { _id: ObjectID(id) },
            { active: false },
            function (err, config) {
                if (err) throw err;
                return true;
            });
    }
};

function map(model) {
    if (model) {
        var entity = {
            id: model._id,
            code: model.code,
            viewType: model.viewType,
            lineType: model.lineType,
            time: model.time, 
            imageUrl: model.imageUrl,
            createdDate: model.createdDate,
            active: model.active,
            sections: model.sections
        };
        return entity;
    }
    return null;
}

function generateCode(keyLength) {
    var i, key = "", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
        key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }
    return key.toUpperCase();
}

//just for testing 
function saveNewModel() {
    //   var model = new PlasmaConfigurationModel({
    //     code: "AH65RS",
    //     viewType: "v",
    //     lineType: "a",
    //     time: "12:01 PM",
    //     createdDate: new Date().toISOString(),
    //     sections: [
    //         {
    //             name: "BOXING",
    //             events: [
    //                 {
    //                     sport: "MU",
    //                     division: "MU",
    //                     titles: [
    //                             "BOXING",
    //                             "WTA TENNIS - SPREAD IS FOR SETS",
    //                             "ATP TENNIS - GAMES AND TOTAL LINES",
    //                             "UFC / MMA"
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    //   });

    //   model.save(function(err, doc) {
    //     if (err) return console.error(err);
    //     console.log("Configuration inserted successfully");
    //   });

}