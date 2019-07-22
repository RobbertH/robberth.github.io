---
layout: post
title: "Multi-user biometric authentication"
categories: ideas
---

<h2>{{post.title}}</h2>
When you log in on your smartphone using your fingerprint or face ID, the device matches it to any of the registered users in the database.
The problem is, all these registered users in the database get access to the same account with the same privileges.
You want to be able to detect which user wants to unlock the device, and based on that, give them different privileges.
For example, you might not want a friend you gave access to your phone to be able to sign transactions with your banking app.

One problem is that having more "positives" (accepted biometry entries) in the database, increases the false acceptance rate, so basically, makes your device less secure.
