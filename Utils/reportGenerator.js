const fs = require("fs");
const { Parser } = require("json2csv");

exports.generateCSV = async (data, filePath) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);
  fs.writeFileSync(filePath, csv);
};
