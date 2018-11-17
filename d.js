 function myFunction3() {
   d3.select("svg").remove();
        var request;
        var input1 = document.getElementById('time3');
   console.log(input1.value);

   // get correct date (had issue with new Date() off by one day)
   var dateArray = input1.value.split("-");
   var year = dateArray[0];
   var month = parseInt(dateArray[1], 10) - 1;
   var _entryDate = new Date(year, month);
   console.log(_entryDate);
   
   // convert date to unix for starttime
   var d1 = _entryDate;
   
        var m = d1.getMonth();
        d1.setMonth(d1.getMonth());
        
        d1.setHours(0, 0, 0);
        d1.setMilliseconds(0);

        // Get the time value in milliseconds and convert to seconds
        console.log(d1 / 1000 | 0);
      var StartunixTime = d1 / 1000 | 0;
   
  /*    convert unixtime to date  
var date = new Date(input1.value*1000);
   
   console.log(date);
   
      var now = date;
      now = new Date(now.getTime());
      var year = "" + now.getFullYear();
      var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
      var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
      var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
      var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
      var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
      var date = year + "-" + month + "-" + day+ " " + hour + ":" + minute + ":" + second;
   
console.log(date);
   
        var d = new Date(date);
   */
        // convert date to unix for endtime with one month added
        var d = _entryDate;
        var m = d.getMonth();
        d.setMonth(d.getMonth() + 1);

        // If still in same month, set date to last day of 
        // previous month
        if (d.getMonth() == m) d.setDate(0);
        d.setHours(0, 0, 0);
        d.setMilliseconds(0);

        // Get the time value in milliseconds and convert to seconds
        console.log(d / 1000 | 0);
        var unixTime = d / 1000 | 0;
        var endTime = unixTime;
   
        var startTime = StartunixTime;
        var api = 'http://db.sead.systems:8080/466419818?start_time=';
        var api1 = '&end_time='
        var api2= '&list_format=energy&granularity=3600&device=PowerS&type=P';
        var sum = api + startTime + api1 + endTime + api2;
   
        console.log(sum)

        request = new XMLHttpRequest();

        request.open('GET', sum, true);
        request.onload = function () {

        var data = JSON.parse(this.response);
        
        var JSONObject = JSON.parse(JSON.stringify(data));
  data = JSONObject["data"];
  console.log(data)
          
          data.forEach(function(d) {
    d.time = new Date(d.time);
  });

  console.log(data);

  data = fillInDates(data);
    
  console.log(data);
          
          
  
  if (request.status >= 200 && request.status < 400) {
    data.forEach(d => {
      
      var now = d.time;
      now = new Date(now.getTime());
      var year = "" + now.getFullYear();
      var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
      var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
      var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
      var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
      var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
      var date = year + "-" + month + "-" + day;
      var time = hour + ":" + minute + ":" + second;

      d.Day = date;
      d.Time = time;


      function scientificToDecimal(num) {
        if(num < 0){
          if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
              var zero = '0',
                  parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
                  e = parts.pop(),//store the exponential part
                  l = Math.abs(e), //get the number of zeros
                  sign = e/l,
                  coeff_array = parts[0].split('.');
              if(sign === -1) {
                  coeff_array[0] = Math.abs(coeff_array[0]);
                  num = '-'+zero + '.' + new Array(l).join(zero) + coeff_array.join('');
              }
              else {
                  var dec = coeff_array[1];
                  if(dec) l = l - dec.length;
                  num = coeff_array.join('') + new Array(l+1).join(zero);
              }
          } 
        }
        else{
          if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
              var zero = '0',
                  parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
                  e = parts.pop(),//store the exponential part
                  l = Math.abs(e), //get the number of zeros
                  sign = e/l,
                  coeff_array = parts[0].split('.');
              if(sign === -1) {
                  coeff_array[0] = Math.abs(coeff_array[0]);
                  num = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
              }
              else {
                  var dec = coeff_array[1];
                  if(dec) l = l - dec.length;
                  num = coeff_array.join('') + new Array(l+1).join(zero);
              }
          } 
        }
        return num;
      };

      var energy = scientificToDecimal(d.energy);
      d.Energy = energy;
      
    });
  } else {
    console.log('error');
  }
  
  console.log(data);

   
  let min = data[0].Energy, max = data[0].Energy;
  
  console.log(min);
  console.log(max);
  
    for (let i = 1, len=data.length; i < len; i++) {
      let v = data[i].Energy;
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
  
  console.log(min);
  console.log(max);


  var dataDisplayed = data;
  var datasetDisplayed = data;
  var radial_labels = [];

  getRadialLabels(dataDisplayed);
  drawSlider(dataDisplayed);

var segment_labels = ["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am",
                        "11am", "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];
  var numSegments = segment_labels.length;// label length is 24 as 24 hours 
  var range_blue = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]; //color for data
  var index_one = 0;

  //draw first chart
  var chart = d3.circularHeat()
          .domain([min, max/4, max/2, max])
          .range(range_blue)
          .radialLabels(radial_labels)
          .segmentLabels(segment_labels)
          ._index(index_one);

  chart.accessor(function (d) {
      return d.Energy;
  });

  d3.select("dcontent")
      .datum(dataDisplayed)
      .call(chart);

  //hover effect params
  var innerRadius = chart.innerRadius();
  chart.numSegments();
  var segmentHeight = chart.segmentHeight();
  var svg = d3.select("dcontent");

  // call mouseover event
  chart.on("customHover", mouseover(svg, index_one, innerRadius, numSegments, segmentHeight, dataDisplayed));


  // legend
  var linearV = d3.scale.linear()
          .domain([min, max/4, max/2, max])
          .range(range_blue); // color for range

  var svg = d3.select("svg");

  svg.append("g")
      .attr("class", "legendV")
      .attr("transform", "translate(10,30)");

  var legendV = d3.legend.color()
          .shapeWidth(30)
          .cells(13)
       // .labelFormat(d3.format('.3f'))
          .scale(linearV)
          .title("in KWh");

  svg.select(".legendV")
      .call(legendV);


  var tooltip = d3.select("body")
          .append("div")
          .classed("radial-tooltip", true)
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden");

  // Formats the HTML for tooltip based on the data.
  var getTooltipHTML = function (d) {
      var html = '<p>';
      var Day = d.Day;
      var Time = d.Time;
      var Energy  = d.Energy;

      if (Day    !== null) {
          html += "Day: " + Day     + '<br/>';
      }
      if (Time   !== null) {
          html += "Time: " +  Time     + '<br/>';
      }
      if (Energy !== null) {
          html += "Energy: " +  Energy    + '<br/>';
      }

      html += '</p>';
      return html;
  };

  
  var filtered = [];



  //functions
  function addHours(date, hours) {
        var result = new Date(date);
        result.setHours(date.getHours() + hours);
        return result;
    }
  function fillInDates(data){
      var currentDates = {};
      var maxDate = new Date(-1e15);
      var minDate = new Date(1e15);
    console.log(maxDate);
      for (var i = 0; i < data.length; i++){
          if (data[i]['time'] > maxDate){
              maxDate =  data[i]['time'];
          }
          if (data[i]['time'] < minDate){
              minDate = data[i]['time'];
          }
          currentDates[data[i]['time']]= data[i]['energy'];
      }
      var filledInDates = [];
      while (minDate <= maxDate){
          filledInDates.push({"time":minDate, "energy":currentDates[minDate] ? currentDates[minDate] : 0});  
          minDate = addHours(minDate, 1);
      }
      return filledInDates;              
  }


  function swapDataset(passedData, radiallabels) {
      chart.radialLabels(radiallabels)
           .domain([min, max/4, max/2, max])
           .range(range_blue);
      d3.select("dcontent")
          .datum(passedData)
          .call(chart);
      drawSlider(passedData);
  }


  //update radial labels based on data
  function getRadialLabels(passedData) {	
      var groupedData = _.groupBy(passedData, 'Day');
      for (var k in groupedData) radial_labels.push(k);
  }

  //update viz
  function updateChart(passedData,radiallabels){
      chart.radialLabels(radiallabels)
           .domain([min, max/4, max/2, max])
           .range(range_blue);
      d3.select("dcontent")
        .datum(passedData)
        .call(chart);
  }

  function mouseover(svg,index,innerRadius,numSegments,segmentHeight,passedData){
   svg.selectAll("path.segment"+index)
      .on("mouseover", function(d, i) {
          var targetIndex = Math.floor(i / numSegments); //the layer you are hovering
          var zoomSize = 20; //inner 5px and outer 5px
          var layerCnt = passedData.length / numSegments; //layer count, number of layers
          if(data.length < 400){
              d3.selectAll("path.segment"+index) //.arc indicates segment
                  .transition()
                  .duration(200)
                  .attr("d",d3.svg.arc()
                        .innerRadius(ir)
                        .outerRadius(or)
                        .startAngle(sa)
                        .endAngle(ea));
          }
          else{
              d3.selectAll("path.segment"+index)
                  .transition()
                  .duration(0) //transtion effect
                  .attr("d", d3.svg.arc() //set d again
                        .innerRadius(ir)
                        .outerRadius(or)
                        .startAngle(sa)
                        .endAngle(ea));              
          }
          function getRadius(floor) {
              if (floor === 0) { //inner radius doesn't change
                  return innerRadius;
              }
              if (floor === layerCnt) { //outer radius doesn't change
                  return innerRadius + layerCnt * segmentHeight;
              }
              if (floor <= targetIndex) { //it's math
                  return innerRadius + floor * segmentHeight - zoomSize * (floor / targetIndex);
              } 
              else { //math again
                  return innerRadius + floor * segmentHeight + zoomSize * ((layerCnt - floor) / (layerCnt - targetIndex));
              }
          }
          function ir(d, i) {
              return getRadius(Math.floor(i / numSegments));
          }
          function or(d, i) {
              return getRadius(Math.floor(i / numSegments) + 1);
          }
          var tooltipHTML = getTooltipHTML(d);
          tooltip.html(tooltipHTML);
          return tooltip.style("visibility", "visible");
          })

          .on("mousemove", function(d, i) {
              return tooltip
                  .style("top", (d3.event.pageY-10)+"px")
                  .style("left",(d3.event.pageX+10)+"px");
          })

          .on("mouseout", function(){
              return tooltip.style("visibility", "hidden");

              var targetIndex = Math.floor(i / numSegments);
              var zoomSize = 5;
              var layerCnt = passedData.length / numSegments;
              d3.selectAll("path.segment"+index)
                  .transition()
                  .duration(0)
                  .attr("d", d3.svg.arc()
                        .innerRadius(ir)
                        .outerRadius(or)
                        .startAngle(sa)
                        .endAngle(ea))
              function getRadius(floor) {
                  return innerRadius + floor * segmentHeight;
              }
              function ir(d, i) {
                  return getRadius(Math.floor(i / numSegments));
              }
              function or(d, i) {
                  return getRadius(Math.floor(i / numSegments) + 1);
              }

          });
  }

  //get start and end date dynamically for slider
  function getDateRange(dataPassed){
      //called by slider start & end dates
      //get first object in dataPassed array, and get the date
      firstObj=dataPassed.filter(function(d,i){
          return i==0
      });
      //get last object in dataPassed array, and get the date
      lastObj =  dataPassed.filter(function(d,i){
          return i==dataPassed.length-1
      });
      datefrom = firstObj[0].Day;
      dateto=lastObj[0].Day;
      datejson = {'start':datefrom,'end':dateto};
      return datejson;
  }


  function drawSlider(passedData){
      //called by swapDataset
      //calls getDateRange
      $("#3slider-range").empty();

      var dt_from =  getDateRange(passedData)['start'];
      var dt_to = getDateRange(passedData)['end'];

      $('#3slider-time').html(dt_from);
      $('#3slider-time2').html(dt_to);
      var min_val = Date.parse(dt_from)/1000;
      var max_val = Date.parse(dt_to)/1000;

      function zeroPad(num, places) {
          var zero = places - num.toString().length + 1;
          return Array(+(zero > 0 && zero)).join("0") + num;
      }

      function formatDT(__dt) {
          var year = __dt.getFullYear();
          //+1 day and +1 month important
          var month = zeroPad(__dt.getMonth()+1, 2);
          var date = zeroPad(__dt.getDate(), 2);
          return year + '-' + month + '-' + date ;
      };



      $("#3slider-range").slider({
          range: true,
          min: min_val,
          max: max_val,
          step: 10,
          values: [min_val, max_val],
          slide: function (e, ui) {
              var dt_cur_from = new Date(ui.values[0]*1000);
              $('#3slider-time').html(formatDT(dt_cur_from));
              var dt_cur_to = new Date(ui.values[1]*1000);           
              $('#3slider-time2').html(formatDT(dt_cur_to));
          },
          stop: function(e, ui) { 
              var html = $('#3slider-time').html();
              var html2 = $('#3slider-time2').html();
              filterData(html,html2) 
          }
      });
  }

function filterData(start,end){
      //called by slider drag stop event
      //calls updateChart
      //console.log(data);
      filtered = datasetDisplayed.filter(function(d){ return d.Day >=  start && d.Day <= end; })
      //console.log(filtered);
      radial_labels = [];
      getRadialLabels(filtered);
      updateChart(filtered,radial_labels);
      dataDisplayed = filtered;
      segmentHeight = (500 - 2 * innerRadius) / (2 * radial_labels.length);// must be dynamic fix it
      index=0;
      chart.on("customHover", mouseover(svg,index,innerRadius,numSegments,segmentHeight,dataDisplayed));
  }

}


request.send();
 }
