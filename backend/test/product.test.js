const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Product = require('../models/Product');
const { updateProduct,getProducts,addProduct,deleteProduct } = require('../controllers/productController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddProduct Function Test', () => {

  it('should create a new product successfully', async () => {
    // Mock request data
    const req = {
      body: { name: "New Product", supplier: "New Supplier", quantity: 4 }
    };

    // Mock product that would be created
    const createdProduct = { _id: new mongoose.Types.ObjectId(), ...req.body };

    // Stub Product.create to return the createdProduct
    const createStub = sinon.stub(Product, 'create').resolves(createdProduct);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addProduct(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdProduct)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Product.create to throw an error
    const createStub = sinon.stub(Product, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
        body: { name: "New Product", supplier: "New Supplier", quantity: 4 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addProduct(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update product successfully', async () => {
    // Mock product data
    const productId = new mongoose.Types.ObjectId();
    const existingProduct = {
      _id: productId,
      name: "Old Product",
      supplier: "Old Supplier",
      quantity: 2,
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Product.findById to return mock product
    const findByIdStub = sinon.stub(Product, 'findById').resolves(existingProduct);

    // Mock request & response
    const req = {
      params: { id: productId },
      body: { name: "New Product" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateProduct(req, res);

    // Assertions
    expect(existingProduct.name).to.equal("New Product");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if product is not found', async () => {
    const findByIdStub = sinon.stub(Product, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProduct(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Product, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProduct(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetProduct Function Test', () => {

  it('should return products for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock product data
    const products = [
      { _id: new mongoose.Types.ObjectId(), name: "Product 1", quantity: 1 },
      { _id: new mongoose.Types.ObjectId(), name: "Product 2", quantity: 2 }
    ];

    // Stub Product.find to return mock products
    const findStub = sinon.stub(Product, 'find').resolves(products);

    // Mock request & response
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProducts(req, res);

    // Assertions
    expect(res.json.calledWith(products)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Product.find to throw an error
    const findStub = sinon.stub(Product, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProducts(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteProduct Function Test', () => {

  it('should delete a product successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock product found in the database
    const product = { remove: sinon.stub().resolves() };

    // Stub Product.findById to return the mock product
    const findByIdStub = sinon.stub(Product, 'findById').resolves(product);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProduct(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(product.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Product deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if product is not found', async () => {
    // Stub Product.findById to return null
    const findByIdStub = sinon.stub(Product, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProduct(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Product.findById to throw an error
    const findByIdStub = sinon.stub(Product, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProduct(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});