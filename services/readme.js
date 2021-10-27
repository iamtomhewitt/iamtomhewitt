const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const generateReadMe = async (DATA) => {
  console.log('Generating README');
  fs.readFile(path.join(__dirname, '/../main.mustache'), (err, data) => {
    if (err) throw err;
    const output = mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log('README generated');
  });
};

module.exports = { generateReadMe };
