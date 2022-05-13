---
layout: post
title:  "C-test Flask application"
date:   2020-02-17 
categories: projects
comments: true
---

<h2>Background & Concept</h2>
With [Teach the Teachers](https://www.teachtheteachers.be), one of the problems that we have every year is that we need to divide the new teachers into groups, according to their level of English.
We wanted to use a platform like [EFSET](https://efset.org), but, with some of the teachers' limited set of IT skills, the process of creating an account and accessing the right test turned out to be too difficult.
That's why we wanted to create our own, very simple web app to test the teachers' level of English.
One of the members in our advisory board proposed the so-called "C-test", where you leave the last parts of some words out, and it's up to the testee to fill these in.

<h2>Solution</h2>
Hence, I started developing the web app using [Bootstrap](https://getbootstrap.com/) and [Flask](https://palletsprojects.com/p/flask/).
The hardest part in building this app was the generation of the C-test based on an article: I had to find a way to render a word at one time, but an input form at another time.
At the same time, you have to be able to get the user input back out of these input forms.
This problem was eventually resolved by making some custom form classes that had an extra boolean attribute, which could be used in the rendering template.
You also don't know beforehand how many words or input fields there are going to be, so you have to dynamically add attributes to the class that holds your words and input fields.
After getting to know python's setattr method, this was resolved as well.

<h2>Screenshots</h2>

<img src="/assets/img/ctest/articles.png" style="width: 99%; vertical-align: middle;"/>
<p>A project volunteer can make a new article or edit an existing one.</p> <br>

<img src="/assets/img/ctest/editor.png" style="width: 99%; vertical-align: middle;"/>
<p>They are then sent to the editor page.</p> <br>

<img src="/assets/img/ctest/ctest.png" style="width: 99%; vertical-align: middle;"/><br>
<p>After saving, teachers can access these same articles in the form of a C-test.</p> <br>

<img src="/assets/img/ctest/results.png" style="width: 99%; vertical-align: middle;"/><br>
<p>When they've submitted their result, the results can be viewed by the project volunteers.</p> <br>
