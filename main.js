let options = "<select  class=\"azSort\" name='Brand'><option value = \"az\" > A to Z</option><option value = \"za\" > Z to A </option></select>";
let sorters = [0, 0, 0, 0];
let sortersNames = ["brand", "os", "model", "screen"];
let numberOptions = "<select class=\"azSort\" name='screensize'><option value = \"az\" > Lo to Hi</option><option value = \"za\" > Hi to Lo </option></select>";
let initialData = [];
let allProducts = [];

$(function ()
{



	$("#reset").click(function ()
	{

		$.get("https://wt.ops.labs.vu.nl/api22/25fbcf55/reset", function (data)
		{
			$("#products").html(getProducts(initialData));
			getProductsFromDB();
		}, "json");
	});
	$(document).on("submit", "#asyncSubmit", function (event)
	{
		event.preventDefault();

		let bodi = {
			brand: $("#brand").val(),
			model: $("#model").val(),
			os: $("#os").val(),
			screensize: $("#screensize").val(),
			image: $("#image").val()
		}
		$.post("https://wt.ops.labs.vu.nl/api22/25fbcf55", bodi)
			.done(function (data)
			{
				let productUrl = data.URI;
				$.get(productUrl, function (data2)
				{
					allProducts.push(data2);
					$("#products").html(getProducts(allProducts));
					clearSorters();
				}, "json");
			});
	});

	$(document).on("change", ".azSort", function ()
	{
		let sortIndex = -1;
		for (let i = 0; i < sorters.length; i++)
		{
			if (sorters[i] == 1)
				sortIndex = i;
		}
		console.log("sort");
		var value = $(this).val();
		if (value == "az")
		{
			getSortedPruductsFromDB(sortersNames[sortIndex]);
		}
		else
		{
			getSortedPruductsFromDB(sortersNames[sortIndex], true);
		}
	});

	$("#sortBrand").click(function ()
	{
		$.get("http://localhost:3000/hello", function(data){
				console.log(data);
		}, 'json');
		if (sorters[0] == 1) return;
		clearSorters();
		getSortedPruductsFromDB("brand");
		$("#sortBrand").html("Brand " + options);
		sorters[0] = 1;
		sorters[1] = 0;
		sorters[2] = 0;
		sorters[3] = 0;
	});

	$("#sortOs").click(function ()
	{
		if (sorters[1] == 1) return;
		clearSorters();
		getSortedPruductsFromDB("os");
		$("#sortOs").html("OS " + options);
		sorters[0] = 0;
		sorters[1] = 1;
		sorters[2] = 0;
		sorters[3] = 0;
	});

	$("#sortModel").click(function ()
	{
		if (sorters[2] == 1) return;
		clearSorters();
		getSortedPruductsFromDB("model");
		$("#sortModel").html("Model " + options);
		sorters[0] = 0;
		sorters[1] = 0;
		sorters[2] = 1;
		sorters[3] = 0;
	});

	$("#sortScreen").click(function ()
	{
		if (sorters[3] == 1) return;
		clearSorters();
		getSortedPruductsFromDB("screen");
		$("#sortScreen").html("Screensize " + numberOptions);
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
		let products = [...data];

		if (sortType == "brand")
		{
			products.sort((a, b) => a.brand.localeCompare(b.brand));
		}
		if (sortType == "os")
		{
			products.sort((a, b) => a.os.localeCompare(b.os));
		}
		if (sortType == "model")
		{
			products.sort((a, b) => a.model.localeCompare(b.model));
		}
		if (sortType == "screen")
		{
			products.sort((a, b) => a.screensize - b.screensize);
		}

		if (isReverse)
		{
			products.reverse();
		}
		return products;

	}

	getProducts = (data) =>
	{
		let $products = $("#products");
		$products.html("");
		let numberOfPhones = 0;
		$products.append("<tr>");

		for (let dataChunk of data)
		{
			if (numberOfPhones % 4 == 0 && numberOfPhones)
			{
				$products.append("</tr><tr>");
			}
			let product = "<td class='item'>" +
				"<img src='" + dataChunk.image + "' alt='" + dataChunk.brand + "'>" +
				"<p>Brand:" + dataChunk.brand + "</p>" +
				"<p>OS:" + dataChunk.os + "</p>" +
				"<p>Model:" + dataChunk.model + "</p>" +
				"<p>Screensize:" + dataChunk.screensize + "</p>" +
				"</td>";

			$products.append(product);
			numberOfPhones++;
		}
		if (numberOfPhones % 4 == 0 && numberOfPhones)
		{
			$products.append("</tr><tr>");
		}
		let form = "<td><form id='asyncSubmit'>" +
			"<label for=\"brand\">Brand:</label><br>" +
			"<input type=\"text\" id=\"brand\" name=\"brand\" placeholder=\"Apple\" required><br>" +
			"<label for=\"model\">Model:</label><br>" +
			"<input type=\"text\" id=\"model\" name=\"model\" placeholder=\"Ipnone 12\" required><br>" +
			"<label for=\"os\">OS:</label><br>" +
			"<input type=\"text\" id=\"os\" name=\"os\" placeholder=\"IOS\" required><br>" +
			"<label for=\"screensize\">Screensize:</label><br>" +
			"<input type=\"number\" id=\"screensize\" name=\"screensize\" placeholder=\"5''\" required><br>" +
			"<label for=\"image\">Image URL:</label><br>" +
			"<input type=\"text\" id=\"image\" name=\"image\" placeholder=\"https://\" required><br><br>" +
			"<input type=\"submit\" value=\"Add product\">" +
			"</form></td>"+
		"</tr>";
		$products.append(form);
	}

	getProductsFromDB = () =>
	{
		let requestData = [];
		$.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function (data)
		{
			initialData = data;
			allProducts = data;
			getProducts(data);
		}, "json");
	}
	getSortedPruductsFromDB = (sortType, isReverse) =>
	{
		let requestData = [];
		$.get("https://wt.ops.labs.vu.nl/api22/25fbcf55", requestData, function (data)
		{
			getProducts(getSortedProducts(data, sortType, isReverse));
		}, "json");
	}

	getProductsFromDB();
});
