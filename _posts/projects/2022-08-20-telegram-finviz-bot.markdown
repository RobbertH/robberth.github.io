---
layout: post
title:  "Telegram finviz bot"
date:   2022-08-20 
categories: projects
comments: true
---

<h2>Background & Concept</h2>
Almost every day at 15:45 (or 16:45, depending on DST), I check [finviz's treemap view of the S&P500](https://finviz.com/map.ashx).
There are a few limitations to finviz (e.g., 15 minute data delay, debatable sector grouping and, as a friend of mine pointed out, not the most accurate market cap representation), but you can still quickly see what's going on in the S&P500.
It's especially useful to catch (inter- or intra-sector) outliers: e.g., when a sector is extra sensitive to changing interest rates, or certain political decisions are made in favor or against some companies, or when a stock published bad earnings, you can usually quickly spot who's affected.
Anyways, I thought it would be cool to write a telegram bot that could send me those maps every day at 15:45.

<h2>Weird map</h2>
My first attempt was to go look whether there's some .png with a predictable URL that I could download.
While there is a share button that results in a nice .png with a predictable (timestamp) URL, there where never any .pngs to be found on 'nearby' URLs.
Turns out you generate these URLs whenever you click share, and somehow a .png is stored on their server.
Time to open the network dev tools and try to replicate the request that makes the server publish that nice .png.
Nope, the entire image is already in the POST request, encoded in base64.
So you send them a request with the image to be published? (also, any image?)
But how do you get the base64 image?
Must be some javascript magic. Look at the source. Unreadable minified JS. Skip.
Let's just search for another treemap view, stumbled upon [tradingview's heatmap](https://tradingview.com/heatmap), but no luck finding a nice URL there either.

<h2>Selenium</h2>
There's probably many websites where you don't want to go to the trouble of even opening the dev console, just to scrape an asset.
Luckily, [https://selenium.dev](selenium) exists.
It allows you to control a browser from a programming language, in my case Python.
At first I wrote a script that took a screenshot of the finviz map using my browser, but I ran into issues when I wanted to go headless.
Cloudflare's anti-bot system was blocking access for headless selenium.
Stackoverflow suggested [undetected-chromedriver](https://pypi.org/project/undetected-chromedriver/), which worked, but then I discovered [Selenium docker images](https://github.com/SeleniumHQ/docker-selenium), which also worked and seemed like the better option.
I now could get screenshots from finviz by running a docker container and a python script, and save them to disk.

<h2>Cron and telegram</h2>
All that remained was to figure out how to run this thing every day at 15:45, and send it to me on telegram.
Seemed like a job for cron, but I wasn't sure whether to run this inside a container or on the host, whether to make another microservice that hosts the screenshot, etc.
Then I stumbled upon a nice python cron package, and used that to call the screenshot code.
Finally, stackoverflow told me about `https://api.telegram.org/bot<Token>/sendPhoto` and how to use it, and there was my bot.

<h2>Conclusion</h2>
Spent way too long automating a process that only takes 5 seconds every day.
Yet, I get to enjoy it every time the notification comes in.
