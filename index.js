var args = require('minimist')(process.argv, {
  alias:{
    address:'a',
    token:'t'
  },
  default:{
    
  }
})

var path = require('path')
var volumes = '/tmp/etcd-test-cluster'

function checkArg(name){
  if(!args[name]){
    console.error('[error] please provide a ' + name + ' argument')
    process.exit(1)
  }    
}

function resetVolumes(){
  return 'sudo rm -rf ' + volumes
}

function createVolume(count){
  return 'mkdir -p ' + path.join(volumes, '/node' + count) 
}

function runSmesh(count){
  var port = 4000 + count
  var peerport = 7000 + count
  var volume = path.join(volumes, '/node' + count) + ':/data/etcd'
  return 'eval $(docker run --rm binocarlos/smesh start --token ' + args.token + ' --name etcdtest' + count + ' --hostname etcdtest' + count + ' --address ' + args.address + ' --port ' + port + ' --peerport ' + peerport + ' --volume ' + volume + ')'
}

function getConnectionString(){
  var strings = [
    args.address + ':4001',
    args.address + ':4002',
    args.address + ':4003'
  ]
  return strings.join(',')
}

function stopSmesh(count){
  return 'docker stop etcdtest' + count + ' && docker rm etcdtest' + count
}

function commandStart(){
  checkArg('token')
  checkArg('address')
  var commands = []
  commands.push(resetVolumes())
  commands.push(createVolume(1))
  commands.push(runSmesh(1))
  commands.push(createVolume(2))
  commands.push(runSmesh(2))
  commands.push(createVolume(3))
  commands.push(runSmesh(3))
  commands.push('echo "' + getConnectionString() + '"')
  console.log('eval ' + commands.join(' && '))
}

function commandStop(){
  var commands = []

  commands.push(stopSmesh(1))
  commands.push(stopSmesh(2))
  commands.push(stopSmesh(3))
  
  console.log('eval ' + commands.join(' && '))
}

var commands = {
  start:commandStart,
  stop:commandStop
}

var command = args._[2] || 'start'

commands[command]()