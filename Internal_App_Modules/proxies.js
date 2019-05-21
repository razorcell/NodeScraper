const requestpromise = require('request-promise');
const cheerio = require('cheerio');

var px_list = [];

async function delete_bad_proxy(proxy_to_delete) {
    return new Promise((resolve, reject) => {
        // console.log(`Deleting proxy ${proxy_to_delete} at index ${px_list.indexOf(proxy_to_delete)}`);
        if (px_list.lenght <= 0) {
            console.log(`Refreshing proxies table`);
            (async () => {
                px_list = await getProxylist();
            })();
            resolve('Proxies table refreshed');
        } else {
            var index = px_list.indexOf(proxy_to_delete);
            if (index > -1) {
                console.log(`Deleting proxy ${proxy_to_delete}`)
                try {
                    px_list.splice(index, 1);
                    console.log(`Number of prooxies = ${px_list.length}`);
                    resolve('Proxy deteled');
                } catch (err) {
                    reject('Proxy was not deleted : ' + err);
                }


            }
        }
    });

}
function get_random_proxy(array) {
    return array[Math.floor(Math.random() * array.length)];
}
async function getProxylist() {
    var list = [];
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    };
    var options = {
        uri: 'https://free-proxy-list.net/',
        headers: headers,
    };
    return new Promise(function (resolve, reject) {
        // Do async job
        requestpromise(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                var $ = cheerio.load(body);
                $('#proxylisttable tbody tr').each((i, tr) => {
                    var ip = $($(tr).find('td')[0]).text();
                    var port = $($(tr).find('td')[1]).text();
                    list.push('http://' + ip + ':' + port);
                });
                console.log(`Extracted ${list.length} proxies`);
                resolve(list);
            }
        });
    });
}
async function getProxylist2() {
    var options = {
        uri: 'https://www.proxy-list.download/api/v0/get?l=en&t=https'
    };
    return new Promise(function (resolve, reject) {
        // Do async job
        requestpromise(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                // var $ = cheerio.load(body);
                // $('#proxylisttable tbody tr').each((i, tr) => {
                //     var ip = $($(tr).find('td')[0]).text();
                //     var port = $($(tr).find('td')[1]).text();
                //     list.push(ip + ':' + port);
                // });

                var json = extractJSON(body);
                // console.log(json[0].LISTA);
                var pxys_array = [];
                json[0].LISTA.forEach((val) => {
                    pxys_array.push(`https://${val.IP}:${val.PORT}`);
                });
                resolve(pxys_array);
            }
        });
    });
}

function extractJSON(str) {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
        firstClose = str.lastIndexOf('}');
        // console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
        if (firstClose <= firstOpen) {
            return null;
        }
        do {
            candidate = str.substring(firstOpen, firstClose + 1);
            // console.log('candidate: ' + candidate);
            try {
                var res = JSON.parse(candidate);
                // console.log('...found');
                return [res, firstOpen, firstClose + 1];
            }
            catch (e) {
                // console.log('...failed');
            }
            firstClose = str.substr(0, firstClose).lastIndexOf('}');
        } while (firstClose > firstOpen);
        firstOpen = str.indexOf('{', firstOpen + 1);
    } while (firstOpen != -1);
}
async function downloadUrlUsingProxy(url,
    headers = null,
    method = 'GET',
    post_param = null) {
    return new Promise(function (resolve, reject) {
        (async () => {
            let trials = 0;
            let max_trials = 300;
            px_list = await getProxylist();
            var options = {
                method: method,
                timeout: 15000,
                uri: url,
                headers: headers,
                proxy: get_random_proxy(px_list),
                tunnel: true,
                resolveWithFullResponse: true,
                form: post_param,
            };
            var download_success = false;
            while (!download_success && trials < max_trials) {
                trials++;
                console.log(`Trial : ${trials} | Using proxy : ${options.proxy}`);
                await requestpromise(options)
                    .then(function (response) {
                        download_success = true;
                        console.log(`Download SUCCESS using proxy : ${options.proxy}`);
                        // console.log(`Headers`);
                        // console.log(response.headers);
                        // console.log(response);
                        //let reply = { 'body': response.body, 'headers': response.headers };
                        resolve(response);
                    })
                    .catch(function (err) {
                        console.log(`Error downloading : ${err.message}`);
                        delete_bad_proxy(options.proxy);
                        options.proxy = get_random_proxy(px_list);
                        // return download_function;
                        // reject(null);
                    });
            }
            reject(`Download trials exceeded ${max_trials}`);
        })();
    });
}


module.exports = {
    getProxylist,
    getProxylist2,
    delete_bad_proxy,
    get_random_proxy,
    downloadUrlUsingProxy,
    extractJSON
}