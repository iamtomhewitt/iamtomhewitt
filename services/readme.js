const Mustache = require('mustache');
const fs = require('fs');
const path = require('path')
const MUSTACHE_MAIN_DIR = '/../main.mustache';

const generateReadMe = async (DATA) => {
  console.log('Generating README')
  fs.readFile(path.join(__dirname, MUSTACHE_MAIN_DIR), (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log('README generated')
  });
}

module.exports = { generateReadMe }