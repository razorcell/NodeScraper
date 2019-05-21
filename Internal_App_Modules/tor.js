const requestpromise = require('request-promise');
const fs = require('fs');
const SocksProxyAgent = require('socks-proxy-agent');

const default_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    // 'Connection': 'keep-alive',
    // 'Upgrade-Insecure-Requests': '1',
};

async function downloadUrlUsingTor(url,
    headers = default_headers,
    method = 'GET',
    post_param = null) {
    return new Promise(function (resolve, reject) {
        (async () => {
            let proxy = "socks5://192.168.1.154:9050"; let agent = new SocksProxyAgent(proxy); let trials = 0; let max_trials = 300;
            var options = {
                method: method,
                timeout: 15000,
                uri: url,
                headers: headers,
                agent: agent,
                tunnel: true,
                resolveWithFullResponse: true,
                form: post_param,
            };
            let download_success = false;
            while (!download_success && trials < max_trials) {
                trials++;
                await requestpromise(options)
                    .then(function (response) {
                        download_success = true;
                        console.log(`Tor Download SUCCESS`);
                        resolve(response);
                    })
                    .catch(function (err) {
                        console.log(`Tor Error downloading : ${err.message}`);
                    });
            }
            reject(`Download trials exceeded ${max_trials}`);
        })();
    });
}
async function writeToFile(file_path_name, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(file_path_name, data, function (err) {
            if (err) {
                console.log(`Error writting to file : ${err.message}`);
                reject();
            }
            console.log(`File : ${file_path_name} save SUCCESS`);
            resolve();
        });
    });
}

module.exports = {
    writeToFile,
    downloadUrlUsingTor
}