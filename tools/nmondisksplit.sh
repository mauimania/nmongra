#!/bin/sh

######################################################
TOOLSDIR=.
NMONLOGDIR=${1:-../whisper/nmon}
######################################################
DISKCNT=${2:-42}

cd ${NMONLOGDIR}

diskdirlist="diskbusy diskread diskwrite diskxfer diskrxfer diskbsize diskrio diskwio diskavgrio diskavgwio diskserv diskreadserv diskwriteserv diskwait emcbsize emcbusy emcread emcwrite emcxfer emcserv"

for diskdir in $diskdirlist; do
        find . -type d -name ${diskdir}[0-9][0-9][0-9]       -exec rm -rf {} \;
        find . -type d -name ${diskdir}[0-9][0-9][0-9][0-9]* -exec rm -rf {} \;
done

find . -name hdisk*.wsp | grep -v iostat >  /tmp/nmondisklist-0.$$
find . -name power*.wsp | grep -v iostat >> /tmp/nmondisklist-0.$$
sort /tmp/nmondisklist-0.$$ >  /tmp/nmondisklist.$$

${TOOLSDIR}/nmondisksplit.pl -c ${DISKCNT}  < /tmp/nmondisklist.$$

rm  /tmp/nmondisklist-0.$$  /tmp/nmondisklist.$$

exit 0
