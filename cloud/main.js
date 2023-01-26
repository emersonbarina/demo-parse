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

Parse.Cloud.define("change-price", async (request) => {
	if(request.params.productId == null) throw "Produto inválido";
	if(request.params.price == null) throw "Preço inválido";
	
	const product = new Product();
	product.id = request.params.productId;
	product.set("price", request.params.price);
	const savedProduct = await product.save(null, { useMasterkey: true });
	return savedProduct.get("price");
});

Parse.Cloud.define("delete-product", async (request) => {
	if(request.params.productId == null) throw "Produto inválido";
	
	const product = new Product();
	product.id = request.params.productId;

	await product.destroy({ useMasterkey: true });

	return "Produto excluído com sucesso";
});

Parse.Cloud.define("get-product", async (request) => {
	if(request.params.productId == null) throw "Produto inválido";
	
	const query = new Parse.Query(Product);
	const product = await query.get(request.params.productId, {useMasterkey: true});
	
	return product;
});
