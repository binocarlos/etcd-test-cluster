etcd-test-cluster
-----------------

Helper to boot multiple [etcd](http://github.com/coreos/etcd) servers so testing clusters is quick n easy

## install

```
$ npm install etcd-test-cluster
```

## usage

Create a cluster of 3 running etcd servers - run a test of them and then shut them down:

```js
var testcluster = require('etcd-test-cluster')
var tape = require('tape')
var etcdjs = require('etcdjs')
var async = require('async')

var cluster = testcluster()

tape('boot the cluster', function(t){
	cluster.start(function(err){
		if(err){
			t.fail(err, 'boot the cluster')
		}
		else{
			t.pass('boot the cluster')
		}
		t.end()
	})
})


tape('write a value to one server and read it from another', function(t){
	async.series([

		function(next){
			var client1 = etcdjs(cluster.addr(0))

			client1.set('/test', 'hello world', function(err){
				if(err) return next(err)
				setTimeout(next, 1000)
			})
		},

		function(next){
			var client2 = etcdjs(cluster.addr(1))

			client2.get('/test', function(err, node){
				if(err) return next(err)
				t.equal(node.value, 'hello world')
				next()
			})
		}

	], function(err){
		if(err){
			t.fail(err, 'no errors')
		}
		t.end()
	})
})

tape('stop the cluster', function(t){
	cluster.stop(function(err){
		if(err){
			t.fail(err, 'stop the cluster')
		}
		else{
			t.pass('stop the cluster')
		}
		t.end()
	})
})
```

NOTE - until I find a way to catch errors and close down gracefully - if there is a fatal error in the test script you need to run:

```
$ sudo killall etcd
```

Once the script has died

## api

### `var cluster = etcdcluster(opts)`

Create a new cluster of etcd processes each with incrementing ports.

Options are:

 * name - the base name to use for the nodes in the cluster (etcdtestcluster)
 * count - the number of etcd servers to run in the cluster (3)
 * basePort - the starting port (4001)
 * basePeerPort - the starting peer port (7001)
 * folder - the folder to save data in (/tmp/etcdtestcluster)

### `cluster.start(done)`

Start the cluster

### `cluster.stop(done)`

Stop the cluster

### `cluster.configs()`

Get the array of configs used to start the cluster

### `cluster.addr(index)`

Get the etcd client connection string for a single server

## license

MIT