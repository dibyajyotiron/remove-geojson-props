const fs = require("fs");
const argsList = process.argv.slice(2);
const filePrefix = argsList[0];
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);
const removableProps = argsList.slice(1);

if (!filePrefix) {
  console.log("Please give the relative file name with location!");
  process.exit();
}
async function writeToFile(filePrefix) {
  try {
    let features;
    filePrefix = filePrefix.includes(".json") ? filePrefix.split(".").shift() : filePrefix;
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
writeToFile(filePrefix)
  .then(console.log)
  .catch(console.error);
