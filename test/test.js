const test = require('tape');
const { binarySupport } = require('..');

test('test', t => {
  t.plan(3);

  const pambda = binarySupport({
    binaryMediaTypes: ['text/*'],
  });

  const lambda = pambda((event, context, callback) => {
    callback(null, {
      statusCode: 200,
      headers: {
        'content-type': 'text/plain',
      },
      body: Buffer.from('Hello'),
    });
  });

  const event = {
    path: '/',
    requestContext: {},
  };

  lambda(event, {}, (err, result) => {
    t.error(err);

    t.ok(result.isBase64Encoded);
    t.equal(typeof(result.body), 'string');
  });
});
