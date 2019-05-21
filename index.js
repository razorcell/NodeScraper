const tor = require('./Internal_App_Modules/tor.js');
const process = require('process');

let paraguay = 'http://www.bvpasa.com.py/emisores.php';

// In normal proxy scenario, sometimes proxy requests hang and you need to catch them like this
process.on('uncaughtException', err => {
    if (err.name === 'AssertionError') {
        console.log('an assertion has happened');
    }
});

(async () => {
    try {
        var response = await tor.downloadUrlUsingTor(paraguay);
        await tor.writeToFile('downloads/response.html', response.body);
    } catch (Error) {
        console.log(`Critical error downloading${Error}`);
    }
})();






