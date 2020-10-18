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

<h2>Randomness</h2>
* The force applied upon tapping the ball also includes a random sideways force.
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
I just needed to figure out a way to put OpenCV in between somewhere.
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

<img src="/assets/img/soccer/detected_circles.png" style="width: 99%; vertical-align: middle;"/>
<p>Detecting the same circle three times using HoughCircles.</p> <br>

<h2>Update 2020-10-17 - Fixed the image conversion</h2>
After hours of struggling, I finally managed to make the conversion from ffmpeg AVFrame to OpenCV mat, thanks to [a kind stranger's code on the internet](https://answers.opencv.org/question/36948/cvmat-to-avframe/). 
Lots of obscure errors later, of which I understood very few due to my limited knowledge on C++, a correctly filled OpenCV mat showed up, accessible for OpenCV.
Even the scaling feature works, so OpenCV doesn't have to process that many pixels, which probably results in faster computation. 
However, the latency problem remains, and simple tricks like tapping on the lower end of the ball don't work, so we'll have to move on to something more sophisticated: predicting the ball trajectory. To be continued...

<h2>Update 2020-10-18 - It kind of works!</h2>
Briefly, just briefly, I considered fitting the parabola that the ball would describe in pixel space, and predicting where it'd be in a couple of frames.
'A couple' being the number of frames that could be rendered in one 'loop': from the time the frame currently being processed was rendered until the moment the tap that is going to be sent out is registered on the phone.
However, in engineering classes, we were taught to approximate - agressively.
So what's the easiest meaningful prediction for the ball trajectory that you can make?

First, You assume that the ball's speed is constant (which it is in the x direction, just not in y due to gravity).
Then, you can measure this speed by comparing the position of the ball in the current frame to that in the previous.
Assuming that the frame rate is constant, you now have a measure for the speed of the ball in pixels per frame.
You again assume that this speed will remain constant, and multiplying this speed by delta\_t number of frames, you now have an approximation of where the ball will be in delta\_t frames.

After modifying the code, this approach seemed to work! The scores were much higher, and it even got up to 44 once.
It's still not perfect, due to two reasons, I believe.
The first one is that there are boundaries to the game that are not taken into account by the program: the ball will bounce off the edge of the screen, resulting in a speed that's inverse in the x direction.
The second one is that the tap that I've estimated the latency of one loop to be 5 frames, and this is assumed to be constant.
If the frame rate drops, the prediction is probably going to be wrong.

<h2>Conclusion</h2>
The program isn't perfect, but it can play the soccer game better than I do, so I think that's quite cool.
It also has more potential than just this game, because with a few small modifications, you are free to unleash the power of OpenCV onto any application that will run on an android device.
I think it can be improved by reviewing some of the assumptions above, but I'm leaving it as it is.
I learned a thing or two about C++, and I'm satisfied with the result, so I'm moving on to other projects.
