var args = require('minimist')(process.argv, {
  alias:{
    node:'n',
    address:'a',
    peers:'p',
    hostname:'h'
  },
  default:{
    
  }
})

var path = require('path')
var volumes = '/tmp/etcd-test-cluster'
var addresses = {
  '1':'192.168.8.120',
  '2':'192.168.8.121',
  '3':'192.168.8.122'
}

var peers = {
  '1':'boot',
  '2':'192.168.8.120:7001',
  '3':'192.168.8.120:7001'
}

function checkArg(name){
  if(!args[name]){
    console.error('[error] please provide a ' + name + ' argument')
    process.exit(1)
  }    
}

function resetVolumes(){
  return 'sudo rm -rf ' + volumes + ' && mkdir -p ' + volumes
}

function runSmesh(count){
  var name = 'etcdtest' + count
  var addresslist = args.address || addresses[count]
  var peerlist = args.peers || peers[count]
  var volume = volumes + ':/data/etcd'
  var hostname = args.hostname || 'etcdtest' + count
  return 'eval $(docker run --rm binocarlos/smesh start --hostname ' + hostname + ' --address ' + addresslist + ' --volume ' + volume + ' --peers ' + peerlist + ')'
}

function commandStart(){
  checkArg('node')
  var commands = []
  commands.push(resetVolumes())
  commands.push(runSmesh(args.node))
  console.log('eval ' + commands.join(' && '))
}

commandStart()