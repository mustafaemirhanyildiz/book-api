const express = require('express');
const router = express.Router();
const nanoid = require('nanoid').nanoid;

const idLength = 10;


/**
 * @swagger
 * components:
 *  schemas:
 *     Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *       id:
 *        type: string
 *        description: The auto-generated id of the book
 *       title:
 *        type: string
 *        description: The title of the book
 *       author:
 *        type: string
 *        description: The author of the book
 *      example:
 *        id: 1
 *        title: The Lord of the Rings
 *        author: J.R.R. Tolkien   
 * 
 *  
 */


/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * 
 */


/**
 * @swagger
 * /books:
 *    get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *      200:
 *        description: The list of the books
 *        content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Book'
 * 
 */

router.get('/', (req, res) => {
    const books = req.app.db.get('books');
    res.send(books);
});


/**
 * 
 * @swagger
 * /books/{id}:
 *    get:
 *      summary: Get the book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The book id
 *      responses:
 *        200:
 *          description: The book description by id
 *          contents:
 *            application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Book'
 *        404:
 *          description: The book was not found
 * 
 */

router.get('/:id', (req, res) => {
    const book = req.app.db.get('books').find({ id: req.params.id }).value();
    if(!book) res.status(404).send('The book with the given ID was not found.');
    res.send(book);
});


/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */


router.post('/', (req, res) => {
    try {
        const book = req.body;
        book.id = nanoid(idLength);
        req.app.db.get('books').push(book).write();
        res.send(book);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update the book by the id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */


router.put('/:id', (req, res) => {
    try {
        req.app.db.get('books').find({ id: req.params.id }).assign(req.body).write();
        res.send(req.app.db.get('books').find({ id: req.params.id }));

    }
    catch (error) {
        res.status(400).send(error.message);
    }
});



/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */

router.delete('/:id', (req, res) => {
    try {
        req.app.db.get('books').remove({ id: req.params.id }).write();
        res.send('Book deleted');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
);


module.exports = router;



