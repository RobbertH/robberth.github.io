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
the dojo without damaging it. And the robots mustn't be controlled by a user, but
do everything on its own. <br>
The main question is where and how to place the sensors. There are a lot of options
here: two at the front / one on each side / one rotating on a servo / ... I watched
some videos and did some research and decided to go with the "two at the front"
approach, which works as follows: the robot spins around until it finds something
close enough to consider as a target. If one sensor measures a short distance and
the other a long, then the robot will spin until both sensors measure a short
distance, so the robot is always pointing at it's target. <br>
Also I decided not to use the very popular HC-SR04, but rather to go with an
infrared module, as it's less likely to interfere with the enemy's sensors.

<h1>Components:</h1>
<ul>
<li>4x DC motor + gearbox</li>
<li>4x Wheel</li>
<li>1x Battery pack Mr handsfree 5V USB output</li>
<li>1x Arduino USB Cable</li>
<li>1x Arduino Uno</li>
<li>2x IR distance sensor module</li>
<li>4x 9V battery</li>
<li>4x 9V battery to wire adapter</li>
<li>8x MOSFET</li>
<li>8x diode</li>
<li>(8x 10K resistor)</li>
<li>Wires & Soldering tools</li>
<li>Case (see below)</li>
</ul>
<h1>Making the case:</h1>
1mm MDF plate
inkscape files
4mm diameter wooden sticks for holding the different bases together
0.1mm 255 red drawing and black for engraving
600x300mm plate (horizontal)
3mm thick MDF wood
4 levels: 1 bottom with wheels, 1 with battery pack on it, 1 with arduino on it, 1 with batteries on it
Still need to write this.
<br>
<img src="/assets/IMG_20150821_125935.jpg" alt="case" style="width: 300px; vertical-align: middle; left: 50%;"/><br>
<i>The multi-level case system I came up with</i>
<br>
<img src="/assets/IMG_20150821_130005.jpg" alt="motor" style="width: 300px;"/><br>
<i>One of the motors with gearbox I'll be using</i>
<br>

<h1>Electrical network:</h1>
http://arduinoarts.com/wp-content/uploads/2011/08/arduino_bb_pot_transistor_motor_diode.png

<h1>Programming:</h1>
Still need to write

<h1>Files:</h1>
<!-- TODO: Open in new tab -->
<a href="/assets/AgressiveBot1.svg">AgressiveBot1.svg</a> <br>
<a href="/assets/AgressiveBot2.svg">AgressiveBot2.svg</a>
