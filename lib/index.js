const { binaryMediaTypeDetector } = require('./binaryMediaTypeDetector');
const { get } = require('caseless-get');
const { callbackify } = require('lambda-callbackify');

const binarySupport = (options = {}) => {
  const {
    binaryMediaTypes,
  } = options;

  const detectBinaryMediaType = binaryMediaTypeDetector();

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      if (event.isBase64Encoded) {
        event.body = Buffer.from(event.body, 'base64');
      }

      return next(event, context, (err, data) => {
        if (err) {
          return callback(err);
        }

        if (!(data.body instanceof Buffer)) {
          return callback(null, data);
        }

        detectBinaryMediaType(get(data.headers, 'Content-Type'),
          {
            binaryMediaTypes,
            restApiId: event.requestContext.apiId,
          },
          (err, isBinary) => {
            if (err) {
              return callback(err);
            }

            data.body = data.body.toString(isBinary ? 'base64' : undefined);
            data.isBase64Encoded = isBinary;

            callback(null, data);
          });
      });
    };
  };
};

/*
 * Exports.
 */
exports.binarySupport = binarySupport;
