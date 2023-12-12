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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});