var etcdcluster = require('./')


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