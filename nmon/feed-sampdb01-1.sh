#!/bin/sh

set -v

date
../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 180 < sampdb01_250220_0000.nmon
date

sleep 300

date
../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 060 < sampdb01_250220_0000.nmon
date
