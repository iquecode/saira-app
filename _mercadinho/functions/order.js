const Order = Parse.Object.extend('Order')
const OrderItem = Parse.Object.extend('OrderItem')

const product = require('./product')

Parse.Cloud.define('checkout', async (req) => {
	if(req.user == null) throw 'INVALID_USER'
	
	const queryCartItems = new Parse.Query(CartItem)
	queryCartItems.equalTo('user', req.user)
	queryCartItems.include('product')
	const resultCartItems = await queryCartItems.find({useMasterKey: true})

	let total = 0;
	for(let item of resultCartItems) {
		item = item.toJSON();
		total += item.quantity * item.product.price
	}

	if(req.params.total != total) throw 'INVALID_TOTAL'

	const order = new Order()
	order.set('total', total)
	order.set('user', req.user)
	
	const orderItems = []
	let i = 0;
	for(let item of resultCartItems) {
		orderItems[i] = new OrderItem()
		orderItems[i].set('order', order)
		orderItems[i].set('product', item.get('product'))
		orderItems[i].set('quantity', item.get('quantity'))
		orderItems[i].set('price', item.toJSON().product.price)
		i++
	}
	
	
	await Parse.Object.saveAll(orderItems, {useMasterKey: true})
	await Parse.Object.destroyAll(resultCartItems, {useMasterKey: true})
	const orderId = orderItems[0].toJSON().order.objectId;
	return {
		id: orderId
	}


})

Parse.Cloud.define('get-orders', async (req) => {
	if(req.user == null) throw 'INVALID_USER'
	const queryOrders = new Parse.Query(Order)
	queryOrders.equalTo('user', req.user)
	const resultOrders = await queryOrders.find({useMasterKey: true})
	return resultOrders.map(function (o) {
		o = o.toJSON()
		return {
			id: o.objectId,
			total: o.total,
			createdAt: o.createdAt
		}
	})
})

Parse.Cloud.define('get-orders-items', async (req) => {
	if(req.user == null) throw 'INVALID_USER'
	if(req.params.orderId == null) throw 'INVALID_ORDER'
	
	const order = new Order();
	order.id = req.params.orderId
	const queryOrderItems = new Parse.Query(OrderItem)
	queryOrderItems.equalTo('order', order)
	queryOrderItems.include('product')
	queryOrderItems.include('product.category')
	//queryOrderItems.equalTo('user', req.user)



	const resultOrderItems = await queryOrderItems.find({useMasterKey: true})
	return resultOrderItems.map(function (o) {
		o = o.toJSON()
		return {
			id: o.objectId,
			quantity: o.quantity,
			price: o.price,
			product: product.formatProduct(o.product)
		}
	})
})