const Product = Parse.Object.extend("Product");

Parse.Cloud.define("hello", (request) => {
	const name = request.params.name;
	return("Hello world! "+name);
});

// Create fuction
Parse.Cloud.define("create-product", async (request) => {
	const product = new Product();
	product.set("name", "Produto Cloud");
	product.set("price", 100);
	product.set("stock", 20);
	product.set("isSelling", true);
	const savedProduct = await product.save(null, {useMasterkey: true});
	return savedProduct;
});

