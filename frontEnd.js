// toggle the gpio pin
$(document).ready(function() {
  var date = new Date();
  var month, day, hour, minute, second
  // Number to 3characters
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep","Oct","Nov","Dec"];
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  // Setting of the var's
  month = months[date.getMonth()];
  day = days[date.getDay()];
  dateD = date.getDate();
  hour = date.getHours();
  minute = date.getMinutes();
  second = date.getSeconds();
  //First set of time from default value's
  var $day = $("#day"),
      $date = $("#date"),
      $month = $("#month"),
      $hour = $("#hour"),
      $minute = $("#minute"),
      $second = $("#second"),
      $displayTimes = $("#displayTimes"),
      $repDisplayTimes = $("#repDisplayTimes"),
      $alarmOn = $("#alarmOn");

  $day.text(day);
  $date.text(dateD);
  $month.text(month);
  $hour.text(hour);
  $minute.text(minute);
  $second.text(second);

  setInterval( function(){
  	// Create a newDate() object and extract the seconds of the current time on the visitor's
    var seconds = new Date().getSeconds();
  	// Add a leading zero to seconds value
  	$("#second").html(( seconds < 10 ? "0" : "" ) + seconds);
  },1000);

  setInterval( function(){
    	// Create a newDate() object and extract the minutes of the current time on the visitor's
    	var minutes = new Date().getMinutes();
    	// Add a leading zero to the minutes value
    	$("#minute").html(( minutes < 10 ? "0" : "" ) + minutes);
  },1000);
  setInterval( function(){
  	// Create a newDate() object and extract the hours of the current time on the visitor's
  	var hours = new Date().getHours();
  	// Add a leading zero to the hours value
  	$("#hour").html(( hours < 10 ? "0" : "" ) + hours);
  }, 1000);

  // ╔═════════════════════════════════════════════════════════════════════════════╗
  // ║                                Get request                                  ║
  // ╚═════════════════════════════════════════════════════════════════════════════╝
  // Turn alarm On
  var alarm_status
  $("#setAlarm").click(function(){
    if(alarm_status){
      $.get("alarm/unset");
    }else{
      $.get("alarm/set");
    }
    alarmStatus();
  });
  // Checking if alarm is on
  function alarmStatus(){
      $.get("/alarm/status", function(data){
        alarm_status = data
        if(data == true){
          $("#setAlarm").removeClass("off")
          $("#setAlarm").addClass("on");
        }else{
          $("#setAlarm").removeClass("on");
          $("#setAlarm").addClass("off");
        }
      });
  };
  // Light Check
  function lightStatus(){
    $.get("/gpiostatus", function(data){
      if(data == true){
        $("#off").removeClass("off");
        $("#on").addClass("on");
      }else{
        $("#on").removeClass("on");
        $("#off").addClass("off");
      }
    });
  }
  // Light on switch
  $("#on").click(function(){
      $.get("/setLight/on");
      lightStatus();
  });
  // Light off switch
  $("#off").click(function(){
      $.get("/setLight/off");
      lightStatus();
  });
  // Getting data from server and updating the set times
  function getTimesList(){
    $.get("/list", function(data){
      displayTime(data)
    });
    function displayTime(time){
      $displayTimes.html("");
      $(time).each(function(i){
        $displayTimes.append("<li id="+i+"><a href='#' class='clearitem'> Time set on: " + this.date + " is " + this.hour + ":" + this.minute + "</a></li>")
      });
      $('#displayTimes a.clearitem').on('click', function() {
          remove($(this).parent().attr("id"))
      });
    }
  }
  // Getting data from server and updating the set times
  function getRepTimesList(){
    $.get("/listRep", function(data){
      repDisplayTime(data)
    });
    function repDisplayTime(timeRep){
      $repDisplayTimes.html("");
      $(timeRep).each(function(i){
        var days = this.days,
            sun = days[0],
            mon = days[1],
            tue = days[2],
            wed = days[3],
            thu = days[4],
            fri = days[5],
            sat = days[6],
            onDays = "";
        if(sun === true){
          onDays = onDays + "Sun "
        }
        if(mon === true){
          onDays = onDays + "Mon "
        }
        if(tue === true){
          onDays = onDays + "Tue "
        }
        if(wed === true){
          onDays = onDays + "Wed "
        }
        if(thu === true){
          onDays = onDays + "Thu "
        }
        if(fri === true){
          onDays = onDays + "Fri "
        }
        if(sat === true){
          onDays = onDays + "Sat "
        }
        $repDisplayTimes.append("<li id="+i+"><a href='#' class='clearitem'> "+this.hour+":"+this.minute+" has been set on "+onDays+"</a></li>")

      });
      $('#repDisplayTimes a.clearitem').on('click', function() {
          removeRep($(this).parent().attr("id"))
          console.log($(this).parent().attr("id"));
      });
    }
  }

  // ╔═════════════════════════════════════════════════════════════════════════════╗
  // ║                                Post requests                                ║
  // ╚═════════════════════════════════════════════════════════════════════════════╝
  // Button clicked run funcion
  // Pulling data from input forms
  function formCheck(type){
    dateIn = $("#dateIn").val();
    hourIn = $("#hourIn").val();
    minuteIn = $("#minuteIn").val();
    var sun = $("input[name='sun']").prop("checked"),
        mon = $("input[name='mon']").prop("checked"),
        tue = $("input[name='tue']").prop("checked"),
        wed = $("input[name='wed']").prop("checked"),
        thu = $("input[name='thu']").prop("checked"),
        fri = $("input[name='fri']").prop("checked"),
        sat = $("input[name='sat']").prop("checked"),
    dayselected = (sun || mon || tue || wed || thu || fri || sat)
    if(type == "single"){
      if(dateIn == "" || hourIn == "" || minuteIn == "" || 0 > dateIn || dateIn > 32 || -1 > hourIn || hourIn > 23 || -1 > minuteIn || minuteIn > 59){
        return true;
      }else{
        return false;
      }
    }else if(type == "rep"){
      if(hourIn == "" || minuteIn == "" || -1 > hourIn || hourIn > 23 || -1 > minuteIn || minuteIn > 59 || !dayselected){
        return true;
      }else{
        return false;
      }
    }
  }
  function getType() {
    var dateIn = $("#dateIn").val()
        sun = $("input[name='sun']").prop("checked"),
        mon = $("input[name='mon']").prop("checked"),
        tue = $("input[name='tue']").prop("checked"),
        wed = $("input[name='wed']").prop("checked"),
        thu = $("input[name='thu']").prop("checked"),
        fri = $("input[name='fri']").prop("checked"),
        sat = $("input[name='sat']").prop("checked");

    var dayselected = (sun || mon || tue || wed || thu || fri || sat)
    if(dateIn !== "" && !dayselected){
      return "single"
    }else if(dayselected && dateIn == ""){
      return "repeat"
    }
  }
  function submit(){
    var type = getType()
    if(type == "single"){
      if(formCheck("single")){
        alert("Please fill in the forms correct")
      }else{
        sendData();
        clearForm();
      }
    }else if(type=="repeat"){
      if(formCheck("rep")){
        alert("Please fill in the forms correct")
      }else{
        sendDataRep();
        clearForm();
      }
    }else{
      alert("Choose a date or a day")
    }
    function clearForm(){
      $("#dateIn").val("");
      $("#hourIn").val("");
      $("#minuteIn").val("");
    }
  }
  $("#submit").click(function(){
    submit()
  });
  function sendData(){
    var date = $("#dateIn").val();
    var hour = $("#hourIn").val();
    var minute = $("#minuteIn").val();
    var data = {"date":date,"hour":hour,"minute":minute};
    // Sending data to server using ajax
    $.post("/dataInput", data);
    getTimesList();
  }
  function removeRep(i){
    $.get("/removeRep/"+i);
    getRepTimesList();
  }
  function remove(i){
    $.get("/remove/"+i);
    getTimesList();
  }
  // Sending Rep times
  $("#submitRep").click(function(){
    sendDataRep();
  });
  function sendDataRep(){
    var sun = $("input[name='sun']").prop("checked"),
        mon = $("input[name='mon']").prop("checked"),
        tue = $("input[name='tue']").prop("checked"),
        wed = $("input[name='wed']").prop("checked"),
        thu = $("input[name='thu']").prop("checked"),
        fri = $("input[name='fri']").prop("checked"),
        sat = $("input[name='sat']").prop("checked"),
        hour = $("#hourIn").val(),
        minute = $("#minuteIn").val(),
        days = [sun,mon,tue,wed,thu,fri,sat],
        data = {"days":days,"hour":hour,"minute":minute};
  // Sending data to server using ajax
  $.post("/setRepTime", data);
    getRepTimesList();
  };
  setInterval( function() {
    getTimesList();
    getRepTimesList();
    alarmStatus();
    lightStatus();
  },10000);
  // Running essential scripts
  getTimesList();
  getRepTimesList();
  alarmStatus();
  lightStatus();
});
