import { parse } from 'content-type';

export const parseContentType = contentType => {
  try {
    return parse(contentType).type;
  } catch (err) {
    return null;
  }
};
