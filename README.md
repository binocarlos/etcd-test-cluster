etcd-test-cluster
-----------------

Helper to boot 3 [etcd](http://github.com/coreos/etcd) servers so testing clusters is quick n easy

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
				next()
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

## api

### `var cluster = etcdquick(opts)`

Create a new cluster of etcd processes each with incrementing ports.

Options are:

 * name - the base name to use for the nodes in the cluster (e.g. node = node1 - node2 and node3)
 * 

### `var node = locker(path)`

Create a node that represents a single key - other machines will have created nodes on the same path - they are all essentially competing.

### `var id = node.id()`

Each node uses it's id to determine election - this means you can create nodes on different machines but with the same 'value' passed to the constructor.

### `node.write(value)`

Write a value to a node - if the node was previously elected this will trigger a new election essentially resetting the lock before applying the new value.

### `node.reset()`

Remove the node from the lock - this essentially resets the node and awaits another call to 'write' before joining the election again.

### `node.on('change', function(value, nodeid){})

This event is triggered when the lock value has changed regardless of which node was elected.

The nodeid is of the elected machine is passed as the second argument.

### `node.on('select', function(value){})

This event is triggered when the node has been elected and it's value distributed to the cluster.

You can run logic in this function that should only be running on one server at a time.

## license

MIT