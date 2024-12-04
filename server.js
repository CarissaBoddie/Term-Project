const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database('C:/Users/Carissa Boddie/OneDrive - UNCG/CSC 372 Workspace/Term Project/Database/PetParadiseDatabase.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Route to get products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM Products';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve products' });
        } else {
            res.json(rows);
        }
    });
});

// Route to get a product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id; // Extract the product ID from the URL
    const sql = 'SELECT * FROM Products WHERE id = ?'; // Query to fetch the product by ID
    db.get(sql, [productId], (err, row) => {
        if (err) {
            console.error('Error fetching product details:', err.message);
            res.status(500).json({ error: 'Failed to retrieve product details' });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(row); // Return the product details
        }
    });
});

// Endpoint to add a new product
app.post('/api/products', express.json(), (req, res) => {
    const { name, category, price, image_url } = req.body;

    if (!name || !category || !price || !image_url) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `INSERT INTO Products (name, description, image_url, price, category_id) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, `Category: ${category}`, image_url, price, 1]; // Adjust category_id based on your DB

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error adding product:', err.message);
            return res.status(500).json({ error: 'Failed to add product' });
        }

        res.json({ success: true, productId: this.lastID });
    });
});

//Admin edit product
app.put('/api/products/:id', express.json(), (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `UPDATE Products SET name = ?, description = ?, price = ? WHERE id = ?`;
    const params = [name, description, price, id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error updating product:', err.message);
            return res.status(500).json({ error: 'Failed to update product' });
        }

        res.json({ success: true });
    });
});

//Admin delete product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Products WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error deleting product:', err.message);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        res.json({ success: true });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
