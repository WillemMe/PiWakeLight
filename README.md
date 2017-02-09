# PiWakeLight
A Node.Js server with web interface to controll gpio pin and set an alarm on a Raspberry Pi 3 and zero (only ones I tested)

## Usage
### Setup
1. Have node.js installed on the raspberry pi ([tutorial here](http://weworkweplay.com/play/raspberry-pi-nodejs/)).
2. Clone the repo/ or download and extract it.
3. Use ```npm install``` to install the needed modules for the server (```npm install``` will install the pakage.json file inside the cloned repo)
4. To run the server use ```sudo node main.js``` sudo is important because other wise the gpio module will crash 
5. Hook up the relay to the appropriate gpio pins, datat to gpio28/pin 18.
6. Connect it to your light (Do your research!!!)

The set pin is by default on gpio28/pin 18, may add in the future way to change it.

### Futher use
add in the ```/etc/rc.local``` file the next command: ```node /home/pi/*PATH TO FOLDER*/main.js``` this will automaticaly run the server on boot up so you can use it with out a terminal. 

To use the webpage get the IP of the pi (same as you use for ssh) past is in the browser with adding :3000 <br>
example ```192.168.1.2:3000```

If the setup was successfull you will no be presented with a webpage, if not contact me and I may be able to help you out.

### Webpage usage
* Add times
  * select you type of alarm (single time or repeating)
  * fill in the forms (date is only needed for single use and the days are only used for repeating time)
  * click submit
* Remove time
  * click on the time you want to remove to remove it
### Webpage example
![picture alt]()Comming soon

## Motivation

This project was made because I hated it to get out of bed in the morning to switch my **light on**, so I made a Node.Js server with a page that gives you options to turn it on and also set alarm times.

## Contributors
[Willem Me](https://github.com/WillemMe)

## Special thanks to
[Daniel Shiffman](https://github.com/shiffman) for helping out with making an API with his tutorial series on his [Youtube Channel](https://www.youtube.com/user/shiffman)
