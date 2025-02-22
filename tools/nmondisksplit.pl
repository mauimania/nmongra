#!/usr/bin/perl

use strict;
use warnings;
use Switch;
use Data::Dumper;
use Getopt::Long;
use File::Basename;

# sub function to print help
sub print_help {
  print STDERR << "EOF";
usage: $0 -c disk_count
  -c disk count
EOF
  exit 1;
}

my $disk_count  = 100;
my $help;

my $disknum_string="";
my $ispower = 0;
my $newdir;
my $dirnum;

$| = 1; # forces flush after write/print

print_help if ( ! GetOptions('h' => \$help, 'c=i' => \$disk_count ) or defined $help );

# reads standard input

while ( my $input_line = <STDIN> ) {
	chomp($input_line);
	my($file, $dir, $ext) = fileparse($input_line);
	chomp($file);
	$dir =~ s/\/$//;
	if ($file =~ /power/) {
		$ispower = 1;
	} else {
		$ispower = 0;
	}
	$disknum_string = $file;
	$disknum_string =~ s/\D//g;
	if ($ispower == 1) {
		$dirnum = sprintf("%03d", 500+$disknum_string/$disk_count);
	} else {
		$dirnum = sprintf("%03d",     $disknum_string/$disk_count);
	}
	$newdir = $dir.$dirnum;
	if (-d $newdir) {
#		print "$newdir exists";
	} else {
 		print "$newdir does not exist!\n";
 	print "Directory: " . $newdir . "\n";
 		mkdir $newdir or die "Couldn't create dir: [$newdir] ($!)\n";
	}
 	link("$input_line", "$newdir"."/".$file) || die "Cannot symlink $input_line to $newdir: $!\n";
} # end of while
