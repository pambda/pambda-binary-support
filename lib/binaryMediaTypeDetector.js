const { parseContentType } = require( './parseContentType');

const mediaTypeMatcher = mediaType => {
  if (mediaType === '*/*') {
    return type => true;
  } else if (mediaType.startsWith('*/')) {
    const t = mediaType.substr(1);
    return type => type.endsWith(t);
  } else if (mediaType.endsWith('/*')) {
    const t = mediaType.slice(0, -1);
    return type => type.startsWith(t);
  } else {
    return type => type === mediaType;
  }
};

const binaryMediaTypeDetector = () => {
  let apigateway;

  let binaryMediaTypeMatchers;

  return (contentType, options, callback) => {
    const type = parseContentType(contentType);

    if (!type) {
      return callback(new Error(`Content type '${contentType}' is invalid`));
    }

    (next => {
      if (binaryMediaTypeMatchers) {
        return next();
      }

      (next => {
        if (options.binaryMediaTypes) {
          return next(options.binaryMediaTypes);
        }

        if (!apigateway) {
          const { APIGateway } = require('aws-sdk');

          apigateway = new APIGateway();
        }

        apigateway.getRestApi({ restApiId: options.restApiId }, (err, data) => {
          if (err) {
            return callback(err);
          }

          next(data.binaryMediaTypes);
        });
      })(binaryMediaTypes => {
        binaryMediaTypeMatchers = binaryMediaTypes ? binaryMediaTypes.map(mediaTypeMatcher) : [];

        next();
      });
    })(() => {
      callback(null, binaryMediaTypeMatchers.find(m => m(type)) !== undefined);
    });
  };
};

exports.binaryMediaTypeDetector = binaryMediaTypeDetector;
