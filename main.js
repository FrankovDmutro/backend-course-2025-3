const { program } = require('commander');
const fs = require('fs');

program
  .option('-i, --input <path>')
  .option('-o, --output <path>')
  .option('-d, --display')
  .option('-h, --humidity')
  .option('-r, --rainfall <value>');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const rawData = fs.readFileSync(options.input, 'utf8');
let data = JSON.parse(rawData);

if (options.rainfall) {
  const minRain = parseFloat(options.rainfall);
  data = data.filter(item => item.Rainfall > minRain);
}

const result = data.map(item => {
  let line = `${item.Rainfall} ${item.Pressure3pm}`;
  
  if (options.humidity) {
    line += ` ${item.Humidity3pm}`;
  }
  return line;
}).join('\n');

if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result, 'utf8');
}