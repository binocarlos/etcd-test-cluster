var args = require('minimist')(process.argv, {
  alias:{
    address:'a'
  },
  default:{
    
  }
})

function checkArg(name){
  if(!args[name]){
    console.error('[error] please provide a ' + name + ' argument')
    process.exit(1)
  }    
}

function runSmesh(count){
  return '$(docker run --rm binocarlos/smesh start --token $ETCD_TEST_CLUSTER_TOKEN --name etcdtest' + count + ' --hostname etcdtest' + count + ' --address ' + args.address + ')'
}

function stopSmesh(count){
  return 'docker stop etcdtest' + count + ' && docker rm etcdtest' + count
}

function commandStart(){
  var commands = []

  commands.push('export ETCD_TEST_CLUSTER_TOKEN=$(docker run --rm binocarlos/smesh token)')
  commands.push(runSmesh(1))
  commands.push(runSmesh(2))
  commands.push(runSmesh(3))
  
  console.log(commands.join(' && '))
}

function commandStop(){
  var commands = []

  commands.push(stopSmesh(1))
  commands.push(stopSmesh(2))
  commands.push(stopSmesh(3))
  
  console.log(commands.join(' && '))
}

var commands = {
  start:commandStart,
  stop:commandStop
}

var command = args._[2] || 'start'

commands[command]()