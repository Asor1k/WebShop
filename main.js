let options = "<select  id=\"azSort\" name=Brand><option value = \"az\" > A to Z</option><option value = \"za\" > Z to A </option></select>";
let sorters = [0,0,0,0];
let sortersNames = ["brand", "os", "model", "screen"];
let numberOptions = "<select id=\"azSort\" name=Brand><option value = \"az\" > Lo to Hi</option><option value = \"za\" > Hi to Lo </option></select>";


$("#place").click(function()
{
  alert("Hi");
});

$("#azSort").click(function()
{
    let sortIndex = -1;
    for (let i=0; i < sorters.length; i++)
    {
      if(num == 1)
        sortIndex = i;
    }
    console.log("sort");
    var value = $(this).val();
    if (value == "az")
    {
      getSortedPruductsFromDB(sortersNames[sortIndex]);
    }
    else {
      getSortedPruductsFromDB(sortersNames[sortIndex], true);
    }
});

$("#sortBrand").click(function()
{
  if(sorters[0] == 1) return;
  getSortedPruductsFromDB("brand");
  clearSorters();
  $("#sortBrand").html("Brand "+options);
  sorters[0] = 1;
  sorters[1] = 0;
  sorters[2] = 0;
  sorters[3] = 0;
});

$("#sortOs").click(function()
{
  if(sorters[1] == 1) return;
  getSortedPruductsFromDB("os");
  clearSorters();
  $("#sortOs").html("OS "+options);
  sorters[0] = 0;
  sorters[1] = 1;
  sorters[2] = 0;
  sorters[3] = 0;
});

$("#sortModel").click(function()
{
  if(sorters[2] == 1) return;
  getSortedPruductsFromDB("model");
  clearSorters();
  $("#sortModel").html("Model "+options);
  sorters[0] = 0;
  sorters[1] = 0;
  sorters[2] = 1;
  sorters[3] = 0;
});

$("#sortScreen").click(function()
{
  if(sorters[3] == 1) return;
  getSortedPruductsFromDB("screen");
  clearSorters();
  $("#sortScreen").html("Screensize "+numberOptions);
  sorters[0] = 0;
  sorters[1] = 0;
  sorters[2] = 0;
  sorters[3] = 1;
});

clearSorters = () =>
{
  $("#sortBrand").html("Brand");
  $("#sortModel").html("Model");
  $("#sortOs").html("OS");
  $("#sortScreen").html("Screensize");
}

getSortedProducts = (data, sortType, isReverse) =>
{
  let products = [];
  let values = [];
  for (let dataChunk of data)
  {
    if (sortType == "brand")
    {
        values.push(dataChunk.brand.toUpperCase());
    }
    if(sortType == "os")
    {
      values.push(dataChunk.os.toUpperCase());
    }
    if(sortType == "model")
    {
      values.push(dataChunk.model.toUpperCase());
    }
    if(sortType == "screen")
    {
      values.push(dataChunk.screensize);
    }
  }
  if(sortType == "screen")
  {
    values.sort((a,b) => a-b);
  }
  else
  {
    values.sort();
  }

  let ids = [];

  for (let value of values)
  {
    for (let dataChunk of data)
    {
      let chunkValue;
      if (sortType == "brand")
      {
          chunkValue = dataChunk.brand.toUpperCase();
      }
      if(sortType == "os")
      {
        chunkValue = dataChunk.os.toUpperCase();
      }
      if(sortType == "model")
      {
        chunkValue = dataChunk.model.toUpperCase();
      }
      if (sortType == "screen")
      {
        chunkValue = dataChunk.screensize;
      }
      if (value == chunkValue)
      {
        let wasPublished = false;
        for(let id of ids)
        {
          if(id == dataChunk.id)
          {
            wasPublished = true;
            break;
          }
        }
        if(!wasPublished)
        {
          products.push(dataChunk);
          ids.push(dataChunk.id);
        }
      }
    }
  }
  if(isReverse)
   products.reverse();
  return products;
}

getProducts = (data) =>
{
  let products = "";
  let numberOfPhones = 0;
  products += "<tr>";
  for(let dataChunk of data)
  {
    if(numberOfPhones % 4 == 0){
      products += "</tr> \n"+"<tr>";
    }
    products += "<td class='item'>" +
    "<img src='" + dataChunk.image +"' alt='" + dataChunk.brand+"'>"+
       "<p>Brand:"+ dataChunk.brand + "</p>"+
       "<p>OS:"+ dataChunk.os +"</p>" +
       "<p>Model:"+ dataChunk.model + "</p>" +
       "<p>Screensize:" + dataChunk.screensize + "</p>" +
    "</td>";
      numberOfPhones++;
  }
  products+= "<td><form action=\"https://wt.ops.labs.vu.nl/api22/25fbcf55\" method=\"post\">"+
        "<label for=\"brand\">Brand:</label><br>"+
        "<input type=\"text\" id=\"brand\" name=\"brand\" placeholder=\"Apple\" required><br>"+
        "<label for=\"model\">Model:</label><br>"+
        "<input type=\"text\" id=\"model\" name=\"model\" placeholder=\"Ipnone 12\" required><br>"+
        "<label for=\"os\">OS:</label><br>"+
        "<input type=\"text\" id=\"os\" name=\"os\" placeholder=\"IOS\" required><br>"+
        "<label for=\"screensize\">Screensize:</label><br>"+
        "<input type=\"number\" id=\"screensize\" name=\"screensize\" placeholder=\"5''\" required><br>"+
        "<label for=\"image\">Image URL:</label><br>"+
        "<input type=\"text\" id=\"image\" name=\"image\" placeholder=\"https://\" required><br><br>"+
        "<input type=\"submit\" value=\"Add product\">"+
     "</form></td>";
  products += "</tr>";
  return products;
}

getProductsFromDB = () =>
{
  let requestData = [];
  $.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function(data)
  {
    $("#products").html(getProducts(data));
  }, "json");
}
getSortedPruductsFromDB = (sortType, isReverse) =>
{
  let requestData = [];
  $.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function(data)
  {
    $("#products").html(getProducts(getSortedProducts(data, sortType, isReverse)));
  }, "json");
}

//getProductsFromDB();
