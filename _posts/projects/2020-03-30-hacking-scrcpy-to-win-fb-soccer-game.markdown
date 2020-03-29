---
layout: post
title:  "Hacking scrcpy to win fb soccer game"
date:   2020-03-30 
categories: projects
---

<h2>Background & Concept</h2>
On Facebook Messenger, there's a game you can play where you have to keep a soccer ball up in the air by tapping it.
Every time you tap it, your score goes up by one.
The soccer ball experiences gravity and will get an upward force when you tap it.
I wanted to see whether OpenCV could help me winning this game.

<h2>Extra constraints</h2>
* You can only tap a certain times per second.
Taps following each other too quickly will not be registered.
* The upward force applied upon tapping the ball also includes a random sideways force.
This can be seen through repeatedly applying 'adb shell input tap x y' at the start of the game and observing the course of the ball.
Since the ball always starts at the exact same position on the bottom, there is no variation in the location of the tap with respect to the ball.
There is variation in the trajectory of the ball, which means some sort of randomness is involved.

<h2>First attempt in python</h2>
I googled for some tools for:
* Getting a stream of images from my phone to my computer
* Extracting the position of the ball on my computer
* Sending an input tap at the position of the ball back

I found a solution online, where scrcpy is used to grab an image from the phone and display it in a window.
This window itself is then pulled into python through PIL.ImageGrab (pyscreenshot for linux users).
It can then be processed by OpenCV to extract the position of the ball.
Surprisingly, that's very easy through the "HoughCircles" method.
You can even specify a range for the circles you want to detect, so you can set it to the size of the ball in pixels. 
This works very well.

Sending the input command to tap the screen is also very straightforward using adb as pointed out above.

However, there are two problems with this approach.
* It's too slow, probably mainly due to ImageGrab.
* You can only connect one client at a time to the adb server running on your phone. Both scrcpy and adb shell require a connection.

<h2>Second attempt: hacking scrcpy</h2>
Since scrcpy already has an adb connection open, grabs the images from the phone and has the ability to send input back to the phone, this was the obvious choice for a second attempt.
Luckily for me, scrcpy is open source. It's written in C and you can build it yourself using the meson build system.
I just needed to figure out a way to jam OpenCV in between somewhere.
I first tried to find an old OpenCV version that's written in C instead of C++, so I could stick with all the meson compiler settings.
After a while I tried to convert everything to C++, but that didn't work out either.
At last, I found out that it's not that hard to call C++ from C, using the magic words "extern C".
Then, after fiddling some more with meson and installing OpenCV the right way, I was able to call OpenCV from some function in scrcpy that would update every frame.
The next challenge was to figure out how to convert an ffmpeg AVFrame to an OpenCV mat.
Basically, not everyone uses the same conventions as to how a picture is defined, and I needed OpenCV to understand the one used in scrcpy.
I never really succeeded in doing so, but at some point, I succeeded to get 3 times the same picture, horizontally adjacent to each other (something tells me these are the R, G and B channel of the picture).
I don't care too much about these colors since the HoughCircles method uses a GrayScale image anyways, so I just ran the method on that picture and so it would extract the ball 3 times at different coordinates.
No problem, we just grab the first circle coordinates, do some hocus pocus with the resolutions of the frame and the phone's screen, and voila, we know where to tap.
Of course, this cannot be done through adb, but has to go through the scrcpy's input manager itself.
That's where I'm at now. I hope to find time to finish this project so I can get the high score!

<h2>Screenshots</h2>

<img src="/assets/img/soccer/detected_circles.png" style="width: 99%; vertical-align: middle;"/>
<p>Detecting the same circle three times using HoughCircles.</p> <br>

