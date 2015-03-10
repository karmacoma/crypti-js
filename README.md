# crypti-js

Crypti Pure JS Transactions library. Send transactions from browser. Yeah, yeah!

# Installation

To installation run: 

```
npm install crypti-js
```

# Tests

To run tests use command: 

```
npm test
```

Tests written in mocha + schedule.js

# How to use

Each function call has **secondSecret** parameter, this parameter is optional.

# Create transaction

Send 1000 XCR to 1859190791819301C

```js
var crypti = require('crypti');
var transaction = crypti.transaction.createTransaction("1859190791819301C", 1000, "secret", "secondSecret");
```

# Create second signature transaction

```js
var crypti = require('crypti');
var transaction = crypti.transaction.createTransaction("secret", "secondSecret");
```

# Create delegate transaction

```js
var crypti = require('crypti');
var transaction = crypti.transaction.createDelegate("secret", "username", "secondSecret");
```

# Create vote transaction 


```js
var crypti = require('crypti');
var transaction = createVote("secret", ["+58199578191950019299181920120128129"], "secondSecret");
```

# License

MIT.
