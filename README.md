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

First generate a token:

```bash
$ TOKEN=$(docker run --rm binocarlos/smesh token)
```

Start a 3 node cluster:

```bash
$ $(docker run --rm binocarlos/etcd-test-cluster start --token $TOKEN --address 192.168.8.120)
```

This will print the 3 container ids and the client connection string

To stop the cluster:

```bash
$ $(docker run --rm binocarlos/etcd-test-cluster stop)
```

## license

MIT