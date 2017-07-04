const { parse } = require('content-type');

const parseContentType = contentType => {
  try {
    return parse(contentType).type;
  } catch (err) {
    return null;
  }
};

exports.parseContentType = parseContentType;
