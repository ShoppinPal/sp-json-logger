FROM docker.elastic.co/logstash/logstash:5.2.2
RUN rm -f /usr/share/logstash/pipeline/logstash.conf
ADD ./logstash/pipeline/ /usr/share/logstash/pipeline/
#ADD ./logstash/config/ /usr/share/logstash/config/
# COPY ./logstash/logstash.yml /etc/logstash/