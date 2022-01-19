"use strict";

$("#place").click(function()
{
  console.warning("hi");
});

$("#sortAlph").click(function()
{
  console.log("Work");
  let requestData = [];
  $.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function(data)
{
  for(let dataChunk in data)
  {
  $("#products").html("<td class=\'item\'>" +
  "<img src=>" + dataChunk.image +
     "<p>Brand:"+ dataChunk.brand + "</p>"+
     "<p id=\'lowOS\'>OS:"+ dataChunk.os +"</p>" +
     "<p>Model:"+ dataChunk.model + "</p>" +
     "<p> Screensize:" + dataChunk.screensize + "</p>" +
  "</td>");
  }
}, "json");

});
