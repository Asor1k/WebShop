$("#place").click(function()
{
  alert("Hi");
});

$("#sort").click(function()
{
  getSortedPruductsFromDB();
});

getSortedProducts = (data) =>
{
  let products = [];
  let names = [];
  for (let dataChunk of data)
  {
    names.push(dataChunk.brand);
  }
  names.sort();

  console.log(names);
  let ids = [];

  for (let name of names)
  {
    for (let dataChunk of data)
    {
      if (name == dataChunk.brand)
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

  console.log(products);
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
    "<img src='" + dataChunk.image +"' alt='" + dataChunk.brand+"'</img>"+
       "<p>Brand:"+ dataChunk.brand + "</p>"+
       "<p>OS:"+ dataChunk.os +"</p>" +
       "<p>Model:"+ dataChunk.model + "</p>" +
       "<p> Screensize:" + dataChunk.screensize + "</p>" +
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
getSortedPruductsFromDB = () =>
{
  let requestData = [];
  $.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function(data)
  {
    $("#products").html(getProducts(getSortedProducts(data)));
  }, "json");
}

getProductsFromDB();
