const express = require('express');
const pg = require('postgres');
const { Client } = pg;
const app = express();
const port = 3000;
const client = new Client({
    user: '',  
    password: '', 
    host: 'localhost',
    port: 5432,
    database: 'b33',
});


app.use(express.json());


app.get('/api/employees', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM employee');
        res.json(data.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/departments', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM department');
        res.json(data.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/employees', async (req, res) => {
    const { name, department_id } = req.body;
    if (!name || !department_id) {
        return res.status(400).json({ error: 'Name and department_id are required' });
    }

    try {
        await client.query('INSERT INTO employee (name, department_id) VALUES ($1, $2)', [name, department_id]);
        const data = await client.query('SELECT * FROM employee WHERE name = $1 AND department_id = $2', [name, department_id]);
        res.status(201).json(data.rows[0]);  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query('DELETE FROM employee WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(204).send();  
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, async () => {
    try {
        await client.connect();
        console.log(`Example app listening on port ${port}`);
    } catch (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1);  
    }
});
