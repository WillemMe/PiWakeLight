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
  var $day = $("#day");
  var $date = $("#date");
  var $month = $("#month");
  var $hour = $("#hour");
  var $minute = $("#minute");
  var $second = $("#second");
  var $displayTimes = $("#displayTimes");
  var $repDisplayTimes = $("#repDisplayTimes");
  var $alarmOn = $("#alarmOn");

  $day.text(day);
  $date.text(dateD);
  $month.text(month);
  $hour.text(hour);
  $minute.text(minute);
  $second.text(second);

  setInterval( function() {
  	// Create a newDate() object and extract the seconds of the current time on the visitor's
  	var seconds = new Date().getSeconds();
  	// Add a leading zero to seconds value
  	$("#second").html(( seconds < 10 ? "0" : "" ) + seconds);
  	},1000);

 setInterval( function() {
  	// Create a newDate() object and extract the minutes of the current time on the visitor's
  	var minutes = new Date().getMinutes();
  	// Add a leading zero to the minutes value
  	$("#minute").html(( minutes < 10 ? "0" : "" ) + minutes);
      },1000);
  setInterval( function() {
  	// Create a newDate() object and extract the hours of the current time on the visitor's
  	var hours = new Date().getHours();
  	// Add a leading zero to the hours value
  	$("#hour").html(( hours < 10 ? "0" : "" ) + hours);
      }, 1000);

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  GET REQUESTS  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  // Turn alarm On
  var alarm_status
  $("#setAlarm").click(function(){
    if(alarm_status){
      $.get("/unsetAlarm");
    }else{
      $.get("/setAlarm");
    }
    alarmStatus();
  });
  // Checking if alarm is on
  function alarmStatus(){
      $.get("/alarmOn", function(data){
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
      $.get("/on");
      lightStatus();
  });
  // Light off switch
  $("#off").click(function(){
      $.get("/off");
      lightStatus();
  });
  // Submit Remove
  $("#removeButton").click(function(){
    if($("#removeIn").val() == ""){
      alert("Please give number to remove!")
    }else{
      if($("#radio-1").prop("checked")){
        remove();
      }else if($("#radio-2").prop("checked")){
        removeRep();
      }else{
        alert("Select alarm type!")
      }
    }
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
        var days = this.days
        var sun = days[0];
        var mon = days[1];
        var tue = days[2];
        var wed = days[3];
        var thu = days[4];
        var fri = days[5];
        var sat = days[6];
        var onDays = ""
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
      });
    }
  }


  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  POST REQUESTS  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  // Button clicked run funcion
  // Pulling data from input forms
  function formCheck(type){
    dateIn = $("#dateIn").val()
    hourIn = $("#hourIn").val()
    minuteIn = $("#minuteIn").val()
    var sun = $("input[name='sun']").prop("checked");
    var mon = $("input[name='mon']").prop("checked");
    var tue = $("input[name='tue']").prop("checked");
    var wed = $("input[name='wed']").prop("checked");
    var thu = $("input[name='thu']").prop("checked");
    var fri = $("input[name='fri']").prop("checked");
    var sat = $("input[name='sat']").prop("checked");
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
  function submit(){
    if($("#radio-1").prop("checked")){
      if(formCheck("single")){
        alert("Please fill in the forms correct")
      }else{
        sendData();
        clearForm();
      }
    }else if($("#radio-2").prop("checked")){
      if(formCheck("rep")){
        alert("Please fill in the forms correct")
      }else{
        sendDataRep();
        clearForm();
      }
    }else{
      alert("Select alarm type!")
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
  };
  // removing enty
  function remove(i){
    if($("#removeIn").val() == ""){
      index = i
    }else{
      var index = $("#removeIn").val();
    }
    $.get("/remove/"+index);
    getTimesList();
  }
  function removeRep(i){
    if($("#removeIn").val() == ""){
      index = i
    }else{
      var index = $("#removeIn").val();
    }
    $.get("/removeRep/"+index);
    getRepTimesList();
  }
  // Sending Rep times
  $("#submitRep").click(function(){
    sendDataRep();
  });
  function sendDataRep(){
    var sun = $("input[name='sun']").prop("checked");
    var mon = $("input[name='mon']").prop("checked");
    var tue = $("input[name='tue']").prop("checked");
    var wed = $("input[name='wed']").prop("checked");
    var thu = $("input[name='thu']").prop("checked");
    var fri = $("input[name='fri']").prop("checked");
    var sat = $("input[name='sat']").prop("checked");
    var hour = $("#hourIn").val();
    var minute = $("#minuteIn").val();
    var days = [sun,mon,tue,wed,thu,fri,sat]
    var data = {"days":days,"hour":hour,"minute":minute};
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
