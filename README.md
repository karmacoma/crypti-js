# Crypti JS

A client-side transactions library for [Crypti](https://crypti.me/). Allows transactions to be sent from within the browser, using a simple API.

## Installation

```
git clone git@github.com:karmacoma/crypti-js.git
cd crypti-js
npm install
```

## Tests

```
npm test
```

Tests written using mocha + schedule.js.

## Usage

Each function call has **secondSecret** parameter, this parameter is optional.

### Create transaction

Send 1000 XCR to 1859190791819301C

```js
var crypti = require('crypti-js');
var transaction = crypti.transaction.createTransaction("1859190791819301C", 1000, "secret", "secondSecret");
```

### Create second signature transaction

```js
var crypti = require('crypti-js');
var transaction = crypti.transaction.createTransaction("secret", "secondSecret");
```

### Create delegate transaction

```js
var crypti = require('crypti-js');
var transaction = crypti.transaction.createDelegate("secret", "username", "secondSecret");
```

### Create vote transaction


```js
var crypti = require('crypti-js');
var transaction = createVote("secret", ["+58199578191950019299181920120128129"], "secondSecret");
```

### Peers Communication

All transactions are sent to `/api/peer/transactions` using the `POST` method.

Example:

```js
Method: POST
Content-Type: application/json

{
    "transaction" : {
        ...
    }
}
```

## Authors

- Boris Povod <boris@crypti.me>
- Olivier Beddows <olivier@crypti.io>

## License

MIT
