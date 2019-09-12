---
layout: post
title:  "Random QR app"
date:   2019-09-12 
categories: projects
---

<h2>Background & Concept</h2>
I made an application that shows QR-encodings of random strings of a given length.
It shows them at a speed that can be adjusted in the app.
It can be used if you want to test how fast your QR scanner works or if you want to throw a bunch of QR codes at a scanner and hope something happens.

<h2>Future work</h2>
* The size of the QR code should be configurable.
* The set of characters from which the random data is generated, at this moment, is alphanumeric with all capital letters. It should be extended so that the characters are drawed from a custom set of characters, configurable in the app. Another option is that the user provides a list of strings to build QR codes upon. For now, it also displays the QR codes of random strings, which is a highly inefficient way to go over all possible combinations.
* I forced the app to be in portrait mode. That's not really considered good practice.

<h2>Code</h2>
All code can be found on this [github repository](https://github.com/robberth/qr-brute-forcer).
