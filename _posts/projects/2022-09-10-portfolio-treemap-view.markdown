---
layout: post
title:  "Portfolio treemap view"
date:   2022-09-10 
categories: projects
comments: true
---

<h2>Background & Concept</h2>
Inspired by treemap views like the [finviz treemap view of the S&P500](https://finviz.com/map.ashx), I decided I wanted this for my own 'portfolio'.
I didn't really buy those but I think I've made a nice selection of stocks as a demonstration.

<h2>A nice free finance API</h2>
I've spent a good amount of time looking around for a free finance API, and I've come to the conclusion that there's only one: [Yahoo Finance](https://finance.yahoo.com).
The others either provide historic data in bins of 15 minutes, have data on only some US exchanges, or are heavily rate-limited, or paid.
If you surf to Yahoo Finance, you can find some of the smallest stocks like [Moury Construct](https://finance.yahoo.com/quote/MOUR.BR?p=MOUR.BR&.tsrc=fin-srch), a Belgian construction company that has ridiculously low trading volumes.

There are a few pip packages like [yahoo-finance](https://pypi.org/project/yahoo-finance/) or [yfinance](https://pypi.org/project/yfinance/), but one of them only offered historical data and the other straight up didn't work for me. Eh, I only need one thing anyways: the most recent price a stock is traded at.

That, you can find on yahoo finance, in big bold letters, updated frequently. If you select that one in the developer console, you'll see it leads to a minified json, where you can simply search for `http` to see which endpoints it uses.
Somewhere in a sea of minified js characters, you'll find this beauty:
```
`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${this.symbolList.sort().join(",")}&fields=${this.fieldList.filter((e=>!r[e])).join(",")}`
```
which means you can pass `symbols` and `fields` in a request to that endpoint! Awesome!
After playing a little bit with those queries, and adjusting the user agent headers, I got returned a nice JSON, something like this:
```
{
  "quoteResponse": {
    "result": [
      {
        "language": "en-US",
        "region": "US",
        "quoteType": "EQUITY",
        "typeDisp": "Equity",
        "quoteSourceName": "Delayed Quote",
        "triggerable": false,
        "customPriceAlertConfidence": "LOW",
        "sourceInterval": 15,
        "exchangeDataDelayedBy": 15,
        "tradeable": false,
        "cryptoTradeable": false,
        "fullExchangeName": "Brussels",
        "priceHint": 2,
        "regularMarketTime": 1662733822,
        "firstTradeDateMilliseconds": 946972800000,
        "exchange": "BRU",
        "exchangeTimezoneName": "Europe/Brussels",
        "exchangeTimezoneShortName": "CEST",
        "gmtOffSetMilliseconds": 7200000,
        "market": "be_market",
        "esgPopulated": false,
        "marketState": "CLOSED",
        "symbol": "MOUR.BR"
      }
    ],
    "error": null
  }
}
```
But of course, with some price fields and a `marketState` that's not `CLOSED`.

<h2>From data to treemap</h2>
I applied some of the same tricks as always: a little bit of python glue and a little bit of docker containers.
The flow is the following: pycron regularly fetches data and dumps it into InfluxDB, which is then read out by grafana.
Also, this docker-compose trick cost me a few hours: if you explicitly add a container to a network, it is no longer part of the default network!
Let's never forget that one.
After that, it was a couple more hours of getting the hands dirty with Flux, InfluxDB's query language.
Here's the one that calculates total portfolio value over time:
```
from(bucket: "portfolio")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_field"] == "USDValueInPortfolio")
  |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
  |> group(columns: ["_time"])
  |> sum(column: "_value")
  |> group()
```
Took me a while to figure out you have to group by time before summing value across stock symbols.
Finally, playing around with the treemap settings: size is based on value in portfolio, color is based on change w.r.t. previous close.

<h2>Screenshot</h2>
<img src="/assets/img/portfolio/grafana.png" alt="grafana" style="width: 100%;"/><br>
Grafana is super cool.
The legends at the bottom are clickable and filter out the stock you want to see the graph for.
The blue line represents an "annotation" where you can place a comment on a certain moment in time.

<h2>Conclusion</h2>
Yay, stocks in a treemap!
