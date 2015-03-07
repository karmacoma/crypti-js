var Buffer = require('buffer/').Buffer;
var crypto_lib = require('crypto-browserify');
var should = require('should');
var crypti = require('../index.js');

describe("Crypti Js", function () {

	it("should be ok", function () {
		(crypti).should.be.ok;
	});

	it("should be object", function () {
		(crypti).should.be.type('object');
	});

	it("should have properties", function () {
		var properties = ['transaction', 'signature', 'vote', 'delegate', 'crypto'];

		properties.forEach(function (property) {
			(crypti).should.have.property(property);
		});
	});

	describe("crypto.js", function () {
		var crypto = crypti.crypto;

		it("should be ok", function () {
			(crypto).should.be.ok;
		});

		it("should be object", function () {
			(crypto).should.be.type('object');
		});

		it("should has properties", function () {
			var properties = ['getBytes', 'getHash', 'getId', 'getFee', 'sign', 'secondSign', 'getKeys', 'getAddress', 'verify', 'verifySecondSignature', 'fixedPoint'];
			properties.forEach(function (property) {
				(crypto).should.have.property(property);
			});
		});

		describe("#getBytes", function () {
			var getBytes = crypto.getBytes;
			var bytes = null;

			it("should be ok", function () {
				(getBytes).should.be.ok;
			});

			it("should be a function", function () {
				(getBytes).should.be.type('function');
			});

			it("should return Buffer of simply transaction and buffer most be 117 length", function () {
				var transaction = {
					type: 0,
					amount: 1000,
					recipientId: '58191285901858109C',
					timestamp: 141738,
					asset: {},
					senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
					signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
					id: '13987348420913138422'
				};

				bytes = getBytes(transaction);
				(bytes).should.be.ok;
				(bytes).should.be.type('object');
				(bytes.length).should.be.equal(117);
			});

			it("should return Buffer of transaction with second signature and buffer most be 181 length", function () {
				var transaction = {
					type: 0,
					amount: 1000,
					recipientId: '58191285901858109C',
					timestamp: 141738,
					asset: {},
					senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
					signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
					signSignature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
					id: '13987348420913138422'
				};

				bytes = getBytes(transaction);
				(bytes).should.be.ok;
				(bytes).should.be.type('object');
				(bytes.length).should.be.equal(181);
			});
		});

		describe("#getHash", function () {
			var getHash = crypto.getHash;

			it("should be ok", function () {
				(getHash).should.be.ok;
			});

			it("should be a function", function () {
				(getHash).should.be.type('function');
			})

			it("should return Buffer and Buffer most be 32 bytes length", function () {
				var transaction = {
					type: 0,
					amount: 1000,
					recipientId: '58191285901858109C',
					timestamp: 141738,
					asset: {},
					senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
					signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
					id: '13987348420913138422'
				};

				var result = getHash(transaction);
				(result).should.be.ok;
				(result).should.be.type('object');
				(result.length).should.be.equal(32);
			});
		});

		describe("#getId", function () {
			var getId = crypto.getId;

			it("should be ok", function () {
				(getId).should.be.ok;
			});

			it("should be a function", function () {
				(getId).should.be.type('function');
			});

			it("should return string id and be equal to 13987348420913138422", function () {
				var transaction = {
					type: 0,
					amount: 1000,
					recipientId: '58191285901858109C',
					timestamp: 141738,
					asset: {},
					senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
					signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a'
				};

				var id = getId(transaction);
				(id).should.be.type('string').and.equal('13987348420913138422');
			});
		});

		describe("#getFee", function () {
			var getFee = crypto.getFee;

			it("should be ok", function () {
				(getFee).should.be.ok;
			})

			it("should be a function", function () {
				(getFee).should.be.type('function');
			});

			it("should return number", function () {
				var fee = getFee({amount: 100000, type : 0}, 0.5);
				(fee).should.be.type('number');
				(fee).should.be.not.NaN;
			});

			it("should return 500", function () {
				var fee = getFee({amount: 100000, type: 0}, 0.5);
				(fee).should.be.type('number').and.equal(500);
			});

			it("should return 10000000000", function () {
				var fee = getFee({type: 1});
				(fee).should.be.type('number').and.equal(10000000000);
			});

			it("should be equal 1000000000000", function () {
				var fee = getFee({type: 2});
				(fee).should.be.type('number').and.equal(1000000000000);
			});

			it("should be equal 100000000", function () {
				var fee = getFee({type: 3});
				(fee).should.be.type('number').and.equal(100000000);
			});
		});

		describe("fixedPoint", function () {
			var fixedPoint = crypto.fixedPoint;

			it("should be ok", function () {
				(fixedPoint).should.be.ok;
			})

			it("should be number", function () {
				(fixedPoint).should.be.type('number').and.not.NaN;
			});

			it("should be equal 100000000", function () {
				(fixedPoint).should.be.equal(100000000);
			});
		});

		describe("#sign", function () {
			var sign = crypto.sign;

			it("should be ok", function () {
				(sign).should.be.ok;
			});

			it("should be a function", function () {
				(sign).should.be.type('function');
			});
		});

		describe("#secondSign", function () {
			var secondSign = crypto.secondSign;

			it("should be ok", function () {
				(secondSign).should.be.ok;
			});

			it("should be a function", function () {
				(secondSign).should.be.type('function');
			});
		});

		describe("#getKeys", function () {
			var getKeys = crypto.getKeys;

			it("should be ok", function () {
				(getKeys).should.be.ok;
			});

			it("should be a function", function () {
				(getKeys).should.be.type('function');
			});

			it("should return two keys in hex", function () {
				var keys = getKeys("secret");

				(keys).should.be.ok;
				(keys).should.be.type('object');
				(keys).should.have.property('publicKey');
				(keys).should.have.property('privateKey');
				(keys.publicKey).should.be.type('string').and.match(function () {
					try {
						new Buffer(keys.publicKey, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
				(keys.privateKey).should.be.type('string').and.match(function () {
					try {
						new Buffer(keys.privateKey, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});
		});

		describe("#getAddress", function () {
			var getAddress = crypto.getAddress;

			it("should be ok", function () {
				(getAddress).should.be.ok;
			})

			it("should be a function", function () {
				(getAddress).should.be.type('function');
			});

			it("should generate address by publicKey", function () {
				var keys = crypto.getKeys("secret");
				var address = getAddress(keys.publicKey);

				(address).should.be.ok;
				(address).should.be.type('string');
				(address).should.be.equal('18160565574430594874C');
			});
		});

		describe("#verify", function () {
			var verify = crypto.verify;

			it("should be ok", function () {
				(verify).should.be.ok;
			})

			it("should be function", function () {
				(verify).should.be.type('function');
			});
		});

		describe("#verifySecondSignature", function () {
			var verifySecondSignature = crypto.verifySecondSignature;

			it("should be ok", function () {
				(verifySecondSignature).should.be.ok;
			});

			it("should be function", function () {
				(verifySecondSignature).should.be.type('function');
			});
		});
	});

	describe("transaction.js", function () {
		var transaction = crypti.transaction;

		it("should be object", function () {
			(transaction).should.be.type('object');
		});

		it("should have properties", function () {
			(transaction).should.have.property("createTransaction");
		})

		describe("#createTransaction", function () {
			var createTransaction = transaction.createTransaction;
			var trs = null;

			it("should be a function", function () {
				(createTransaction).should.be.type('function');
			});

			it("should create transaction without second signature", function () {
				trs = createTransaction("58191285901858109C", 1000, "secret");
				(trs).should.be.ok;
			});

			describe("returned transaction", function () {
				it("should be object", function () {
					(trs).should.be.type('object');
				});

				it("should have id as string", function () {
					(trs.id).should.be.type('string');
				});

				it("should have type as number and eqaul 0", function () {
					(trs.type).should.be.type('number').and.equal(0);
				});

				it("should have timestamp as number", function () {
					(trs.timestamp).should.be.type('number').and.not.NaN;
				});

				it("should have senderPublicKey as hex string", function () {
					(trs.senderPublicKey).should.be.type('string').and.match(function () {
						try {
							new Buffer(trs.senderPublicKey, 'hex')
						} catch (e) {
							return false;
						}

						return true;
					})
				});

				it("should have recipientId as string and to be equal 58191285901858109C", function () {
					(trs.recipientId).should.be.type('string').and.equal('58191285901858109C');
				});

				it("should have amount as number and eqaul to 1000", function () {
					(trs.amount).should.be.type('number').and.equal(1000);
				});

				it("should have empty asset object", function () {
					(trs.asset).should.be.type('object').and.empty;
				});

				it("should don't have second signature", function () {
					(trs).should.not.have.property('signSignature');
				});

				it("should have signature as hex string", function () {
					(trs.signature).should.be.type('string').and.match(function () {
						try {
							new Buffer(trs.signature, 'hex')
						} catch (e) {
							return false;
						}

						return true;
					})
				});

				it("should be signed correctly", function () {
					var result = crypti.crypto.verify(trs);
					(result).should.be.ok;
				});

				it("should not be signed correctyle now", function () {
					trs.amount = 10000;
					var result = crypti.crypto.verify(trs);
					(result).should.be.not.ok;
				});
			});
		});

		describe("#createTransaction with second secret", function () {
			var createTransaction = transaction.createTransaction;
			var trs = null;
			var secondSecret = "second secret";
			var keys = crypti.crypto.getKeys(secondSecret);

			it("should be a function", function () {
				(createTransaction).should.be.type('function');
			});

			it("should create transaction without second signature", function () {
				trs = createTransaction("58191285901858109C", 1000, "secret", secondSecret);
				(trs).should.be.ok;
			});

			describe("returned transaction", function () {
				it("should be object", function () {
					(trs).should.be.type('object');
				});

				it("should have id as string", function () {
					(trs.id).should.be.type('string');
				});

				it("should have type as number and eqaul 0", function () {
					(trs.type).should.be.type('number').and.equal(0);
				});

				it("should have timestamp as number", function () {
					(trs.timestamp).should.be.type('number').and.not.NaN;
				});

				it("should have senderPublicKey as hex string", function () {
					(trs.senderPublicKey).should.be.type('string').and.match(function () {
						try {
							new Buffer(trs.senderPublicKey, 'hex')
						} catch (e) {
							return false;
						}

						return true;
					})
				});

				it("should have recipientId as string and to be equal 58191285901858109C", function () {
					(trs.recipientId).should.be.type('string').and.equal('58191285901858109C');
				});

				it("should have amount as number and eqaul to 1000", function () {
					(trs.amount).should.be.type('number').and.equal(1000);
				});

				it("should have empty asset object", function () {
					(trs.asset).should.be.type('object').and.empty;
				});

				it("should have second signature", function () {
					(trs).should.have.property('signSignature');
				});

				it("should have signature as hex string", function () {
					(trs.signature).should.be.type('string').and.match(function () {
						try {
							new Buffer(trs.signature, 'hex')
						} catch (e) {
							return false;
						}

						return true;
					})
				});

				it("should have signSignature as hex string", function () {
					(trs.signSignature).should.be.type('string').and.match(function () {
						try {
							new Buffer(trs.signSignature, 'hex');
						} catch (e) {
							return false;
						}

						return true;
					});
				});

				it("should be signed correctly", function () {
					var result = crypti.crypto.verify(trs);
					(result).should.be.ok;
				});

				it('should be sign second time correctly', function () {
					var result = crypti.crypto.verifySecondSignature(trs, keys.publicKey);
					(result).should.be.ok;
				});

				it("should not be signed correctyle now", function () {
					trs.amount = 10000;
					var result = crypti.crypto.verify(trs);
					(result).should.be.not.ok;
				});

				it("should not be signed second correctly now", function () {
					trs.amount = 10000;
					var result = crypti.crypto.verifySecondSignature(trs, keys.publicKey);
					(result).should.be.not.ok;
				});
			});
		});
	});
});