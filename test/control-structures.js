var config = require('./config.js');
var r = require('../lib');
var util = require('./util.js');
var Promise = require('bluebird');
var assert = require('assert');

var uuid = util.uuid;
var connection; // global connection
var dbName;

function It(testName, generatorFn) {
    it(testName, function(done) {
        Promise.coroutine(generatorFn)(done);
    })
}

It("Init for `document-manipulation.js`", function* (done) {
    try {
        connection = yield r.connect();
        assert(connection);
        done();
    }
    catch(e) {
        done(e);
    }
})

It("`do` should work", function* (done) {
    try {
        result = yield r.expr({a: 1}).do( function(doc) { return doc("a") }).run(connection);
        assert.equal(result, 1);

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`branch` should work", function* (done) {
    try {
        result = yield r.branch(true, 1, 2).run(connection);
        assert.equal(result, 1);

        result = yield r.branch(false, 1, 2).run(connection);
        assert.equal(result, 2);

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`default` should work", function* (done) {
    try {
        result = yield r.expr({a:1})("b").default("Hello").run(connection);
        assert.equal(result, "Hello");

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`r.js` should work", function* (done) {
    try {
        result = yield r.js("1").run(connection);
        assert.equal(result, 1);

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`coerceTo` should work", function* (done) {
    try {
        result = yield r.expr(1).coerceTo("STRING").run(connection);
        assert.equal(result, "1");

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`typeOf` should work", function* (done) {
    try {
        result = yield r.expr(1).typeOf().run(connection);
        assert.equal(result, "NUMBER");

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`json` should work", function* (done) {
    try {
        result = yield r.json('{"a":1}').run(connection);
        assert.deepEqual(result, {a:1});

        done();
    }
    catch(e) {
        done(e);
    }
})

It("`exprJSON` should work", function* (done) {
    try {
        result = yield r.exprJSON('{"a":1}').run(connection);
        assert.deepEqual(result, {a:1});

        done();
    }
    catch(e) {
        done(e);
    }
})


It("End for `document-manipulation.js`", function* (done) {
    try {
        connection.close();
        done();
    }
    catch(e) {
        done(e);
    }
})

