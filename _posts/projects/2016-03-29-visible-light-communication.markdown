---
layout: post
title:  "Visible light communication"
date:   2016-03-29 15:42:25
categories: projects
---

<h2>Background & Concept</h2>
One day, I was at my friend's dorm room and we noticed that one could see my
dorm from his. We were thinking about communicating with lasers from his dormitory to mine and the
other way round. Of course, I took this seriously and started building it. So far
I have one arduino that is able to communicate with itself via visible light.
Theoretically, the only thing we would have to do is replace the LEDs used right now
with lasers that the photoresistors can detect over such a large distance. But
there is another problem: the signals won't be exactly synced, unless we power both
arduinos on at the exact right time. For example, a problem that can occur now if
we use two distinct arduinos is that one arduino starts sending, and the other starts receiving
when the fourth bit already has been sent. That's why I will need to implement a
preamble or something alike. This remains to be done. I already ordered the
lasers, so I'll keep you guys up to date if I ever find the time to work on this again.

<h2> TODOs </h2>
A lot is still wrong with this prototype. Problems/TODOs that I know of right now include:
<ul>
	<li> Encoding should be according to ASCII </li>
	<li> Code should be cleaned and documented for understandability, simplicity and compactness </li>
	<li> Problem of syncing between two arduinos should be solved </li>
	<li> Error correction code can be added </li>
</ul>

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
The video is available on <a href="https://www.youtube.com/watch?v=U2LlwHkrC9s">youtube</a>.
<div class="video-container"><iframe src="https://www.youtube.com/embed/U2LlwHkrC9s"></iframe></div>


<h2>Circuitry</h2>
Actually it's very simple here. What we are doing is making a voltage divider from the
arduino's 5V pin to GND, using a fixed resistor and a photoresistor. The voltage between
these two resistors is then read by an analog pin.
<br>
When light shines on the photoresistor, it's value drops and a bigger part of the
5V from the arduino drops over the fixed value resistor.
<br><br>
On popular demand, I also made a circuit diagram:<br>
<a href="/assets/img/vlc/vlc_circuit_diagram.png"><img src="/assets/img/vlc/vlc_circuit_diagram.png" alt="vlc_circuit_diagram" style="width: 100%; vertical-align: middle;"/></a><br>

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
