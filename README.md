# PiWakeLight
A Node.Js server with web interface to controll gpio pin and set an alarm on a Raspberry Pi 3 and zero (only ones I tested)

## Setup
1. Have node.js installed on the raspberry pi ([tutorial here](http://weworkweplay.com/play/raspberry-pi-nodejs/)).
2. Clone the repo or download and extract it.
3. Use ```npm install``` to install the needed modules for the server (```npm install``` will install the pakage.json file inside the cloned repo)
4. To run the server use ```sudo node main.js``` sudo is important because otherwise the gpio module will crash
5. Hook up the relay to the appropriate gpio pins, data to gpio28/pin 18.
6. Connect it to your light (Do your research and stay safe!!)
7. Add a button with pulldown on pin 7
It is possible change the gpio pins in the ```database.json```
## Usage

add in the ```/etc/rc.local``` file the next command: ```node /home/pi/*PATH TO FOLDER*/main.js``` this will automaticaly run the server on boot up so you can use it without a terminal.

To use the webpage get the IP of the pi (same as you use for ssh) past is in the browser with adding :8080 <br>
for example ```192.168.1.2:8080```
that port can be set to port ```80``` this way the port doesn't have to be in the URL

If the setup was successfull you will now be presented with a webpage, if not contact me and I might able to help you out.

### Webpage usage
* Add times
  * Fill in the forms
    * Fill in the date form or select days(choose date or days not both!)
  * Click submit.
* Remove time
  * Click on the time you want to remove to remove it.
* Set alarm
  * To set an alarm simply click on "set alarm" and it turns green.
* Manual switch light
  * Click on to turn the light on
  * Click off to turn the light off

### Webpage example

![Webpage](http://www.willemme.com/Img/Wakelight.png "Webinterface")

### My hardware setup
<img src="https://i.imgur.com/Pu6L6pn.jpg" width="1000" height="562.5" >

## Motivation

This project was made because I hated it to get out of bed in the morning and switch my light on, so I made a Node.Js server with a page that gives you options to turn it on and also set alarm times so I can stay in bed and not have to walk to the light switch.

## Need help or have a sugestion?

You're free to contact me for help like
* How to make a Node.js API with GPIO pins interface.
* Or want to "copy" my code and need explaination, I will help you as much as possible.
* Or if you have a great idea tell me!

## Contributors
[Willem Me](https://github.com/WillemMe)

## Special thanks to
[Daniel Shiffman](https://github.com/shiffman) for helping out with making an API with his tutorial series on his [Youtube Channel](https://www.youtube.com/user/shiffman)
