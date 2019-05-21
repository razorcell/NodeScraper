# NodeScraper
Basic NodeJs scraping example using remote public proxies or Tor network
This is an example prject for a NodeJs web scraper.

Main functions are in "Internal_App_Modules" folder.

Functions using public proxies are in proxies.js

Function to download using Tor network are in tor.js

Change the following line with your Tor settings:

 ```javascript
let proxy = "socks5://192.168.1.154:9050";
 ```
 
In my example Tor proxy is at 192.168.1.154 on my Local Network (ubuntu OS).


