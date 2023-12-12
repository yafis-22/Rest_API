// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to read product data from products.json
app.get('/products', (req, res) => {
  const productDataPath = path.join(__dirname, 'products.json');

  // Read product data from products.json
  fs.readFile(productDataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(' Error reading product data:', err);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const productData = JSON.parse(data);
      res.json(productData);
    } catch (parseError) {
      console.error('Error parsing product data:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
});

//Get data from products.json using its id
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
  
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
  
    const productDataPath = path.join(__dirname, 'products.json');
  
    // Read product data from products.json
    fs.readFile(productDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading product data:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        const productData = JSON.parse(data);
  
        // Find the product with the specified ID
        const foundProduct = productData.find(product => product.id === productId);
  
        if (!foundProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        res.json(foundProduct);
      } catch (parseError) {
        console.error('Error parsing product data:', parseError);
        res.status(500).send('Internal Server Error');
      }
    });
  });
 
// Add new product in products.json
app.post('/products', (req, res) => {
    const productDataPath = path.join(__dirname, 'products.json');
  
    // Read existing product data from products.json
    fs.readFile(productDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading product data:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        const productData = JSON.parse(data);
  
        // Assuming the new product data is sent in the request body
        const newProduct = req.body;
  
        // Assign a unique ID to the new product
        newProduct.id = productData.length + 1;
  
        // Add the new product to the existing data
        productData.push(newProduct);
  
        // Write the updated data back to the file
        fs.writeFile(productDataPath, JSON.stringify(productData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing product data:', writeErr);
            return res.status(500).send('Internal Server Error');
          }
  
          res.json({ message: 'Product added successfully', product: newProduct });
        });
      } catch (parseError) {
        console.error('Error parsing product data:', parseError);
        res.status(500).send('Internal Server Error');
      }
    });
  });

// Update existing product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
  
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
  
    const productDataPath = path.join(__dirname, 'products.json');
  
    // Read product data from products.json
    fs.readFile(productDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading product data:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        const productData = JSON.parse(data);
  
        // Find the product with the specified ID
        const productIndex = productData.findIndex(product => product.id === productId);
  
        if (!productIndex) {
          return res.status(404).json({ message: 'Product not found' });
        }
        
        // Update the product
        productData[productIndex] = { ...productData[productIndex], ...req.body};

        // Write the updated product 
        fs.writeFile(productDataPath, JSON.stringify(productData, null, 2), (writeErr)=> {
            if(writeErr) {
                console.log('Error writing product data', writeErr)
                return res.status(500).send('Internal Server Error');
            }

            res.json({message: 'Product Updated successfully', product: productData[productIndex]});
        })
      } catch (parseError) {
        console.error('Error parsing product data:', parseError);
        res.status(500).send('Internal Server Error');
      }
    });
  });

/// delete a product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
  
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
  
    const productDataPath = path.join(__dirname, 'products.json');
  
    // Read product data from products.json
    fs.readFile(productDataPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading product data:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        let productData = JSON.parse(data);
  
        // Find the index of the product with the specified ID
        const productIndex = productData.findIndex(product => product.id === productId);
  
        if (productIndex === -1) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        // Remove the product from the array
        const deletedProduct = productData.splice(productIndex, 1)[0];
  
        // Write the updated data back to the file
        fs.writeFile(productDataPath, JSON.stringify(productData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing product data:', writeErr);
            return res.status(500).send('Internal Server Error');
          }
  
          res.json({ message: 'Product deleted successfully', product: deletedProduct });
        });
      } catch (parseError) {
        console.error('Error parsing product data:', parseError);
        res.status(500).send('Internal Server Error');
      }
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});