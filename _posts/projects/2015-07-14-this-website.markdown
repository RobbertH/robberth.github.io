---
layout: post
title:  "This Website"
date:   2015-07-13 21:00:25
categories: projects
comments: true
---

I have been interested in web development since I was a child.
I used to make a blog, go to the html section and paste javascript from the web in there to make cool effects, like color-changing scrollbars and fancy cursors.
As the years went by, I slowly began to understand how the web works.
But it wasn't until recently that I learned about static and dynamic pages, preprocessors and much more.

The gist of it is that static pages are fast because they always serve the same content, just like this blog.
Every time this blog is accessed, the same content is served, no matter who you are or where you are.
Static pages are in constrast with dynamic pages, which contain content that's user-specific.
For example, if you log in on social media, the content served there is entirely adapted to you.
Finding out which content needs to be presented, happens at the server side.
This takes time, and that's why static pages are generally faster, but have less features.

Preprocessors are programs that produce code in another language for you. For
example take CSS variables. Until now, at the time of writing, only FireFox supports CSS variables,
so for other browser users you'll still need to put the actual values in every CSS section where you used the variable.
That kind of takes away the usefulness of the variables. And that's where preprocessors come in handy: you write all the code in the preprocessor
language, and when you're done, the code will compile into regular html and CSS.
Another great advantage is that you can include entire blocks of code, like your
header and footer, without having to copy-paste them into every single page.

For this website, <a href="http://www.jekyllrb.com">Jekyll</a> was used. And as
a text editor, I can recommend <a href="http://www.atom.io">atom</a>. To publish the  whole site, I used <a href="http://pages.github.com">GitHub Pages</a>. I am truly amazed
by how simple Jekyll is, how beautiful atom and how fast GitHub. It's a pleasure
to work with these pieces of software, and I am very thankful to their creators.

<img src="/assets/img/ThisWebsite/ScreenshotAtom.png" alt="atomscreenshot" style="width: 100%;"/><br><i>This is what atom looks like</i><br>

You may also want to install the Jekyll plugin for atom (Edit -> preferences -> install -> jekyll). When it's installed you can go to Packages -> Jekyll -> Open Toolbar
and start serving your website locally. If you don't want to use this plugin, you can
also type <code>jekyll serve</code> in the command line.
They have great tutorials themselves, you can find everything on their website.

A great tutorial that I can recommend is the one from <a href="https://www.youtube.com/watch?v=iWowJBRMtpc"> DevTips</a>, which I also followed to build this website. 

