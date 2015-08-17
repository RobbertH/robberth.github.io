---
layout: post
title:  "LED Project"
date:   2015-07-14 19:12:16
categories: arduino
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
Arduino:
{%highlight c++%}
int r,g,b;
long rgb;

void setup(){
    Serial.begin(9600);
    pinMode(3, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(9, OUTPUT);
    pinMode(10, OUTPUT);
    pinMode(11, OUTPUT);
}

void writeNumbers(int r1, int g1, int b1, int r2, int g2, int b2){
    analogWrite(3, r1);
    analogWrite(5, g1);
    analogWrite(6, b1);
    analogWrite(9, r2);
    analogWrite(10, g2);
    analogWrite(11, b2);
}

void loop(){
    if (Serial.available() > 0){
        long rgb = Serial.parseInt();
        Serial.println(rgb);
        r = rgb/1000000;
        g = (rgb%1000000 - rgb%1000)/1000;
        b = rgb%1000;
        Serial.println(r);
        Serial.println(g);
        Serial.println(b);
        writeNumbers(r,g,b,r,g,b);
    }
    else{
        writeNumbers(r,g,b,r,g,b);
    }
}
{% endhighlight %}

<h1>Reflections on the project: </h1>
The amount of frustrations were high on this one. Try to
avoid wires as much as possible, use adapters instead, it'll make your life a
lot easier. Cables break and come out of place, adapters fit nicely and won't get
out of place. When I made the circuit, everything worked fine and I decided to
move away from the breadboard and solder everything together. After soldering, I
broke a transistor (probably couldn't handle the heat) and one of the LED strips'
red was always on. I am considering moving on to a PCB for overall sturdiness and
compactness.

<h1>Pictures</h1>
Yet to come
