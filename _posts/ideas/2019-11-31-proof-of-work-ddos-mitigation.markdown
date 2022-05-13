---
layout: post
title: "Proof of work DDOS mitigation"
categories: ideas
comments: true
---

<h2>{{post.title}}</h2>
When a server experiences relatively high load, they can start asking the client for proof of work.
They can for example generate two prime numbers, multiply them and ask the client to factorize them.
Only when the client responds with the two correct prime numbers, they are served the page.
When the server experiences more load (e.g. during a DDOS attack), they can pick larger prime numbers so every client has to do more work.
Of course, this is just an example and the exact proof of work method can be something else than prime factorization.
