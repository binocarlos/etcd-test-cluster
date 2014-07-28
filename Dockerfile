FROM 		binocarlos/nodejs
MAINTAINER 	Kai Davenport <kaiyadavenport@gmail.com>

ADD . /srv/etcd-test-cluster
RUN cd /srv/etcd-test-cluster && npm install

ENTRYPOINT ["/usr/local/bin/node", "/srv/etcd-test-cluster"]
CMD [""]