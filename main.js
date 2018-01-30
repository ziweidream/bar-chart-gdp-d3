$(document).ready(function() {
  var dataset = [];
  function getData(getDataCallBack) {
    $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(data) {
      dataset = data.data;
      getDataCallBack(dataset);
    });
  }
  f = function(dataset) {
    console.log(dataset);
    var margin = {
      top: 90,
      right: 40,
      bottom: 40,
      left: 40
    };
    //width and height
    var w = 900;
    var h = 600;
    var formatTime = d3.timeFormat("%Y - %B");

    // the tooltip
    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    // x scale and y scale
    var xScale = d3.scaleTime().domain([
      new Date(dataset[0][0]),
      new Date(dataset[dataset.length - 1][0])
    ]).range([
      0, w - margin.left - margin.right
    ]);

    var yScale = d3.scaleLinear().domain([
      0,
      d3.max(dataset, function(d) {
        return d[1];
      })
    ]).range([
      h - margin.top - margin.bottom,
      margin.top
    ]);
    //create SVG element
    var svg = d3.select("#root").append("svg").attr("class", "chart").attr("width", w).attr("height", h);
    d3.select("#root").attr("align", "center");
    svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "white").attr("opacity", "1");
    //create bar chart
    svg.selectAll("rect").data(dataset).enter().append("rect").attr("class", "bar").attr("x", function(d) {
      return xScale(new Date(d[0])) + margin.left;
    }).attr("y", function(d) {
      return yScale(d[1]);
    }).attr("width", w / dataset.length).attr("height", function(d) {
      return h - yScale(d[1]) - margin.top - margin.bottom;
    }).attr("fill", "teal").on("mouseover", function(d) { //display tooltip on mouseover
      d3.select(this).attr("fill", "#ffff33");
      div.transition().duration(200).style("opacity", .9);
      div.html(formatTime(new Date(d[0])) + "<br/>" + "$" + d[1] + " Billions").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    }).on("mouseout", function(d) {
      d3.select(this).attr("fill", function() {
        return "teal";
      });
      div.transition().duration(500).style("opacity", 0)
    });
    // x axis and y axis
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    var yAxis = d3.axisLeft(yScale).ticks(10);
    svg.append("g").style("font", "14px").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (
    h - margin.top - margin.bottom) + ")").call(xAxis);
    svg.append("g").style("font", "14px").attr("class", "axis").attr("transform", "translate(" + margin.left + ", 0)").call(yAxis);
    // title
    svg.append("text").attr("x", (w / 2 - 30)).attr("y", margin.top).attr("text-anchor", "middle").style("font-size", "28px").text("US Gross Domestic Product");
    svg.append("text").attr("x", (w / 2 - 30)).attr("y", margin.top + 30).attr("text-anchor", "middle").style("font-size", "20px").text("(1947-2015, seasonal adjustment)");
    // y axis text label
    svg.append("text").attr("transform", "rotate(-90)").attr("y", margin.left + 3).attr("x", 0 - (h / 2) + 20).attr("dy", "1em").style("text-anchor", "middle").text("Billions");

  }

  getData(f);
})
