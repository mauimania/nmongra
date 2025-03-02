Today is Mar 2, 2025.
I have to analyze an old nmon log file which is sampdb01_241201_0000.nmon till Mar 10 2025.
It is a waste of storage to have retention of more than 100 days for whisper data.
Thus I timeshift the old nmon log data from Dec 1 2024 to Mar 1 2025.
Time between two dates is 90 days which is equal to 7,776,000 seconds.

Time Between Two Dates
- https://www.calculator.net/time-duration-calculator.html

- file conf/storage-schemas.conf
[nmon]
pattern = ^nmon\.
retentions = 60s:14d # store 60s data for 14 days
# in this case, nmon sampling interval 60, 30, 20, 10, etc : OK, but nmon sampling interval 120, 180, 240, 300, etc : Not OK

- file tools/nmon2graphite/index.cgi
   id=\"period1_from_time_value\" value=\"202503010830\"
   id=\"period1_to_time_value\"   value=\"202503011830\"
   id=\"period2_from_time_value\" value=\"202503010000\"
   id=\"period2_to_time_value\"   value=\"202503011900\"

- file tools/nmon2graphite/query-date-time.txt
2025-03-01 08:30
2025-03-01 18:30

- stop nmongra
$ ./stopgra_samp

- delete whisper data
$ sudo rm -rf whisper/carbon/* whisper/nmon/*

- run nmongra
$ ./rungra_samp

- feed graphite backend with nmon log using timeshift option
$ cd nmon
$ ../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 180 -t 7776000  < sampdb01_241201_0000.nmon
$ ../tools/feed-nmon2graphite -i 192.168.192.233 -p 13003 -c 30 -s 7 -x 1 -v -y 1.0 -f 060 -t 7776000  < sampdb01_241201_0000.nmon

It is strongly recommended to feed nmon log data at least twice. (very important)

- for all disks view
$ cd ../tools
$ sudo su
# find ../whisper/nmon -type f -name cd[0-9].wsp -exec rm -f {} \;
# find ../whisper/nmon -type f -name usbms[0-9].wsp -exec rm -f {} \;
# ./nmondisksplit.sh ../whisper/nmon 42

  You can ignore some messages.
     find: ??./9040-MR9-SERIALX/sampdb01/diskwait000??: No such file or directory
     ./9040-MR9-SERIALX/sampdb01/diskavgrio000 does not exist!
     Directory: ./9040-MR9-SERIALX/sampdb01/diskavgrio000

- access nmongra at http://192.168.192.233:11082/nmon2graphite/       (trailing / needed)

  enter 90 in '-d' field on web UI to display original date and time.

  press ctrl+'-' keys to use smaller fonts for better view

- tips

   useful flags of feed-nmon2graphite
     -g ignore DISK* stanza (ignore DISK*, DISKBUSY, DISKSERV, DISKREADSERV, DISKWRITESERV, DISKWAIT)
     -y %CPU (ignore TOP lower than CPU%)
     -x 0: no TOP, 1: TOPcmd grouping, 2: default, TOPcmd.UARGfullcmd grouping
     -t time difference in seconds (timeshift old nmon data, use '-d' field on web UI)
