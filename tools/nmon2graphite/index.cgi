#!/usr/bin/perl
# Program name: nmon2graphite cgi perl script.
# Purpose: perl cgi script for nmon2graphite web interface.
# Author: Benoit C chmod666.org.
# Contact: bleachneeded@gmail.com
# This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
#
# Program improved by mauimania
#

use strict;
use warnings;
use LWP::Simple;
use CGI;

# all graphite graphs description are in this file
my $graph_list='graphlist.txt';
my $cgi = CGI->new();
print $cgi->header();

# css and js import
print $cgi->start_html( -title => 'nmon2graphite',-style=>[{'src'=>'anytime.5.0.5.css'},{'src'=>'nmon2graphite.css'},{'src'=>'jquery-ui.css'},{'src'=>'jquery-ui.structure.css'},{'src'=>'jquery-ui.theme.css'}],-script=>[{-type=>'javascript',-src=>'jquery-1.11.2.js'},{-type=>'javascript',-src=>'nmon2graphite.js'},{-type=>'javascript',-src=>'anytime.5.0.5.js'},  {-type=>'javascript',-src=>'anytimetz.js'}, {-type=>'javascript',-src=>'jquery.form.js'}, {-type=>'javascript',-src=>'jquery-migrate-1.2.1.js'},  {-type=>'javascript',-src=>'jquery-ui.js'}, {-type=>'javascript',-src=>'moment.min.js'}]);

print "<div id=\"full_container\">";
print "<div id=\"menu_container\">";

# top and title
# start form
print $cgi->start_form( -name => 'nmon2graphite_form', -id => 'nmon2graphite_form',-action=>'do.pl' ,-method => 'POST', enctype=>'multipart/form-data');
#  lpar and frame choice
print "<div class=\"lpar_choice\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "SVR&nbsp;&nbsp;&nbsp;<select name=\"pseries\" id=\"pseries\" title=\"Choose Power server from the list, LPARs will be automatically updated\" ></select>";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "LPAR&nbsp;<select name=\"lpars\" id=\"lpars\" title=\"Choose an LPAR\" ></select>";
  print "</div>";
  print "</fieldset>";
print "</div>"; # lpar_choice

print "<div class=\"newfontsize\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"newfontsize\" checked id=\"newfontsize\" class=\"noredraw\" title=\"Use new font size\" />";
  print "New";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "Fontsize ";
  print "<input type=\"text\" class=\"noredraw\" name=\"fontsize_box\" id=\"fontsize_box\" value=\"12\" size=\"2\" maxlength=\"2\" title=\"Specify font size\" />";
  print "</div>";
  print "</fieldset>";
print "</div>"; # newfontsize

print "<div class=\"newwidth\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"newwidth\" checked id=\"newwidth\" class=\"noredraw\" title=\"Use new width\" />";
  print "New";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "Width ";
  print "<input type=\"text\" class=\"noredraw\" name=\"nwidth_box\" id=\"nwidth_box\" value=\"1020\" size=\"4\" maxlength=\"4\" title=\"Specify fixed width\" />";
  print "</div>";
  print "</fieldset>";
print "</div>"; # newwidth

#  time periods
print "<div class=\"timeperiods\">";
  print "<fieldset>";
  print "<div id=\"period1_box\">";
  print "<input type=\"checkbox\" name=\"period1_checkbox\" unchecked id=\"period1_checkbox\" class=\"noredraw\" title=\"time period 1\" />";
  print "<input type=\"text\" class=\"noredraw\" name=\"period1_from_time_value\" id=\"period1_from_time_value\" value=\"202502200830\" size=\"12\" maxlength=\"12\" title=\"from time (yyyymmddhhmm)\" />";
  print "~";
  print "<input type=\"text\" class=\"noredraw\" name=\"period1_to_time_value\" id=\"period1_to_time_value\" value=\"202502201830\" size=\"12\" maxlength=\"12\" title=\"until time (yyyymmddhhmm)\" />";
  print "</div>";
  print "<div id=\"period2_box\">";
  print "<input type=\"checkbox\" name=\"period2_checkbox\" unchecked id=\"period2_checkbox\" class=\"noredraw\" title=\"time period 2\" />";
  print "<input type=\"text\" class=\"noredraw\" name=\"period2_from_time_value\" id=\"period2_from_time_value\" value=\"202502200000\" size=\"12\" maxlength=\"12\" title=\"from time (yyyymmddhhmm)\" />";
  print "~";
  print "<input type=\"text\" class=\"noredraw\" name=\"period2_to_time_value\" id=\"period2_to_time_value\" value=\"202502201900\" size=\"12\" maxlength=\"12\" title=\"until time (yyyymmddhhmm)\" />";
  print "</div>";
  print "</fieldset>";
