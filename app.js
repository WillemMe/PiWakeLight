// Input vars!!
var alarmOn = true;
// Node require
var gpio = require('rpi-gpio'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    qs = require('qs');


// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                                  Setup                                      ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
// Import json time file
var data = fs.readFileSync(path.join(__dirname, 'dataBase.json')),
    dataBase = JSON.parse(data),
    time = dataBase.time,
    repeatTime = dataBase.repeatTime,
    setPin = dataBase.setPin,
    setPinButton = dataBase.setPinButton,
    gpio_status = false;

// Pin setup
gpio.setup(setPinButton, gpio.DIR_IN, gpio.EDGE_RISING, function(){
  console.log("Pin"+setPinButton+" has been setup");
});
var debounce = true
gpio.on('change', function(channel, value) {
    if(channel == 7 && value && debounce){
      if(!gpio_status){
        pinOn()
      }else{
        pinOff()
      }
      debounce = false;
      setInterval(()=>{
        debounce = true
      },1000)
    }
});
gpio.setup(setPin, gpio.DIR_OUT, function(){
  console.log("Pin"+setPin+" has been setup");
  gpio.write(setPin, true)
});
function pinOn(){
  gpio.write(setPin, false);
  gpio_status = true
}
function pinOff(){
  gpio.write(setPin, true);
  gpio_status = false
}

// Server setup
var app = express();
var server = app.listen(8080, listening);
function listening(){
  console.log("Listening on port 8080");
}
app.use(express.static(path.join(__dirname, 'public')));

// ╔═════════════════════════════════════════════════════════════════════════════╗
// ║                        Adding and saving time                               ║
// ╚═════════════════════════════════════════════════════════════════════════════╝
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//Adding the new inputed data to the json file
app.post("/dataInput", urlencodedParser, dataInput);
// Raw data into a object
  function dataInput(request, response){
    console.log(request.body);
    var data = request.body,
        date = data.date,
        hour = data.hour,
        minute = data.minute;
    // Adding it to the array
    var index = time.length;
    time[index] = {};
    time[index].date = Number(date);
    time[index].hour = Number(hour);
    time[index].minute = Number(minute);
    response.send("Added");

    // Sorting the array ascending
    time.sort(function(a,b){
      if(a.date == b.date){
        if(a.hour == b.hour){
          return a.minute-b.minute;
        }else{
          return a.hour-b.hour;
        }
      }else{
        return a.date-b.date;
      };
    });
    // Save Temp DB to dataBase.json
    saveDB();
  };

  app.post("/setRepTime", urlencodedParser, dataInputRep);
  // Raw data into a object
    function dataInputRep(req, res){
      data = qs.parse(req.body);
      var hour = data.hour;
      var minute = data.minute;
      var daysArray = data.days;
      for(i=0;i<7;i++){
        daysArray[i] = (daysArray[i] === "true")
      }
  // Adding it to the array
      var index = repeatTime.length;
      repeatTime[index] = {};
      repeatTime[index].days = daysArray
      repeatTime[index].hour = Number(hour);
      repeatTime[index].minute = Number(minute);
      res.send("data has been recieved")
      // Save Temp DB to dataBase.json
      repeatTime.sort(function(a,b){
        return a.hour-b.hour;
      });
      saveDB();
    };

    // ╔═════════════════════════════════════════════════════════════════════════════╗
    // ║                                 Requests                                    ║
    // ╚═════════════════════════════════════════════════════════════════════════════╝
// all the diffrent get requests
app.get("/list", sendList);
  function sendList(req, res) {
      res.send(time);
  };
app.get("/listRep", sendListRep);
  function sendListRep(req, res) {
      res.send(repeatTime);
  };
app.get("/alarm/:option", alarmOptions);
  function alarmOptions(req, res) {
    if (req.params.option == "set") {
      alarmOn = true;
      alarmCheck();
      res.send("alarm has been set")
    }else if(req.params.option == "unset"){
      alarmOn = false;
      alarmCheck();
      res.send("alarm has been unset")
    }else if(req.params.option == "status"){
      res.send(alarmOn)
    }else{
      res.send("Unknown option")
    }
  };
app.get("/setLight/:status", setLight);
  function setLight(req, res){
    if(req.params.status == "on"){
      pinOn();
      res.send("set light to ON");
    }else if(req.params.status == "off"){
      pinOff();
      res.send("set light to OFF");
    }else{
      res.send("Not a status")
    }
  };
app.get("/gpiostatus", gpiostatus);
  function gpiostatus(req, res){
      res.send(gpio_status);
  };
app.get("/remove/:index", removeTimeGet);
  function removeTimeGet(req, res){
    var index = req.params.index;
    removeTime(index);
  };
app.get("/removeRep/:index", removeTimeRepGet);
  function removeTimeRepGet(req, res){
    var index = req.params.index;
    removeRepeatTime(index);
  };

  // ╔═════════════════════════════════════════════════════════════════════════════╗
  // ║                             Database updates                                ║
  // ╚═════════════════════════════════════════════════════════════════════════════╝
// remove a time object for the time array
function removeTime(index){
  time.splice(index,1);
  console.log("removed: " + index)
  saveDB()
};
function removeRepeatTime(index){
  repeatTime.splice(index,1);
  console.log("removed repeat time: " + index)
  saveDB()
};
// Saving the temp json to the dataBase.json file
function saveDB(){
  var data = JSON.stringify(dataBase, null, 2);
  fs.writeFile(path.join(__dirname, 'dataBase.json'), data, dataSaved);
    function dataSaved(err){
      console.log("Data saved to dataBase.json");
      if(err){
        console.log(err);
      };
    };
  };

  // ╔═════════════════════════════════════════════════════════════════════════════╗
  // ║                             Alarm checking                                  ║
  // ╚═════════════════════════════════════════════════════════════════════════════╝
var date, hour, minute, second
// Setting of the var's and extracting time form Date object
function getTime(){
  var Udate = new Date();
  day = Udate.getDay();
  date = Udate.getDate();
  hour = Udate.getHours();
  minute = Udate.getMinutes();
  second = Udate.getSeconds();
};
function alarmCheck(){
  getTime()
  // Repeat time check
  for(i=0;i<repeatTime.length;i++){
    setHour = repeatTime[i].hour;
    setMinute = repeatTime[i].minute;
    setToday = (repeatTime[i].days[day] == true);
    if((setHour == hour) && (setMinute == minute) && setToday){
      pinOn();
      alarmOn = false;
      break;
    }
  }
  // Singel times list check
  for(i=0;i<time.length;i++){
    setDate = time[i].date;
    setHour = time[i].hour;
    setMinute = time[i].minute;
  // Testing if current time = set time
    if((setDate == date) && (setHour == hour) && (setMinute == minute)){
      pinOn();
      alarmOn = false;
      removeTime(i);
      break;
    }
  }
// Restart the function aslong as the alarm hasn't been triggerd
  if(alarmOn){
    setTimeout(function(){alarmCheck()}, 10000);
  }
};
alarmCheck();
