var etcdcluster = require('./')

var etcdjs = require('etcdjs')
var async = require('async')
var wrench = require('wrench')
var spawn = require('child_process').spawn
var exec = require('child_process').exec
var tape     = require('tape')

var servers = {}
var procs = {}

tape('configs', function(t){

  var cluster = etcdcluster()

  var configs = cluster.configs()

  t.equal(configs.length, 3, 'correct number of configs')
  t.equal(configs[0].folder, '/tmp/etcdtestcluster/node0', 'the folder is auto filled')
  t.equal(configs[1].index, 1, 'the index is auto filled')
  t.equal(configs[1].name, 'etcdtestcluster1', 'the name is auto filled')
  t.equal(configs[2].peerPort, 7003, 'the peer port is auto filled')
  t.equal(configs[1].port, 4002, 'the port is auto filled')
  t.equal(configs[1].peers, '127.0.0.1:7003,127.0.0.1:7001', 'the peers are correct')
  t.equal(configs[2].peers, '127.0.0.1:7001,127.0.0.1:7002', 'the peers are correct')

  t.end()

})


tape('configs with overrides', function(t){

  var cluster = etcdcluster({
    basePort:4005,
    basePeerPort:7005,
    count:5,
    folder:'/tmp/mytest',
    name:'apples'
  })

  var configs = cluster.configs()

  t.equal(configs.length, 5, 'correct number of configs')
  t.equal(configs[0].folder, '/tmp/mytest/node0', 'the folder is auto filled')
  t.equal(configs[4].index, 4, 'the index is auto filled')
  t.equal(configs[1].name, 'apples1', 'the name is auto filled')

  t.equal(configs[2].peerPort, 7007, 'the peer port is auto filled')
  t.equal(configs[1].port, 4006, 'the port is auto filled')
  t.equal(configs[1].peers, '127.0.0.1:7007,127.0.0.1:7008', 'the peers are correct')
  t.equal(configs[3].peers, '127.0.0.1:7009,127.0.0.1:7005', 'the peers are correct')

  t.end()

})

var maincluster = etcdcluster()

tape('boot the cluster', function(t){
  maincluster.start(function(err){
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
      var client1 = etcdjs(maincluster.addr(0))

      client1.set('/test', 'hello world', function(err, node){
        if(err) return next(err)
        setTimeout(next, 1000)
      })
    },

    function(next){
      var client2 = etcdjs(maincluster.addr(1))
      client2.get('/test', function(err, result){
        if(err) return next(err)
        t.equal(result.node.value, 'hello world', 'the value was read from the database')
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
  maincluster.stop(function(err){
    if(err){
      t.fail(err, 'stop the cluster')
    }
    else{
      t.pass('stop the cluster')
    }
    t.end()
  })
})