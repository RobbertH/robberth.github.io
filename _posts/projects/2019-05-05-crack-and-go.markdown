---
layout: post
title:  "Crack and Go"
date:   2019-05-05 
categories: projects
---

<h2>Background & Concept</h2>
Back with another [Greasemonkey](https://addons.mozilla.org/nl/firefox/addon/greasemonkey/) script.
A friend of mine ordered groceries from colruyt by copying the ingredients from a meal box.
Since that's too time consuming, I wrote two scripts that do this automatically for him.

The first one fetches all ingredients and opens new tabs that search for these ingredients.
The second one buys the first search result once and then closes the tab again.

<h2>Code</h2>
{% highlight javascript %}
{% include other/crackAndGo.js %}
{% endhighlight %}

{% highlight javascript %}
{% include other/crackAndProceed.js %}
{% endhighlight %}
