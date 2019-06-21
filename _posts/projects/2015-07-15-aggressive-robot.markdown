---
layout: post
title:  "Aggressive robot"
date:   2015-07-15 22:03:25
categories: projects
---

<h2>Background & Concept</h2>
When I heard IEEE organised a "sumo robot competition", I knew I wanted to
participate. So I went ahead and built my robot. There are a few game rules,
of which the most important is that you have to push the other robot out of
the doyo without damaging it. And the robots mustn't be controlled by a user, but
do everything on its own.

One of the biggest questions I had is where and how to place the sensors. There are a lot of options
here: two at the front / one on each side / one rotating on a servo / ... I watched
some videos and did some research and decided to go with the "two at the front"
approach, which works as follows: the robot spins around until it finds something
close enough to consider as a target. If one sensor measures a short distance and
the other a long, then the robot will spin until both sensors measure a short
distance, so the robot is always pointing at its target. <br>

When looking online, I found that there are basically 3 cheap options for sensors: ultrasonic HC-SR04,
infrared FC-51 or an infrared Sharp sensor. I bought the FC-51's because I thought
HC-SR04's would interfere too much with each other and possibly with the enemy, but
that didn't work out for me. They are just completely unusable. Luckily, I had
some HC-SR04's lying around so I switched to them.

<h2>Components</h2>
<ul>
<li>4x DC motor + gearbox</li>
<li>4x Wheel</li>
<li>1x Battery pack Mr handsfree 5V USB output</li>
<li>1x Arduino USB Cable</li>
<li>1x Arduino Uno R3</li>
<li>2x HC-SR04 Ultrasonic sensor</li>
<li>2x 9V battery</li>
<li>2x 9V battery to wire adapter</li>
<li>4x MOSFET</li>
<li>2x 5V DPDT relay</li>
<li>some resistors</li>
<li>Wires & Soldering tools</li>
<li>Case (see below)</li>
</ul>

<h2>Making the case</h2>
4 levels: 1 bottom with wheels, 1 with battery pack on it, 1 with arduino on it, 1 with batteries on it

This was going to be a small robot, so I knew I would have to build in height. I
also didn't want to spend a lot of money on the case, so I decided it'd have to be
built in [fablab](https://fablab-leuven.be/), with 3mm thick 600x300mm MDF wood plates and lasercutters. So I went ahead and drew some inkscape files (see below). I went to fablab to get it all lasercutted
and glued the pieces together. It has many levels, each containing some components.
<br>

<p style="text-align:center;">
   <img src="/assets/img/aggressivebot1/IMG_20150821_125935.jpg" alt="case" width="50%"/>
</p>
<p style="text-align:center;"><i>The multi-level case system I came up with</i></p><br>

<p style="text-align:center;">
   <img src="/assets/img/aggressivebot1/IMG_20150821_130005.jpg" alt="motor" width="50%"/>
</p>
<p style="text-align:center;"><i>One of the motors with gearbox I'll be using</i></p><br>

<p style="text-align:center;">
   <img src="/assets/img/aggressivebot1/IMG_20150904_172316.jpg" alt="case" width="100%"/>
</p>
<p style="text-align:center;"><i>Finished mini cruizer</i></p><br>

<p style="text-align:center;">
   <img src="/assets/img/aggressivebot1/IMG_20150904_172324.jpg" alt="motor" width="100%"/>
</p>
<p style="text-align:center;"><i>Isn't she beautiful?</i></p><br>
<br>

<h2>Electrical circuit</h2>
I got some nice circuit drawings from <a href="http://www.me.umn.edu/courses/me2011/arduino/technotes/dcmotors/bidirectional/bidirMotor.html">
http://www.me.umn.edu/courses/me2011/arduino/technotes/dcmotors/bidirectional/bidirMotor.html</a>

<p style="text-align:center;"> <img src="/assets/img/aggressivebot1/arduino-bidir.jpg" alt="circuitbidr" width="100%"/> </p>

<p style="text-align:center;"> <img src="/assets/img/aggressivebot1/bidir-dwg.jpg" alt="circuitbidrdr" width="100%"/> </p>

<h2>Competition</h2>
In the end, I teamed up with a friend of mine to participate in IEEE's competition.
We started over and built an entirely different robot.
We put a lot more time and money in the project than I originally anticipated, but in the end we finished second so I'm really happy with that!

<h2>Programming</h2>

<div>
<input class="toggle-box" id="header1" type="checkbox" >
<label for="header1">Click to expand/collapse</label>
<div>
{% highlight C %}
{% include other/arduinoCodeAggressiveBot.html %}
{% endhighlight %}
</div>
</div>


<h2>Files</h2>
<!-- TODO: Open in new tab -->
The .svg files to lasercut 3mm MDF plates:

<a href="/assets/img/aggressivebot1/AgressiveBot1.svg">AgressiveBot1.svg</a> <br>
<a href="/assets/img/aggressivebot1/AgressiveBot2.svg">AgressiveBot2.svg</a>
