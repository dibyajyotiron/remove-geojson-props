#!/usr/bin/env node
const fs = require("fs");
const [, , ...argsList] = process.argv; // short hand for -> const argsList = process.argv.slice(2);
const filePrefix = argsList[0];
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);
const [, ...removableProps] = argsList;

const helpMenu = () => 'dummy command "./app.js [file path] [property1] [property2] [property3]..."';
const parseFileName = (filePrefix) => filePrefix.includes(".json") ? filePrefix.split(".").shift() : filePrefix;

if(argsList.includes("help") || argsList.includes("--help")) {
    console.log(helpMenu());
    process.exit();
}
if (!filePrefix) {
    console.log("Please give the relative file location!");
    console.log(helpMenu());
    process.exit();
}
if(!removableProps.length) {
    console.error("No property to remove!");
    console.log(helpMenu());
    process.exit();
}
async function writeToFile(filePrefix) {
    try {
        let features;
        features = JSON.parse(await readFile(`${filePrefix}.json`));
        for (feature of features.features) {
            for (const propType of removableProps) {
                feature.properties[propType] && delete feature.properties[propType];
            }
        }
        await appendFile(`updated_${filePrefix.split("/").pop()}.json`, JSON.stringify(features), { flag: "w+" });
        return `Data written to updated_${filePrefix.split("/").pop()}.json!`;
    } catch (error) {
        return error.message;
    }
}

writeToFile(parseFileName(filePrefix)).then(console.log).catch(console.error);