---
layout: post
title:  "Agressive robot"
date:   2015-07-15 22:03:25
categories: arduino
---

<h1>Background & Concept:</h1>
When I heard IEEE organised a "sumo robot competition", I knew I wanted to
participate. So I went ahead and built my robot. There are a few game rules,
of which the most important is that you have to push the other robot out of
the doyo without damaging it. And the robots mustn't be controlled by a user, but
do everything on its own.

The main question is where and how to place the sensors. There are a lot of options
here: two at the front / one on each side / one rotating on a servo / ... I watched
some videos and did some research and decided to go with the "two at the front"
approach, which works as follows: the robot spins around until it finds something
close enough to consider as a target. If one sensor measures a short distance and
the other a long, then the robot will spin until both sensors measure a short
distance, so the robot is always pointing at it's target. <br>

In the world of sensors, you basically have 3 cheap options: ultrasonic HC-SR04,
infrared FC-51 or an infrared Sharp sensor. I bought the FC-51's because I thought
HC-SR04's would interfere too much with each other and possibly with the enemy, but
that didn't work out for me. They are just completely unusable. Luckily, I had
some HC-SR04's lying around.

<h1>Components:</h1>
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

<h1>Making the case:</h1>
4 levels: 1 bottom with wheels, 1 with battery pack on it, 1 with arduino on it, 1 with batteries on it

This was going to be a small robot, so I knew I would have to build in height. I
also didn't want to spend a lot of money on the case, so I decided it'd have to be
built in fablab, with 3mm thick 600x300mm MDF wood plates and lasercutters. So I went ahead and drew some inkscape files (see below). I went to fablab to get it all lasercutted
and glued the pieces together. It has many levels, each containing some components.
<br>

<img src="/assets/IMG_20150821_125935.jpg" alt="case" style="width: 300px; vertical-align: middle;"/><br>
<i>The multi-level case system I came up with</i>
<br>
<img src="/assets/IMG_20150821_130005.jpg" alt="motor" style="width: 300px;"/><br>
<i>One of the motors with gearbox I'll be using</i>
<br>
<img src="/assets/IMG_20150904_172316.jpg" alt="case" style="width: 500px; vertical-align: middle;"/><br>
<i>Finished mini cruizer</i>
<br>
<img src="/assets/IMG_20150904_172324.jpg" alt="motor" style="width: 500px;"/><br>
<i>Isn't she beautiful?</i>
<br>

<h1>Electrical network:</h1>
I got these nice circuit drawings from http://www.me.umn.edu/courses/me2011/arduino/technotes/dcmotors/bidirectional/bidirMotor.html

<img src="/assets/arduino-bidir.jpg" alt="circuitbidr" style="width: 300px; vertical-align: middle;"/><br>

<img src="/assets/bidir-dwg.jpg" alt="circuitbidrdr" style="width: 300px; vertical-align: middle;"/><br>

<h1>Programming:</h1>
Still need to write

<h1>Files:</h1>
<!-- TODO: Open in new tab -->
<a href="/assets/AgressiveBot1.svg">AgressiveBot1.svg</a> <br>
<a href="/assets/AgressiveBot2.svg">AgressiveBot2.svg</a>
