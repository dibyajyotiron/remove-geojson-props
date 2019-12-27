const fs = require("fs");

function writeToFile(filePrefix) {
    let features;
    fs.readFile(`${filePrefix}.json`, (err, data) => {
        if(err) throw err;
        features = JSON.parse(data);
        for(feature of features.features) {
            feature.properties.raw_images && delete feature.properties.raw_images;
            feature.properties.row && delete feature.properties.row;
            feature.properties.table_column && delete feature.properties.table_column;
        }
        fs.appendFile(`updated_${filePrefix}.json`, JSON.stringify(features), { flag: "w+" }, (err) => {
            if(err) throw err;
            console.log("done");
        })
    });
}

console.log(writeToFile("a4"))