print "</div>"; # time periods

# Hide left
print "<div class=\"hideleft\">";
  print "<fieldset>";
  print "<div id=\"hideleft_box\">";
  print "<input type=\"checkbox\" name=\"hideleft_checkbox\" value=\"on\" id=\"hideleft_checkbox\" />";
  print "</div>";
  print "<div id=\"fill_value_box\">";
  print "<input type=\"checkbox\" name=\"fill_checkbox\" value=\"on\" id=\"fill_checkbox\" />";
  print "<input type=\"text\" class=\"noredraw\" name=\"fill_value\" id=\"fill_value\" value=\"1.0\" size=\"2\" maxlength=\"6\" title=\"scale or rPerf/core value\" />";
  print "</div>";
  print "</fieldset>";
print "</div>"; # Hide left

#  Prepend mode
print "<div class=\"prepend\">";
  print "<fieldset>";
  print "<div id=\"prepend_box\">";
  print "<input type=\"checkbox\" name=\"prepend_checkbox\" unchecked id=\"prepend_checkbox\" class=\"redraw\" title=\"Click on this checkbox to prepend graph\" />";
  print "prepend";
  print "</div>";
  print "<div id=\"mindays_value_box\">";
  print "<input type=\"checkbox\" name=\"mindays_checkbox\" unchecked id=\"mindays_checkbox\" class=\"noredraw\" title=\"display past time (minus days)\" />";
  print "<input type=\"text\" class=\"noredraw\" name=\"mindays_value\" id=\"mindays_value\" value=\"000\" size=\"1\" maxlength=\"4\" />";
  print "-d";
  print "</div>";
  print "</fieldset>";
print "</div>"; # Prepend mode

#  lpar and frame choice new

print "<div class=\"lpar_checkboxes\">";
  print "<fieldset>";
  ## LPAR checkboxes
  print "<div class=\"checkboxes\" id=\"lpar_choice_radio\">"; # radio group
  print "</div>"; # radio group
  print "</fieldset>";
print "</div>"; #  lpar and frame choice new lpar_checkboxes

#  interval choice
print "<div class=\"fixed_time\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "<label>From</label>";
  print "<input type=\"text\" name=\"date_value_from\" id=\"date_value_from\" class=\"redraw\" size=\"20\" title=\"Choose starting date\" >";
  print "<input type=\"text\" name=\"time_value_from\" id=\"time_value_from\" class=\"redraw\" size=\"15\" title=\"Choose starting hour\" >";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "<label>To</label>";
  print "<input type=\"text\" name=\"date_value_until\" id=\"date_value_until\" class=\"redraw\" size=\"20\" title=\"Choose ending date\" >";
  print "<input type=\"text\" name=\"time_value_until\" id=\"time_value_until\" class=\"redraw\" size=\"15\" title=\"Choose ending hour\" >";
  print "</div>";
  print "</fieldset>";
print "</div>"; # fixed_time

# LPAR table
print "<div class=\"lpartable\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"lpartable_checkbox\" checked id=\"lpartable_checkbox\" title=\"Display LPAR table\" />";
  print "LPAR Tbl";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"mygraph_div\" unchecked id=\"mygraph_div\" title=\"Display Ad-hoc graph\" />";
  print "My Graph";
  print "</div>";
  print "</fieldset>";
print "</div>"; # LPAR table

# Graph type
print "<div class=\"graphtype\">";
  print "<fieldset>";
  print "<label><input type=\"checkbox\" name=\"cpuded_checkbox\" value=\"on\" id=\"cpuded_checkbox\" checked />DED</label>";
  print "<label><input type=\"checkbox\" name=\"cpushr_checkbox\" value=\"on\" id=\"cpushr_checkbox\" checked />SHR</label>";
  print "<label><input type=\"checkbox\" name=\"memory_checkbox\" value=\"on\" id=\"memory_checkbox\" checked />MEM</label>";
  print "<label><input type=\"checkbox\" name=\"disk_checkbox\" value=\"on\" id=\"disk_checkbox\" checked />DISK</label>";
  print "<label><input type=\"checkbox\" name=\"adapter_checkbox\" value=\"on\" id=\"adapter_checkbox\" checked />ADA</label>";
  print "<label><input type=\"checkbox\" name=\"network_checkbox\" value=\"on\" id=\"network_checkbox\" checked />NET</label>";
  print "</fieldset>";
