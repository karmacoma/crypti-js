var crypto = require('crypto-browserify');
var Buffer = require('buffer/').Buffer;
var ByteBuffer = require('bytebuffer');
var bignum = require('browserify-bignum');
var nacl_factory = require("js-nacl");
var nacl = nacl_factory.instantiate();

var fixedPoint = Math.pow(10, 8);

function getSignatureBytes(signature) {
	var bb = new ByteBuffer(32, true);
	var publicKeyBuffer = new Buffer(signature.publicKey, 'hex');

	for (var i = 0; i < publicKeyBuffer.length; i++) {
		bb.writeByte(publicKeyBuffer[i]);
	}

	bb.flip();
	return bb.toBuffer();
}

function getBytes(transaction) {
	var assetSize = 0,
		assetBytes = null;

	switch (transaction.type) {
		case 1:
			assetSize = 32;
			assetBytes = getSignatureBytes(transaction.asset.signature);
			break;

		case 2:
			assetBytes = new Buffer(transaction.asset.delegate.username, 'utf8');
			assetSize = assetBytes.length;
			break;

		case 3:
			if (transaction.asset.votes !== null) {
				assetBytes = new Buffer(transaction.asset.votes.join(''), 'utf8');
				assetSize = assetBytes.length;
			}
			break;
	}

	var bb = new ByteBuffer(1 + 4 + 32 + 8 + 8 + 64 + 64 + assetSize, true);
	bb.writeByte(transaction.type);
	bb.writeInt(transaction.timestamp);

	var senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex');
	for (var i = 0; i < senderPublicKeyBuffer.length; i++) {
		bb.writeByte(senderPublicKeyBuffer[i]);
	}

	if (transaction.recipientId) {
		var recipient = transaction.recipientId.slice(0, -1);
		recipient = bignum(recipient).toBuffer({size: 8});

		for (var i = 0; i < 8; i++) {
			bb.writeByte(recipient[i] || 0);
		}
	} else {
		for (var i = 0; i < 8; i++) {
			bb.writeByte(0);
		}
	}


	bb.writeLong(transaction.amount);

	if (assetSize > 0) {
		for (var i = 0; i < assetSize; i++) {
			bb.writeByte(assetBytes[i]);
		}
	}

	if (transaction.signature) {
		var signatureBuffer = new Buffer(transaction.signature, 'hex');
		for (var i = 0; i < signatureBuffer.length; i++) {
			bb.writeByte(signatureBuffer[i]);
		}
	}

	if (transaction.signSignature) {
		var signSignatureBuffer = new Buffer(transaction.signSignature, 'hex');
		for (var i = 0; i < signSignatureBuffer.length; i++) {
			bb.writeByte(signSignatureBuffer[i]);
		}
	}

	bb.flip();

	return new Buffer(bb.toArrayBuffer());
}

function getId(transaction) {
	var hash = crypto.createHash('sha256').update(getBytes(transaction).toString('hex'), 'hex').digest();
	var temp = new Buffer(8);
	for (var i = 0; i < 8; i++) {
		temp[i] = hash[7 - i];
	}

	var id = bignum.fromBuffer(temp).toString();
	return id;
}


function getHash(transaction) {
	return crypto.createHash('sha256').update(getBytes(transaction)).digest();
}

function getFee(transaction, percent) {
	switch (transaction.type) {
		case 0:
			return parseInt(transaction.amount / 100 * percent);
			break;

		case 1:
			return 100 * fixedPoint;
			break;

		case 2:
			return 10000 * fixedPoint;
			break;

		case 3:
			return 1 * fixedPoint;
			break;
	}
}

function sign(transaction, keys) {
	var hash = getHash(transaction);
	var signature = nacl.crypto_sign_detached(hash, new Buffer(keys.privateKey, 'hex'));
	transaction.signature = new Buffer(signature).toString('hex')
}

function secondSign(transaction, keys) {
	var hash = getHash(transaction);
	var signature = nacl.crypto_sign_detached(hash, new Buffer(keys.privateKey, 'hex'));
	transaction.signSignature = new Buffer(signature).toString('hex')
}

function verify(transaction) {
	var remove = 64;

	if (transaction.signSignature) {
		remove = 128;
	}

	var bytes = getBytes(transaction);
	var data2 = new Buffer(bytes.length - remove);

	for (var i = 0; i < data2.length; i++) {
		data2[i] = bytes[i];
	}

	var hash = crypto.createHash('sha256').update(data2.toString('hex'), 'hex').digest();

	var signatureBuffer = new Buffer(transaction.signature, 'hex');
	var senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex');
	var res = nacl.crypto_sign_verify_detached(signatureBuffer, hash, senderPublicKeyBuffer);

	return res;
}

function verifySecondSignature(transaction, publicKey) {
	var bytes = getBytes(transaction);
	var data2 = new Buffer(bytes.length - 64);

	for (var i = 0; i < data2.length; i++) {
		data2[i] = bytes[i];
	}

	var hash = crypto.createHash('sha256').update(data2.toString('hex'), 'hex').digest();

	var signSignatureBuffer = new Buffer(transaction.signSignature, 'hex');
	var publicKeyBuffer = new Buffer(publicKey, 'hex');
	var res = nacl.crypto_sign_verify_detached(signSignatureBuffer, hash, publicKeyBuffer);

	return res;
}

function getKeys(secret) {
	var hash = crypto.createHash('sha256').update(secret, 'utf8').digest();
	var keypair = nacl.crypto_sign_keypair_from_seed(hash);

	return {
		publicKey : new Buffer(keypair.signPk).toString('hex'),
		privateKey : new Buffer(keypair.signSk).toString('hex')
	}
}

function getAddress(publicKey) {
	var publicKeyHash = crypto.createHash('sha256').update(publicKey.toString('hex'), 'hex').digest();
	var temp = new Buffer(8);

	for (var i = 0; i < 8; i++) {
		temp[i] = publicKeyHash[7 - i];
	}

	var address = bignum.fromBuffer(temp).toString() + "C";
	return address;
}

module.exports = {
	getBytes : getBytes,
	getHash : getHash,
	getId : getId,
	getFee : getFee,
	sign : sign,
	secondSign : secondSign,
	getKeys : getKeys,
	getAddress : getAddress,
	verify : verify,
	verifySecondSignature : verifySecondSignature,
	fixedPoint : fixedPoint
}
