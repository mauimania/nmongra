# nmongra - Another nmon log analyzer

I improved the program authored by Benoit C chmod666.org.
. Program name: nmon2graphite (nmongra by mauimania)
. Author: Benoit C chmod666.org (Version : 0.1a)
. Program improved by mauimania

nmongra is based on the following technologies:
. docker container
. graphite
. nginx
. Javascript jQuery
. Perl script
. Bash script
. etc

In the use case I access nmongra at http://192.168.192.233:11082/nmon2graphite/     (trailing / needed)
I run nmongra on Ubuntu 22.04 VM with docker installed and added $USER to docker group.
The VM ip address is 192.168.192.233.
The port 11082 on VM is mapped to port 80 on docker container running nmongra.

- file rungra_samp : start nmongra
NMONGRAID=samp
PORT80=11082
PORT2003_2004=13003-13004

- file stopgra_samp : stop nmongra
NMONGRAID=samp

- file conf/storage-schemas.conf
[nmon]
pattern = ^nmon\.
retentions = 60s:30d # store 60s data for 30 days
# in this case, nmon sampling interval 60, 30, 20, etc : OK, but nmon sampling interval 120, 180, 240, 300, etc : Not OK

- file tools/nmon2graphite/index.cgi
   id=\"period1_from_time_value\" value=\"202502200830\"
   id=\"period1_to_time_value\"   value=\"202502201830\"
   id=\"period2_from_time_value\" value=\"202502200000\"
   id=\"period2_to_time_value\"   value=\"202502201900\"

- file tools/nmon2graphite/query-date-time.txt
2025-02-20 08:30
2025-02-20 18:30

- file tools/nmon2graphite/nmon2graphite.js
var graphite_url = "192.168.192.233:11082";

- start nmongra (run stopgra_samp to stop nmongra)
$ ./rungra_samp

- feed graphite backend with nmon log
$ mkdir -p whisper
$ ./feed-nmon2graphite -h
Can't locate Switch.pm in @INC (you may need to install the Switch module)
$ sudo apt-get install libswitch-perl

$ ./feed-nmon2graphite -h
usage: ./feed-nmon2graphite [-h] [-l log_file] [-i graphite_server_ip] [-p graphite_server_port] [-a] [-g]
          [-c ZZZZ_count] [-s sleep_seconds] [-f sleep_seconds] [-y %CPU] [-x toptype] [-v] [-t time_diff]
  -h print help
  -l log file path
  -i graphite server ip address
  -p graphite server port number
  -a include all logical CPUs stanza (CPU01, PCPU01, SCPU01)
  -g ignore DISK* stanza (ignore DISK*, DISKBUSY, DISKSERV, DISKREADSERV, DISKWRITESERV, DISKWAIT)
  -c ZZZZ count
  -s sleep seconds
  -f sleep for *.wsp files creation during T0001
  -y %CPU (ignore TOP lower than CPU%)
  -x 0: no TOP, 1: TOPcmd grouping, 2: default, TOPcmd.UARGfullcmd grouping
  -v verbose with ZZZZ stanza
  -t time difference in seconds

$ cd nmon
$ ../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 180 < sampdb01_250220_0000.nmon
$ ../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 060 < sampdb01_250220_0000.nmon

It is strongly recommended to feed nmon log data at least twice.
The time series data for nmon is stored in whisper directory which should have large free space.
You can use -t option of feed-nmon2graphite and '-d' field on web UI for old nmon log files.
-t option can be used to timeshift old nmon data or you should have free space a lot in whisper directory to save long duration data.

- for all disks view
$ cd tools
$ sudo su
# find ../whisper/nmon -type f -name cd[0-9].wsp -exec rm -f {} \;
# find ../whisper/nmon -type f -name usbms[0-9].wsp -exec rm -f {} \;
# sudo ./nmondisksplit.sh ../whisper/nmon 42

- access nmongra at http://192.168.192.233:11082/nmon2graphite/       (trailing / needed)

  press ctrl+'-' keys to use smaller fonts for better view

- tips

   useful flags of feed-nmon2graphite
     -g ignore DISK* stanza (ignore DISK*, DISKBUSY, DISKSERV, DISKREADSERV, DISKWRITESERV, DISKWAIT)
     -y %CPU (ignore TOP lower than CPU%)
     -x 0: no TOP, 1: TOPcmd grouping, 2: default, TOPcmd.UARGfullcmd grouping
     -t time difference in seconds (timeshift old nmon data, use '-d' field on web UI)

  nmongra backup
$ rsync -av --progress nmongra/* nmongra-$(date +"%y%m%d_%H%M") --exclude whisper/*
