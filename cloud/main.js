const Product = Parse.Object.extend("Product");

Parse.Cloud.define("hello", (request) => {
	const name = request.params.name;
	return("Hello world! "+name);
});

// Create fuction
Parse.Cloud.define("create-product", async (request) => {
	const stock = request.params.stock;
	if(stock == null || stock > 999)  throw "Quantidade inválida";

	const product = new Product();
	product.set("name", request.params.name);
	product.set("price", request.params.price);
	product.set("stock", request.params.stock);
	product.set("isSelling", true);
	const savedProduct = await product.save(null, { useMasterkey: true });
	return savedProduct.id;
});

