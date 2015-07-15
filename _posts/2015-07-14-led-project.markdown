---
layout: post
title:  "LED Project"
date:   2015-07-14 19:12:16
categories: electronics arduino
---
<h1>Components:</h1>
<ul>
<li>2x 5M RGB LED strip</li>
<li>2x Power Supply 12V 2A</li>
<li>2x Adapter female to female + - for the supply</li>
<li>6x MOSFET</li>
<li>1x Arduino</li>
<li>1x Arduino USB Cable</li>
<li>1x USB female to male</li>
<li>1x Adapter for Arduino power (USB output)</li>
<li>1x ESP Wi-Fi module</li>
<li>Wires & Soldering tools</li>
</ul>

<h1>Electrical Network:</h1>
LEDs: <br>
Just connect every mosfet's gate to a PWM output of the arduino, every drain to a LED strip pin (r,g,b), and every ground to, well, the ground. Also make sure the ground of the arduino and power supply are common. Last but not least, plug the power supply's positive into the LED strip's positive side.

ESP: <br>
to be worked out

<h1>Programming: </h1>
to be worked out

<h1>Reflections on the project: </h1>
Adapters. Buy as many of them as you can because they make your life a lot easier. After soldering the circuit together, one of my LED strip's red was always on.
PCB recommended because soldering sucks.

<h1>Pictures</h1>
Yet to come
