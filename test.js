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
  t.equal(configs[2].peerPort, 4003, 'the peer port is auto filled')
  t.equal(configs[1].port, 4002, 'the port is auto filled')
  t.equal(configs[1].peers, '127.0.0.1:7003,127.0.0.1:7001', 'the peers are correct')
  t.equal(configs[2].peers, '127.0.0.1:7001,127.0.0.1:7002', 'the peers are correct')

  t.end()

  console.log('-------------------------------------------');
  console.dir(configs)

})
