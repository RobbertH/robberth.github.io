---
layout: post
title:  "Greasemonkey Youtube reloader"
date:   2018-05-18 
categories: projects
---

<h2>Background & Concept</h2>
When I was little, [Greasemonkey](https://addons.mozilla.org/nl/firefox/addon/greasemonkey/) helped me play some in-browser strategy games more efficiently.
Just recently, I reinstalled it and started optimizing my browsing experience, e.g. by automatically removing annoying pop-ups.
After finding myself reloading a newly discovered song on Youtube, I figured I'd rather just write a small greasemonkey script to do that for me.
It can be configured to reload automatically or on fixed time intervals. 

<h2>Code</h2>
{% highlight javascript %}
{% include other/youtubeReloader.js %}
{% endhighlight %}
