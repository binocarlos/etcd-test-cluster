etcd-test-cluster
-----------------

Boot a cluster of 3 etcd machines using [smesh](https://github.com/binocarlos/smesh)

## install

First - [install docker](https://github.com/binocarlos/docker-install)

Then pull the docker images (this will be done automatically but you get nice progress bars doing it manually):

```bash
$ docker pull binocarlos/etcd
$ docker pull binocarlos/smesh
$ docker pull binocarlos/etcd-test-cluster
```

## usage

Start a 3 node cluster:

```
$ $(docker run --rm binocarlos/etcd-test-cluster start)
```

Get the etcd connection string for clients to use:

```
$ export ETCD_CLUSTER=`docker run --rm binocarlos/etcd-test-cluster connect`
$ echo $ETCD_CLUSTER
```

## license

MIT