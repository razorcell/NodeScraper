# NodeScraper
Basic NodeJs scraping example using remote public proxies or Tor network.

This is an example project for a NodeJs web scraper.

Main functions are in "Internal_App_Modules" folder.

Functions to download using public proxies are in proxies.js

Functions to download using Tor network are in tor.js

Change the following line with your Tor settings:

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
