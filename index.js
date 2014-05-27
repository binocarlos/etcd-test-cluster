var fs = require('fs');
var EventEmitter = require('events').EventEmitter
var util = require('util')
var async = require('async')
var wrench = require('wrench')
var spawn = require('child_process').spawn

function getServerArgs(opts){
  var args = [
    '-name',
    opts.name,
    '-addr',
    '127.0.0.1:' + opts.port,
    '-peer-addr',
    '127.0.0.1:' + opts.peerPort,
    '-data-dir',
    opts.folder
  ]

  if(opts.peers){
    args.push('-peers')
    args.push(opts.peers)
  }

  return args
}

function getServerProcess(opts){
  var args = getServerArgs(opts)
  return spawn('etcd', args, {
    stdio:'inherit'
  })
}

function Cluster(opts){
  EventEmitter.call(this)
  this._servers = {}
  this._opts = opts || {}

}

util.inherits(Cluster, EventEmitter)

module.exports = Cluster

Cluster.prototype.peerPort = function(index, offset){
  if(index + offset < 0){
    return this._opts.basePeerPort + this._opts.count-1
  }
  else if(index + offset >= this._opts.count){
    return this._opts.basePeerPort + (index + offset) - this._opts.count
  }
  else{
    return this._opts.basePeerPort + index + offset  
  }
}

Cluster.prototype.opts = function(index){
  var opts = JSON.parse(JSON.stringify(this._opts))
  opts.index = index
  opts.name = opts.name + index
  opts.folder = opts.folder + '/node' + index
  opts.port = opts.basePort + index
  opts.peerPort = opts.basePeerPort + index
  if(index>0){
    opts.peers = '127.0.0.1:' + this.peerPort(index, 1) + ',127.0.0.1:' + this.peerPort(index, 2)
  }
  return opts
}

Cluster.prototype.configs = function(){
  var servers = []
  for(var i=0; i<this._opts.count; i++){
    servers.push(this.opts(i))
  }
  return servers
}

Cluster.prototype.start = function(done){
  var self = this;
  var serverConfigs = this.configs()
  if(!fs.existsSync(opts.folder)){
    wrench.mkdirSyncRecursive(opts.folder)
  }
  async.forEachSeries(serverConfigs, function(config, next){
    var server = getServerProcess(config)
    self._servers['server' + config.index] = server
  }, done)
}

Cluster.prototype.stop = function(done){
  var self = this;
  var ids = Object.keys(this._servers)
  async.forEachSeries(ids, function(id, next){
    self._servers[id].kill('SIGTERM')
    setTimeout(next, 200)
  }, function(){
    wrench.rmdirSyncRecursive(self._opts.folder)
    done()
  })
}

var defaults = {
  name:'etcdtestcluster',
  folder:'/tmp/etcdtestcluster',
  basePort:4001,
  basePeerPort:7001,
  count:3
}

module.exports = function(opts){
  opts = opts || {}
  Object.keys(defaults || {}).forEach(function(key){
    if(!opts.hasOwnProperty(key)){
      opts[key] = defaults[key]
    }
  })
  return new Cluster(opts)
}