print "</div>"; # Graph type

#  Single/Multi-node mode & Clear all graphs
print "<div class=\"mode\">";
  print "<fieldset>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"mode_checkbox\" unchecked id=\"mode_checkbox\" class=\"redraw\" title=\"Click on this checkbox to enable multi-node graphing\" />";
  print "Multi-node";
  print "</div>";
  print "<div class=\"sep_form\">";
  print "<input type=\"checkbox\" name=\"deleteall_checkbox\" unchecked id=\"deleteall_checkbox\" class=\"redraw\" title=\"Click on this checkbox to delete all already displayed graphs\" />";
  print "Delete all";
  print "</div>";
  print "</fieldset>";
print "</div>"; # Single/Multi-node mode & Clear all graphs

#  real time
print "<div class=\"real_time\">";
  print "<fieldset>";
  print "<input type=\"checkbox\" name=\"real_time_checkbox\" unchecked id=\"real_time_checkbox\" class=\"redraw\" title=\"Click on this checkbox to enable/disable realtime graphing, all already displayed graphs will be deleted\" />";
  print "RT: From ";
  print "<input type=\"text\" name=\"time_value\" id=\"time_value\" class=\"redraw\" value=\"30\" size=\"3\" maxlength=\"4\" title=\"Realtime graphing will graph from now until this value\" >";
  print "<select name=\"time_unit\" id=\"time_unit\" class=\"redraw\"><option value=\"h\">h</option><option value=\"min\" selected=\"selected\">min</option></select>";
  print " ~ now .. ";
  print "<input type=\"text\" name=\"realtime_interval\" id=\"realtime_interval\" class=\"redraw\" value=\"15\" size=\"2\" maxlength=\"3\" title=\"Specify interval in seconds\" >sec";
  print "</fieldset>";
print "</div>"; # real_time

print "<div class=\"newheight\">";
  print "<fieldset>";
  print "<label><input type=\"checkbox\" name=\"newheight\" id=\"newheight\" class=\"noredraw\" title=\"Use new height\" /></label>";
  print " Height <input type=\"text\" name=\"height_box\" id=\"height_box\" class=\"noredraw\" value=\"300\" size=\"4\" maxlength=\"4\" title=\"Specify fixed height\" >";
  print "</fieldset>";
print "</div>"; # newheight

print "<div class=\"newymax\">";
  print "<fieldset>";
  print "<label><input type=\"checkbox\" name=\"newymax\" id=\"newymax\" class=\"noredraw\" title=\"Use new yMax\" /></label>";
  print " yMax <input type=\"text\" name=\"ymax_box\" id=\"ymax_box\" class=\"noredraw\" value=\"100\" size=\"4\" maxlength=\"8\" title=\"Specify yMax value\" >";
  print "</fieldset>";
print "</div>"; # ymax

print "<div class=\"width_scale\">";
  print "<fieldset>";
  print "<label><input type=\"checkbox\" name=\"auto_scale\" id=\"auto_scale\" class=\"redraw\" title=\"Enable/Disable link width auto-scaling\" unchecked /></label>";
  print " AutoWidth <input type=\"text\" name=\"width_box\" id=\"width_box\" class=\"redraw\" value=\"1440\" size=\"4\" maxlength=\"4\" title=\"Choose a fixed witdh for link width\" >";
  print "</fieldset>";
print "</div>"; # width_scale

