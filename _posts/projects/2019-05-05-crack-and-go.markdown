---
layout: post
title:  "Crack and Go"
date:   2019-05-05 
categories: projects
---

<h2>Background & Concept</h2>
Back with another [Greasemonkey](https://addons.mozilla.org/nl/firefox/addon/greasemonkey/) script.
A friend of mine discovered a bit of a loophole in [Colruyt's mealbox service](https://colruyt.collectandgo.be/cogo/nl/topbranch/1801/maaltijdboxen): when you order the same ingredients from the mealbox from [Collect & Go](https://colruyt.collectandgo.be/cogo/nl/home), you pay less.
Collect & Go is a service by Colruyt where you can order your groceries online and collect them later at the physical store.
The mealboxes are very much alike, except for two things.
One is that they alter the portions to perfectly match the recipe (so sometimes 0.75 pots of yoghurt are included in the mealbox).
The other is that it's a preconfigured package, so you just have to order the one thing and there'll be some 15 ingredients waiting for you at the store.

So my friend figured he'd just copy all ingredients from the mealbox page, and insert them into Collect & Go.
This turned out to save him money, while he was getting more (the 0.75 pots of yoghurt are of course not for sale in the collect & go).
Since copying all these ingredients is somewhat time consuming, I wrote two scripts that automate the process.

The first one fetches all ingredients and opens new tabs that search for these ingredients.
The second one buys the first search result once and then closes the tab again.

This is more of a proof of concept, it's not robust at all and it can be easily put into one script by deciding which function to execute based on the URL.

<h2>Code</h2>
{% highlight javascript %}
{% include other/crackAndGo.js %}
{% endhighlight %}

{% highlight javascript %}
{% include other/crackAndProceed.js %}
{% endhighlight %}
