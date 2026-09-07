const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
console.log(Object.keys(spec.definitions || {}));