print "<div class=\"mygraph\">";
  print "<fieldset>";
  print "<div class=\"mygraphel\">";
  print "<input type=\"checkbox\" name=\"mygraph\" unchecked id=\"mygraph\" class=\"redraw\" title=\"Render my graph\" />";
  print "MyGraph";
  print "</div>";
  print "<div class=\"mygraphel\">";
  print "<input type=\"checkbox\" name=\"reflpartbl\" unchecked id=\"reflpartbl\" class=\"noredraw\" title=\"Refresh LPAR table\" />";
  print "Ref LPAR";
  print "...Template:";
  print "</div>";
  print "<div>";
  print "<select name=\"template_box\" id=\"template_box\">";
  print "<option value=\"default\">default</option>";
  print "<option value=\"default0\">default0</option>";
  print "<option value=\"noc\">noc</option>";
  print "<option value=\"plain\">plain</option>";
  print "<option value=\"summary\">summary</option>";
  print "<option value=\"alphas\">alphas</option>";
  print "<option value=\"pyr\">pyr</option>";
  print "<option value=\"solarized-dark\">solarized-dark</option>";
  print "<option value=\"solarized-light\">solarized-light</option>";
  print "<option value=\"classic\">classic</option>";
  print "<option value=\"grafana\">grafana</option>";
  print "<option value=\"ocean1\">ocean1</option>";
  print "<option value=\"ocean2\">ocean2</option>";
  print "<option value=\"forest1\">forest1</option>";
  print "<option value=\"forest2\">forest2</option>";
  print "<option value=\"sunset1\">sunset1</option>";
  print "<option value=\"sunset2\">sunset2</option>";
  print "<option value=\"moonlight1\">moonlight1</option>";
  print "<option value=\"moonlight2\">moonlight2</option>";
  print "<option value=\"lava1\">lava1</option>";
  print "<option value=\"lava2\">lava2</option>";
  print "<option value=\"templ1\">templ1</option>";
  print "<option value=\"templ2\">templ2</option>";
  print "<option value=\"templ3\">templ3</option>";
  print "</select>";
  print " SMT mode <input type=\"text\" name=\"smtmode_box\" id=\"smtmode_box\" class=\"noredraw\" value=\"8\" size=\"2\" maxlength=\"2\" title=\"Specify SMT mode\" >";
  print " Repeat <input type=\"text\" name=\"repeat_box\" id=\"repeat_box\" class=\"noredraw\" value=\"11\" size=\"4\" maxlength=\"4\" title=\"Specify repeat days or weeks\" >";
  print " Sort LPAR<input type=\"checkbox\" name=\"sortlpar_checkbox\" unchecked id=\"sortlpar_checkbox\" class=\"noredraw\" title=\"Click on this checkbox to sort LPAR table\" />";
  print "</div>";
  print "<div class=\"mygraphel2\">";
  print "<textarea name=\"mygraph_box\" id=\"mygraph_box\" class=\"redraw\" rows=\"3\" cols=\"85\" title=\"Input my graph\" >";
  print "target=alias(nmon.PPPPP.LLLLL.cpu_all.user_per,\"User%\")&target=alias(nmon.PPPPP.LLLLL.cpu_all.sys_per,\"Sys%\")&target=alias(nmon.PPPPP.LLLLL.cpu_all.wait_per,\"Wait%\")&height=210&width=720&format=png&areaMode=stacked&title=Power PPPPP LPAR LLLLL|CPU Total (stacked)&vtitle=Percent&yMin=0&yMax=100&from=SSSSS&until=UUUUU";
  print "</textarea>";
  print "</div>";
  print "</fieldset>";
print "</div>"; # mygraph

#  metrics
print "<div class=\"all_checkboxes\">";
  print "<fieldset>";
  ## graphs checkboxes
  print "<div class=\"checkboxes\" id=\"metric_choice\">";
  open my $graph_list_fd, $graph_list or die "Cannot open $graph_list : $!";
  my $graphtype = "";
  my $graphseq = 0;
  my %fontcolors = (	"t1cpuded", "#000000", "t2cpushr", "#0000FF", "t3mem",   "#006400", "t4disk",  "#8B0000",
			"t5adapt",  "#DC143C", "t6net",    "#9400D3");
  while ( my $graph_line = <$graph_list_fd> ) {
    my @graph_line_split=split(':',$graph_line);
    $graph_line_split[0] =~ /^$/ and next; # matches (thus skipping to the next line) if the line is blank
    $graph_line_split[0] =~ /^#/ and next; # matches (thus skipping to the next line) if a '#' is found as 1st character of the line
    my @graphtype_split=split('_',$graph_line_split[0]);
    if ($graphtype ne $graphtype_split[0]) {
	if ($graphseq > 0) {
		print "</div>"; # graph type
	}
  	print "<div "."class=".$graphtype_split[0].">"; # graph type
	$graphtype = $graphtype_split[0];
    }
print "<label><input type=\"checkbox\" name=\"" . $graph_line_split[1] . "\" value=\"on\" class=\"style_checkbox\" id=\"checkbox_" . $graph_line_split[0] . "\" /> <font color=\"" . $fontcolors{$graphtype_split[0]} . "\" >" . $graph_line_split[1] . "</font></label>";
    $graphseq++;
  }
  print "</div>"; # last graph type

  print "</div>"; # checkboxes
  print "</fieldset>";
print "</div>"; # all_checkboxes metrics

# end form
print $cgi->end_form;
print "</div>"; # menu_container

# start graph div
print "<div id=\"all_graphs\">";
  print "<fieldset id=\"draw_graphs\">";
  print "</fieldset>";
print "</div>"; # all_graphs
# end graph div

print "</div>"; # full_container

print "<div class=\"clear\"></div>";
print $cgi->end_html;
