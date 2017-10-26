FROM docker.elastic.co/logstash/logstash:5.2.2
RUN rm -f /usr/share/logstash/pipeline/logstash.conf
ADD ./logstash/pipeline/ /usr/share/logstash/pipeline/