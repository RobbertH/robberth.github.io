---
layout: post
title:  "0. Project Explanation"
date:   2015-07-18 11:16:16
categories: peru
permalink:  /peru/project-explanation/
---

Hello internet! This is the blog I will be writing on during the following months, during my project in Peru. I will try to give a short explanation of the bigger picture of the project, and my role in it.

We – that is, Joren and I – are in Jaén, Cajamarca, in the north of Peru. Jaén is a small city (of about 80 000 citizens) that is all about coffee. Farmers in the mountains (some are close by, some are more than two hours from here) come here once every year during the coffee season (between May and September) to sell their coffee beans to coffee federations. That way they can getter better prices for their coffee and defend their rights as farmers. They have to pay a small annual membership fee, but then they can sell their coffee for more than it would sell for on the streets.

Coffee is valued by two criteria: humidity and efficiency (rendimiento). Efficiency is determined by taking a sample of 400g of beans, throwing out the bad ones (too small, wizened or bad looking) and weighing the remainder. Humidity, however, is determined by measuring it using an expensive humidity sensor. The ideal humidity for coffee is considered 12% at the moment of selling. If it’s too high, the beans may become moldy during transportation; if it’s too low, the coffee starts to lose its taste. Low humidity also means low weight, and as they are paid by weight, less weight means less money. If the efficiency is low or the humidity is not right, the farmers get less money for their beans.

Coffee is a crop that has a peel. Farmers only dry their beans (by means of laying them out in the sun), but don’t peel them. Peeling happens in the coffee federations with expensive machines called ‘despulpadores’. So, farmers bring in coffee with peels (café pergamino), the coffee federation then weighs it, and takes a small sample from several bags. They remove the peels from that sample, weigh 400g, remove bad beans, weigh again, measure humidity and so determine the price of all beans. Then follows a process of burning (tostar) and grinding the peeled coffee (café oro) to determine what kind of coffee it is (mostly only by smelling, sometimes they also taste). It is then packed and labeled and sold as the coffee in its powder form we all know.

As humidity is an important factor in determining the price of the coffee beans, our project tries to anticipate this. Farmers now estimate the humidity level of their beans by looking at them and chewing on them. Some do a great job and bring in beans at 11-13%, but some can’t really say what humidity their beans are at and sometimes lose a lot of money bringing in beans of humidity of 16% or more. Because it is such a long trip from the mountains to Jaén, and transport costs are relatively high, the farmers only get one shot. That’s why it’s important for them to know when it’s the right time to come down and sell all of their beans at once. We aim to make a cheap device for those farmers, so that they can estimate the humidity level of their beans more correctly.

Warning: from here on it might get a bit technical, but hey, this whole project is pretty technical 😉
We already have a device that works pretty good. My part in the project is to get more theoretical insight and find out possible solutions to existing problems.

Our humidity sensor (and the expensive one at the coffee federations, too) is actually a capacity sensor, because capacity is an electrical property that can be measured using a microcontroller. With humidity changes capacity, and so we can link humidity to capacity. To know what capacity corresponds to what humidity, we have to take samples of different humidities – and thus different capacities – and link those humidities and capacities. This is called calibration. If everything’s right, the higher the humidity, the higher the capacity, so if we would plot the humidity of the measured samples against the capacity, we would be able to draw a line through the dots. This line has a mathematical description that we put in the device (just some coefficients). Now, whenever our device ‘reads’ some capacity, it can check the line and pick the corresponding humidity.

Well then what’s the problem? Seems like you already figured it out? Well, I said our device worked pretty good, and it does, at least for café oro. We have a deviation of 0.3% with café oro, which is neglegible. Even two expensive humidity sensors have such a deviation between them. So, we can say that our device works perfectly for café oro. For café pergamino, things are getting a bit more interesting. The deviations are too high, sometimes two measurements of the same sample give different results and even the expensive sensors don’t measure café pergamino perfectly (1% deviation between the same sample before and after peeling).

The most challenging problem at the moment is that farmers bring in coffee with peel (pergamino), but the humidity is measured using peeled coffee (oro). If we want to help the farmers, we need to make a device that uses coffee with peel to estimate the humidity of these beans when peeled. Farmers can peel coffee beans by hand, but that’s time costly and we would like to avoid that problem.

There is something else I didn’t tell you: capacity might change with temperature. In Jaén, temperature is always about 20°-30° C, summer or winter, day or night. In the mountains, however, it gets colder with height. As capacity might change whenever the temperature changes, we have to measure temperature first and correct our resulting humidity depending on the temperature. We don’t know yet if this even is an issue. If we’re lucky, nothing changes at all, or not enough to care about.

Now, my main two missions are to figure out how this capacity works exactly, see what currents are flowing and if we can improve something (e.g. isolate the capacity plates or not?) and whether a change of height (and thus temperature) results in a significant difference in capacity.

I have hidden some details, but I hope this gives you a clear sight of what the project looks like and what I’ll be doing here.

Adios amigos y hasta luego! (obligatory Spanish sentence)
