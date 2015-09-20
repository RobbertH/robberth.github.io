---
layout: post
title:  "This Website (still full of mistakes and lies)"
date:   2015-07-13 21:00:25
categories: projects
---
I have been interested in webdesign since I was a child. I used to make a blog,
go to the html section and paste javascript from the web in there to make cool
effects, like color-changing scrollbars and fancy cursors. As the years went by,
I slowly began to understand websites. But it wasn't until not long ago that
I learned about static and dynamic pages, preprocessors and much more. For those
of you that have no idea what I am talking about, I made a little comparison table.
<table>
<tr> <td><u>Static pages</u></td> <td><u>Dynamic pages</u></td> </tr>
<tr> <td>Client-side calculations</td> <td>Server-side calculations</td> </tr>
<tr> <td>Blazing fast</td> <td>Often slower</td> </tr>
<tr> <td>Smaller pages</td> <td>Big web systems, databases, ...</td> </tr>
</table> <br>
Preprocessors are programs (languages) that produce code in another language for you. For
example take CSS variables. Until now, at the time of writing, only FireFox supports CSS variables, so for other browser users you'll still need to put the actual values in every CSS section where you used the variable. That kind of takes away the use of the variables. And that's where preprocessors come in handy: you write all the code in the preprocessor
language, and when you're done, the code will compile into regular html and CSS.
Another great advantage is that you can include entire blocks of code, like your
header and footer.

For this website, <a href="http://www.jekyllrb.com">Jekyll</a> was used. And as
a text editor, I can recommend <a href="http://www.atom.io">atom</a>. To publish the  whole site, I used <a href="http://www.github.com">GitHub</a>. I am truly amazed
by how simple Jekyll is, how beautiful atom and how fast GitHub. It's a pleasure
to work with these pieces of software, and I am very thankful to the creators.


<img src="/assets/img/ScreenshotAtom.png" alt="atomscreenshot" style="width: 600px;"/><br><i>This is what atom looks like</i><br>
<!-- TODO: put image in the middle -->

I included some code to install everything on a Linux system, but you'll still need to do some research as I can't cover every problem. For jekyll, you might want
to get the <a href="http://www.jekyllrb.com/downloads">.deb installer</a> from
their website, so you'll have the latest release. And of course also for
<a href="http://www.atom.io">atom</a>, get the .deb installer.
<!-- TODO: check Download link from jekyllrb  -->
<!-- test commands on raspi or live usb -->
{%highlight bash%}
sudo apt-get install git
sudo apt-get install nodejs
sudo apt-get install ruby
sudo apt-get install jekyll
cd Desktop/
jekyll new YourWebsiteName/
cd YourWebsiteName
git init
git remote add origin git@github.com:username/username.github.io.git
git commit -am "Initial Commit"
git push origin master

{%endhighlight%}

You may also want to install the Jekyll plugin for atom (Edit -> preferences -> install -> jekyll). When it's installed you can go to Packages -> Jekyll -> Open Toolbar
and start serving your website locally. If you don't want to use this plugin, you can
also type <code>jekyll serve</code> in the command line.

But they have great tutorials themselves, you can find everything on their website.
