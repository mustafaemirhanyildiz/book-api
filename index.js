const express= require('express');
const cors= require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const booksRouter= require('./routes/books');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');


const PORT = process.env.PORT || 3000;

const FilEsync = require('lowdb/adapters/FileSync');

const adapters= new FilEsync('db.json');
const db= low(adapters);

db.defaults({books:[]}).write();


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'A simple Express Books API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};


const specs = swaggerJsDoc(options);


const app= express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.db= db;


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/books', booksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

