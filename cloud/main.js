const Product = Parse.Object.extend("Product");
const Brand = Parse.Object.extend("Brand");

Parse.Cloud.define("hello", (request) => {
	const name = request.params.name;
	return("Hello world! "+name);
});

// Create fuction
Parse.Cloud.define("create-product", async (request) => {
	const stock = request.params.stock;
	if(stock == null || stock > 999)  throw "Quantidade inválida";
	if(request.params.brandId == null) throw "Marca Inválida";

	const brand = new Brand();
	brand.id = request.params.brandId;


	const product = new Product();
	product.set("name", request.params.name);
	product.set("price", request.params.price);
	product.set("stock", request.params.stock);
	product.set("isSelling", true);
	product.set("brand", brand);
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
	query.include("brand");
	const product = await query.get(request.params.productId, {useMasterkey: true});
	
	const json = product.toJSON();
	return {
		//name: product.get("name"),
		//price: product.get("price")
		name: json.name,
		price: json.price,
		stock: json.stock,
		isSelling: json.isSelling,
		brandName: json.brand != null ? json.brand.name : null
	};
});

Parse.Cloud.define("list-products", async (request) => {
	const page = request.params.page;
	const itemsPage = request.params.itemsPage;
	const query = new Parse.Query(Product);
	//query.greaterThan("price",100);
	//query.lessThan("price",200);
	//query.equalTo("isSelling", true);
	//query.greaterThanOrEqualTo("price",90);
	//query.lessThanOrEqualTo("price",110);
	//query.ascending("stock");
	query.descending("stock");
	query.limit(itemsPage);
	query.skip(page * itemsPage);

	const products = await query.find({useMasterkey: true});
	return products.map(function(p) {
		p = p.toJSON();
		return {
			name: p.name,
			price: p.price,
			stock: p.stock
		}
	});
});


Parse.Cloud.define("sign-up", async (req) => {
  if(req.params.email == null) throw "Email inválido";
  if(req.params.password == null) throw "Password inválido";
  if(req.params.name == null) throw "Nome inválido";

  const user = new Parse.User();
  user.set("username", req.params.email);
  user.set("email", req.params.email);
  user.set("password", req.params.password);
  user.set("name", req.params.name);
  user.set("city", req.params.city);

  const savedUser = await user.signUp(null, {useMasterKey: true});
  return savedUser;

});