#!/bin/bash
sudo docker image build --target production -t tinoolinemarket/tino -f Dockerfile.dev .
sudo docker push tinoolinemarket/tino
curl https://api.render.com/deploy/srv-copn4r4f7o1s73e2tat0\?key\=LbcBCRTA5hI
