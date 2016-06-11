---
layout: post
title:  "Visible light communication"
date:   2016-03-29 15:42:25
categories: projects
---
<h2>Background & Concept</h2>
So one day, I was at my friend's dorm room and we noticed that you could see my
dorm from his. So we started joking around and as we are engineering students, lasers came up.
We were thinking about communicating with lasers from his dormitory to mine and the
other way round. Of course, I took this seriously and started building it. So far
I have one arduino that is able to communicate with itself via visible light.
Theoretically, the only thing we would have to do is replace the LEDs used right now
with lasers that the photoresistors can detect over such a large distance. But
there is another problem: the signals won't be exactly synced, unless we power both
arudinos on at the exact right time. For example, a problem that can occur now if
we use two distinct arduinos is that one arduino starts sending, and the other starts receiving
when the fourth bit already has been sent. That's we I will need to implement a
preamble or something like that. This remains to be done. I already ordered the
lasers, so I'll keep you guys up to date.

<h2>Components</h2>
<ul>
<li>1x photoresistor</li>
<li>1x LED</li>
<li>1x Resistance (of about same value as photoresistor)</li>
<li>1x Arduino USB Cable</li>
<li>1x Arduino Uno R3</li>
<li>Some wires and a breadboard</li>
</ul>

<h2>Video</h2>
<iframe width="560" height="315" src="http://www.youtube.com/embed/U2LlwHkrC9s">
</iframe>

<h2>Circuitry</h2>
Actually it's very simple here. What we are doing is making a voltage divider from the
arduino's 5V pin to GND, using a fixed resistor and a photoresistor. The voltage between
these two resistors is then read by an analog pin.
<br>
When light shines on the photoresistor, it's value drops and a bigger part of the
5V from the arduino drops over the fixed value resistor.

<h2>Arduino Code</h2>

<div>
<input class="toggle-box" id="header1" type="checkbox" >
<label for="header1">Click to expand/collapse</label>
<div>
{% highlight C %}
{% include other/arduinoCodeVLC.html %}
{% endhighlight %}
</div>
</div>
