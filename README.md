# NodeScraper


This is an example project for a NodeJs web scraping code.

Main functions are in "Internal_App_Modules" folder.

Functions to download using public proxies are in proxies.js

Functions to download using Tor network are in tor.js

For Proxies you have 2 functions, one for:
```javascript
https://free-proxy-list.net/
```
the other one for:
```javascript
https://www.proxy-list.download/api/v0/get?l=en&t=https
```
Default one is getProxylist() for https://free-proxy-list.net/. You can change to the other function by editing this line 
```javascript
px_list = await getProxylist();
```
in downloadUrlUsingProxy(......)

For Tor, keep in mind to change the following line with your Tor settings:

 ```javascript
let proxy = "socks5://192.168.1.154:9050";
 ```
 
In my example Tor proxy is at 192.168.1.154 on my Local Network (ubuntu OS).

The download function retries if download fails: 
 
 ```javascript
while (!download_success && trials < max_trials) {
 ```
or trials exceeds the maximum set in: 

 ```javascript
let max_trials = 300
 ```
