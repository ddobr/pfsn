import Fastify from 'fastify';
import PostgresFastify from '@fastify/postgres';

const fastify = Fastify({
    logger: true
});


// Route to get all posts
fastify.get('/posts', async (request, reply) => {
    fastify.pg.query(
        'SELECT * FROM posts',
        function onResult(err, result) {
            reply.send(err || result)
        }
    );
});

// Test route
fastify.get('/api', async (request, reply) => {
    reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'world' })
});

// Route to create a new post
fastify.post('/posts', async (request, reply) => {
    const { text } = request.body;

    fastify.pg.query(
        'INSERT INTO posts (text) VALUES ($1) RETURNING *', [text],
        function onResult(err, result) {
            reply.send(err || result)
        }
    )
});


async function createTable() {
    const client = await fastify.pg.connect();

    // Execute SQL query to create the posts table
    await client.query(
        `CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, text TEXT);`
    );

    client.release();
}

function start() {
    fastify.register(PostgresFastify, {
        connectionString: 'postgresql://user:example@db:5432/database',
        connectionTimeoutMillis: 500,
    })
        .then(() => {
            return createTable();
        })
        .then(() => {
            fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
                if (err) {
                    fastify.log.error(err)
                    process.exit(1)
                }
            });
        })
}

start();