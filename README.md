etcd-test-cluster
-----------------

An opinionated setup of etcd across 3 servers

## install

First - [install docker](https://github.com/binocarlos/docker-install)

Then pull the docker images (this will be done automatically but you get nice progress bars doing it manually):

```bash
$ docker pull binocarlos/etcd
$ docker pull binocarlos/smesh
$ docker pull binocarlos/etcd-test-cluster
```

## usage

```bash
node1:~$ $(docker run --rm binocarlos/etcd-test-cluster start --node 1)
```

```bash
node2:~$ $(docker run --rm binocarlos/etcd-test-cluster start --node 2)
```

```bash
node3:~$ $(docker run --rm binocarlos/etcd-test-cluster start --node 3)
```

```bash
$ docker stop smesh && docker rm smesh
```

## license

MIT