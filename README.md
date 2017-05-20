# pambda-binary-support

[Pambda](https://github.com/pambda/pambda) for binary support.

## Installation

```
npm i pambda-binary-support -S
```

## Usage

``` javascript
import { compose, createLambda } from 'pambda';
import { binarySupport } from 'pambda-binary-support';

export const handler = createLambda(
  compose(
    binarySupport({
      binaryMediaTypes: [ 'image/*' ],
    }),
    // other pambdas
  )
);
```

## binarySupport(options)

- `options.binaryMediaTypes`
    - An array of media types that the binary support is enabled.
    - If this option is not specified, the media types are obtained by calling `getRestApi` of API Gateway.

if `options.binaryMediaTypes` is omitted, a lambda execution role must be granted permission to call `getRestApi`.
It means the role has the following policy document.

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:GET"
      ],
      "Resource": [
        "arn:aws:apigateway:{REGION}::/restapis/{APIID}"
      ]
    }
  ]
}
```

## License

MIT
