/*
# Program name: nmon2graphite jquery/javascript script.
# Purpose: jquery/javascript cgi script for nmon2graphite web interface.
# Author: Benoit C chmod666.org.
# Contact: bleachneeded@gmail.com
# Disclaimer: this programm is provided "as is". please contact me if you found bugs.
# Last update :  Apr 17, 2013
# Version : 0.1a
# This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
# To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/ or send
# a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
#
# Program improved by mauimania
#
*/

function nthIndex(str, pat, n){
	    var L= str.length, i= -1;
	    while(n-- && i++<L){
		            i= str.indexOf(pat, i);
		            if (i < 0) break;
		        }
	    return i;
}

/* # fill pseries select box */
/* f_pseries_select(graphite_url, '#pseries'); */

function f_pseries_select(graphite_ip, select_pseries) {
  $(select_pseries).empty();
  if ($("#topas_checkbox").is(':checked')) {
	$.getJSON("http://"+graphite_ip+"/metrics/find/?query=topas.*",null,function(result) {
		$.each(result, function(i, item) {
			var values = result[i].id.split(".");
			$(select_pseries).append(new Option(values[1],values[1],true,true));
		});
	}); 
  } else {
	$.getJSON("http://"+graphite_ip+"/metrics/find/?query=nmon.*",null,function(result) {
		$.each(result, function(i, item) {
			var values = result[i].id.split(".");
			$(select_pseries).append(new Option(values[1],values[1],true,true));
		});
	}); 
  }
}

/* # fill lpars select box */
/* f_lpars_select(graphite_url, '#pseries', '#lpars') */

function f_lpars_select(graphite_ip, select_pseries, select_lpars) {
  $(select_lpars).empty();
  var current_val = $(select_pseries).val();
  if ($("#topas_checkbox").is(':checked')) {
	$.getJSON("http://"+graphite_ip+"/metrics/find/?query=topas."+current_val+".*",null,function(lpars_result) {
		$.each(lpars_result, function(i, item){
			var lpar_values = lpars_result[i].id.split(".");
			$(select_lpars).append(new Option(lpar_values[2],lpar_values[2],true,true));
		});
	});
  } else {
	$.getJSON("http://"+graphite_ip+"/metrics/find/?query=nmon."+current_val+".*",null,function(lpars_result) {
		$.each(lpars_result, function(i, item){
			var lpar_values = lpars_result[i].id.split(".");
			$(select_lpars).append(new Option(lpar_values[2],lpar_values[2],true,true));
		});
	});
  }
}

/* init LPAR table */

function sortJsonData(a,b){
    return a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1;
};
  
function sortstring(a,b){
    return a.split('.')[1].toLowerCase() > b.split('.')[1].toLowerCase() ? 1 : -1;
};

function f_init_lpar_table(graphite_ip, lpar_choice_radio) {
  var old_pseries="dummy";
  var stylenum = 0;
  var jsonDataFrame;
  var jsonDataLpar;  
  var jsonDataLpar2 = [];  

  $(lpar_choice_radio).empty();

  $.ajax({
      async: false,
      url: "http://"+graphite_ip+"/metrics/find/?query=nmon.*",
      dataType: "json",
      success: function(result) {
		jsonDataFrame = result;
	       }
  });
  jsonDataFrame.sort(sortJsonData);
  $.each(jsonDataFrame, function(i, item) {
      var values = jsonDataFrame[i].id.split(".");
 
      $.ajax({
	async: false,
	url: "http://"+graphite_ip+"/metrics/find/?query=nmon."+values[1]+".*",
	dataType: "json",
	success: function(resultlpar) {
	  jsonDataLpar = resultlpar;
	}
      });
      jsonDataLpar.sort(sortJsonData);
      $.each(jsonDataLpar, function(ilpar, itemlpar) {
	  var valueslpar = jsonDataLpar[ilpar].id.split(".");

	  jsonDataLpar2.push(valueslpar[1]+"."+valueslpar[2]);
      });
  });
  if ($('#sortlpar_checkbox').is(':checked')) {
      jsonDataLpar2.sort(sortstring);
  }
  var arrayLength = jsonDataLpar2.length;
  for (var i = 0; i < arrayLength; i++) {
	var valueslpar = jsonDataLpar2[i].split(".");

	if (old_pseries != valueslpar[0]){
	    stylenum = stylenum + 1;
	}
	old_pseries = valueslpar[0];
	if (stylenum%2 == 0){
	    $(lpar_choice_radio).append("<label class=\"style-radio0\" ><input type=\"radio\" name=\"lpar_choice\" value=\""+valueslpar[0]+'-'+valueslpar[1]+"\" >"+valueslpar[0]+'-'+'<b>'+valueslpar[1]+"</b></label>");
	} else {
	    $(lpar_choice_radio).append("<label class=\"style-radio1\" ><input type=\"radio\" name=\"lpar_choice\" value=\""+valueslpar[0]+'-'+valueslpar[1]+"\" >"+valueslpar[0]+'-'+'<b>'+valueslpar[1]+"</b></label>");
	}
  }
}

function f_init_lpar_table_topas(graphite_ip, lpar_choice_radio) {
  var old_pseries="dummy";
  var stylenum = 0;
  var jsonDataFrame;
  var jsonDataLpar;  
  $(lpar_choice_radio).empty();

  $.ajax({
      async: false,
      url: "http://"+graphite_ip+"/metrics/find/?query=topas.*",
      dataType: "json",
      success: function(result) {
		jsonDataFrame = result;
	       }
  });
  jsonDataFrame.sort(sortJsonData);
  $.each(jsonDataFrame, function(i, item) {
      var values = jsonDataFrame[i].id.split(".");
 
      $.ajax({
	async: false,
	url: "http://"+graphite_ip+"/metrics/find/?query=topas."+values[1]+".*",
	dataType: "json",
	success: function(resultlpar) {
	  jsonDataLpar = resultlpar;
	}
      });
      jsonDataLpar.sort(sortJsonData);
      $.each(jsonDataLpar, function(ilpar, itemlpar) {
	  var valueslpar = jsonDataLpar[ilpar].id.split(".");

	    if (old_pseries != valueslpar[1]){
	      stylenum = stylenum + 1;
	    }
	    old_pseries = valueslpar[1];
	    if (stylenum%2 == 0){
	      $(lpar_choice_radio).append("<label class=\"style-radio0\" ><input type=\"radio\" name=\"lpar_choice\" value=\""+valueslpar[1]+'-'+valueslpar[2]+"\" >"+valueslpar[1]+'-'+valueslpar[2]+"</label>");
	    } else {
	      $(lpar_choice_radio).append("<label class=\"style-radio1\" ><input type=\"radio\" name=\"lpar_choice\" value=\""+valueslpar[1]+'-'+valueslpar[2]+"\" >"+valueslpar[1]+'-'+valueslpar[2]+"</label>");
	    }
      });      
  });  
}

function f_init_lpar_table_con(graphite_ip, lpar_choice_radio) {
  var old_pseries="dummy";
  var stylenum = 0;
  var jsonDataFrame;
  var jsonDataLpar;  
  var jsonDataLpar2 = [];

  $(lpar_choice_radio).empty();

  $.ajax({
      async: false,
      url: "http://"+graphite_ip+"/metrics/find/?query=nmon.*",
      dataType: "json",
      success: function(result) {
		jsonDataFrame = result;
	       }
  });
  jsonDataFrame.sort(sortJsonData);
  $.each(jsonDataFrame, function(i, item) {
      var values = jsonDataFrame[i].id.split(".");
 
      $.ajax({
	async: false,
	url: "http://"+graphite_ip+"/metrics/find/?query=nmon."+values[1]+".*",
	dataType: "json",
	success: function(resultlpar) {
	  jsonDataLpar = resultlpar;
	}
      });
      jsonDataLpar.sort(sortJsonData);
      $.each(jsonDataLpar, function(ilpar, itemlpar) {
	  var valueslpar = jsonDataLpar[ilpar].id.split(".");

	  jsonDataLpar2.push(valueslpar[1]+"."+valueslpar[2]);
      });
  });
  if ($('#sortlpar_checkbox').is(':checked')) {
	        jsonDataLpar2.sort(sortstring);
  }
  var arrayLength = jsonDataLpar2.length;
  for (var i = 0; i < arrayLength; i++) {
	    var valueslpar = jsonDataLpar2[i].split(".");

	    if (old_pseries != valueslpar[0]){
	      stylenum = stylenum + 1;
	    }
	    old_pseries = valueslpar[0];
	    if (stylenum%2 == 0){
	      $(lpar_choice_radio).append("<div class=\"lpar_choice_con1 style-radio0\"><label><input type=\"checkbox\" class=\"lpar_choice_checkbox\" name=\"lpar_choice_checkbox\" value=\""+valueslpar[0]+'-'+valueslpar[1]+"\">"+valueslpar[0]+'-'+valueslpar[1]+"</label></div><div><input type=\"text\" class=\"lpar_choice_con2 noredraw style-radio0\" name=\""+valueslpar[0]+'-'+valueslpar[1]+"_scale\" id=\""+valueslpar[0]+'-'+valueslpar[1]+"_scale\" value=\"1.0\" size=\"3\" maxlength=\"5\" title=\"scale or rPerf/core value\"></div>");
	    } else {
	      $(lpar_choice_radio).append("<div class=\"lpar_choice_con1 style-radio1\"><label><input type=\"checkbox\" class=\"lpar_choice_checkbox\" name=\"lpar_choice_checkbox\" value=\""+valueslpar[0]+'-'+valueslpar[1]+"\">"+valueslpar[0]+'-'+valueslpar[1]+"</label></div><div><input type=\"text\" class=\"lpar_choice_con2 noredraw style-radio1\" name=\""+valueslpar[0]+'-'+valueslpar[1]+"_scale\" id=\""+valueslpar[0]+'-'+valueslpar[1]+"_scale\" value=\"1.0\" size=\"3\" maxlength=\"5\" title=\"scale or rPerf/core value\"></div>");
	    }
      }      
      $('.lpar_choice_con1 > label').css("width","auto");
      $('.lpar_choice_con2 > label').css("width","auto");
}

/* # inittimers */
/* f_init_times('#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until'); */
function f_init_times(date_from, time_from, date_until, time_until) {
  var current_date   = new Date();
  var current_month  = ("0" + (current_date.getMonth() + 1)).slice(-2);
  var current_day    = ("0" + current_date.getDate()).slice(-2);
  var current_year   = current_date.getFullYear();
  var current_hour   = ("0" + current_date.getHours()).slice(-2);
  var current_minute = ("0" + current_date.getMinutes()).slice(-2);
  $(date_until).val(current_year+"/"+current_month+"/"+current_day);
  $(time_until).val(current_hour+":"+current_minute);
  $(date_until).AnyTime_picker({format: "%Y/%m/%d", labelTitle: "Date",firstDOW: 1});
  $(time_until).AnyTime_picker({format: "%H:%i", labelTitle: "Hour", labelHour: "Hour", labelMinute: "Minute"});
  current_date.setDate(current_date.getDate()-1);
  current_month  = ("0" + (current_date.getMonth() + 1)).slice(-2);
  current_day    = ("0" + current_date.getDate()).slice(-2);
  current_year   = current_date.getFullYear();
  current_hour   = ("0" + current_date.getHours()).slice(-2);
  current_minute = ("0" + current_date.getMinutes()).slice(-2);
  $(date_from).val(current_year+"/"+current_month+"/"+current_day);
  $(time_from).val(current_hour+":"+current_minute);
  $(date_from).AnyTime_picker({format: "%Y/%m/%d", labelTitle: "Date",firstDOW: 1});
  $(time_from).AnyTime_picker({format: "%H:%i", labelTitle: "Hour", labelHour: "Hour", labelMinute: "Minute"});

  $.ajax({
      type: "GET",
      url: "query-date-time.txt",
      success: function(data) {
		var datetimearray = [];
		var fromdatetimeline;
		var todatetimeline;

		datetimearray = data.split('\n');
		fromdatetimeline = datetimearray[0].split(/[-: ]/);
		todatetimeline   = datetimearray[1].split(/[-: ]/);

  		var current_year   = todatetimeline[0];
  		var current_month  = todatetimeline[1];
  		var current_day    = todatetimeline[2];
  		var current_hour   = todatetimeline[3];
  		var current_minute = todatetimeline[4];
  		$(date_until).val(current_year+"/"+current_month+"/"+current_day);
  		$(time_until).val(current_hour+":"+current_minute);
		/*
  		$(date_until).AnyTime_picker({format: "%Y/%m/%d", labelTitle: "Date",firstDOW: 1});
  		$(time_until).AnyTime_picker({format: "%H:%i", labelTitle: "Hour", labelHour: "Hour", labelMinute: "Minute"});
		*/
  		current_year   = fromdatetimeline[0];
  		current_month  = fromdatetimeline[1];
  		current_day    = fromdatetimeline[2];
  		current_hour   = fromdatetimeline[3];
  		current_minute = fromdatetimeline[4];
  		$(date_from).val(current_year+"/"+current_month+"/"+current_day);
  		$(time_from).val(current_hour+":"+current_minute);
		/*
  		$(date_from).AnyTime_picker({format: "%Y/%m/%d", labelTitle: "Date",firstDOW: 1});
  		$(time_from).AnyTime_picker({format: "%H:%i", labelTitle: "Hour", labelHour: "Hour", labelMinute: "Minute"});
		*/
	       }
  });
}

/* # real time or not ? */
/* f_toggle_real_time('#time_value', '#time_unit', '#real_time_checkbox', '#draw_graphs',
     '#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until',
     '.style-checkbox', real_time_intervals); */
function f_toggle_real_time(real_time, real_unit, real_checkbox, graphs_div, date_from, time_from, date_until, time_until, checkbox_class, interval_array){
  $(real_time).attr('disabled','disabled'); /* #time_value */
  $(real_unit).attr('disabled','disabled'); /* #time_unit */
  $(real_checkbox).click(function() { /* #real_time_checkbox */
    var $this = $(this);
    if ($this.is(':checked')) {
      $(date_from).attr('disabled','disabled'); /* #date_value_from */
      $(date_until).attr('disabled','disabled'); /* #date_value_until */
      $(time_until).attr('disabled','disabled'); /* #time_value_until */
      $(time_from).attr('disabled','disabled'); /* #time_value_from */
      $(real_time).removeAttr('disabled'); /* #time_value */
      $(real_unit).removeAttr('disabled'); /* #time_unit */
      $(checkbox_class).prop('checked', false); /* .style-checkbox */
      $(graphs_div).children('img').remove(); /* #draw_graphs */
      $(graphs_div).children('a').remove(); /* #draw_graphs */
    } else { /* real time button unchecked! */
      if ($("#mode_checkbox").prop("checked")) {
        $(date_from).removeAttr('disabled'); /* #date_value_from */
        $(time_from).removeAttr('disabled'); /* #time_value_from */
        $(date_until).removeAttr('disabled'); /* #date_value_until */
        $(time_until).removeAttr('disabled'); /* '#time_value_until */
        $(real_time).attr('disabled','disabled'); /* #time_value */
        $(real_unit).attr('disabled','disabled'); /* #time_unit */
        $(checkbox_class).prop('checked', false); /* .style-checkbox */
      } else {
        $(date_from).removeAttr('disabled'); /* #date_value_from */
        $(time_from).removeAttr('disabled'); /* #time_value_from */
        $(date_until).removeAttr('disabled'); /* #date_value_until */
        $(time_until).removeAttr('disabled'); /* '#time_value_until */
        $(real_time).attr('disabled','disabled'); /* #time_value */
        $(real_unit).attr('disabled','disabled'); /* #time_unit */
        $(checkbox_class).prop('checked', false); /* .style-checkbox */
        $(graphs_div).children('img').remove(); /* #draw_graphs */
        $(graphs_div).children('a').remove(); /* #draw_graphs */
        /* # clearing all intervals */
        $.each(interval_array, function(index, value) { 
          clearInterval(interval_array[index]); /* real_time_intervals */
        });
      }
    } 
  });
}

/* # auto_scale or not ?*/
/* f_toggle_auto_scale('#auto_scale', '#width_box'); */
function f_toggle_auto_scale(scale_checkbox, width_value) {
  $(scale_checkbox).click(function() { /* #auto_scale */
    var $this = $(this);
    if ($this.is(':checked')) {
      $(width_value).attr('disabled','disabled'); /* #width_box */
    } else {
      $(width_value).removeAttr('disabled');
    }
  });
}

/* # caculate difference between from date and until date in secondes */
function f_calculate_autoscale(date_from, time_from, date_until, time_until, interval_sec) {
  var array_date_value_from  = $(date_from).val().split('/');
  var array_date_value_until = $(date_until).val().split('/');
  var array_time_value_from  = $(time_from).val().split(':');
  var array_time_value_until = $(time_until).val().split(':');
  var date_from_picked = new Date(array_date_value_from[0],array_date_value_from[1],array_date_value_from[2],array_time_value_from[0],array_time_value_from[1],0,0);
  var date_until_picked = new Date(array_date_value_until[0],array_date_value_until[1],array_date_value_until[2],array_time_value_until[0],array_time_value_until[1],0,0);
  var epoch_from        = date_from_picked.getTime()/1000.0;
  var epoch_until       = date_until_picked.getTime()/1000.0;
  var number_of_seconds = epoch_until-epoch_from;
  var size              = number_of_seconds/interval_sec;
  return size;
}

/*
  f_upload_and_progress_bar('#progressbox', '#progressbar', '#statustxt',
   '#nmon2graphite_submit', '#nmon2graphite_form', '#output');
*/
function f_upload_and_progress_bar(progress_box, progress_bar, status_txt, submit, form, output_para) {
  var progressbox     = $(progress_box);
  var progressbar     = $(progress_bar);
  var statustxt       = $(status_txt);
  var submitbutton    = $(submit);
  var myform          = $(form);
  var output          = $(output_para);
  var completed       = '0%';

  $(form).ajaxForm({
    beforeSubmit: function() {                                          // # before sending form
      submitbutton.attr('disabled', '');                                // # disable upload button
      statustxt.empty();
      progressbox.slideDown();                                          // # show progressbar
      progressbar.width(completed);                                     // # initial value 0% of progressbar
      statustxt.html(completed);                                        // # set status text
      statustxt.css('color','#000');                                    // # initial color of status text
    },
    uploadProgress: function(event, position, total, percentComplete) { // # on progress
      progressbar.width(percentComplete + '%')                          // # update progressbar percent complete
      statustxt.html(percentComplete + '% uploaded & processing');      // # update status text
      if(percentComplete>50) {
        statustxt.css('color','#fff');                                  // # change status text to white after 50%
      }
    },
    complete: function(response) {                                     // # on complete
      output.html(response.responseText);                              // # update element with received data
      myform.resetForm();                                              // # reset form
      submitbutton.removeAttr('disabled');                             // # enable submit button
      progressbox.slideUp();                                           // # hide progressbar
    }
  });
}

/* # redraw all graphs */
/* f_redraw_graphs('#draw_graphs', '#date_value_from', '#time_value_from',
  '#date_value_until', '#time_value_until', '#real_time_checkbox', '#time_value',
  '#time_unit', real_time_intervals, '#auto_scale', '#width_box', nmon_interval); */
function f_redraw_graphs(graph_div, date_from, time_from, date_until, time_until, checkbox_real_time, real_time_value, real_time_unit, interval_array, checkbox_auto_scale, width, interval_sec) {
  /* # clearing all intervals already open */
  f_clear_all_timeout(interval_array); /* real_time_intervals */
  
  /* # step 1 : find all images in graph div */ 
  $(graph_div).find('img').each( function(){ /* #draw_graphs */
    var graph_string        = this.src;
    var image_id            = $(this).attr('class');
    var from_date_formated  = $(time_from).val()+"_"+$(date_from).val().replace(/\//g,"");
    var until_date_formated = $(time_until).val()+"_"+$(date_until).val().replace(/\//g,"");

    graph_string            = graph_string.replace(/"/g,"%22");
    graph_string            = graph_string.replace(/ /g,"%20");
    /* # replace existing from and until date by new ones */
    graph_string            = graph_string.replace(/from=\d{2}:\d{2}_\d{8}/g,"from="+from_date_formated);
    graph_string            = graph_string.replace(/until=\d{2}:\d{2}_\d{8}/g,"until="+until_date_formated);
    /* # if real timed already checked and real time value changed, value will be replaced below */
    graph_string            = graph_string.replace(/from=-[0-9]+[h|min]/g,"from="+from_date_formated);
	
    /* # if real time check */
    if ($(checkbox_real_time).prop("checked")) {
      /* # get new values ...*/
      from_date_formated = "-"+$(real_time_value).val()+$(real_time_unit).val();
      /* # replace from ...*/
      graph_string = graph_string.replace(/from=\d{2}:\d{2}_\d{8}/g,"from="+from_date_formated);
      /* # and delete until ...*/
      graph_string = graph_string.replace(/\&until=\d{2}:\d{2}_\d{8}/g,'');
    }
    graph_string = graph_string.replace(/\d{8}_\d{2}:\d{2}~/g,from_date_formated.split("_").reverse().join("_")+'~');
    graph_string = graph_string.replace(/~\d{8}_\d{2}:\d{2}/g,'~'+until_date_formated.split("_").reverse().join("_"));
	
    /* # add a uniqattr if exists, or replace if it doesnt exisits */
    if(graph_string.indexOf("uniqattr") >= 0) {
      graph_string = graph_string.replace(/uniqattr=[0-9]+/,"uniqattr="+Math.floor(Math.random()*100000));
    }
    else {
      graph_string = graph_string+"&uniqattr="+Math.floor(Math.random()*100000);
    }
	
    /* # if real time check, add an interval */
    if ($(checkbox_real_time).prop("checked")) {
      var real_interval_sec = interval_sec;
      if ($("#realtime_interval").val() == "") {
	real_interval_sec = interval_sec;
      } else {
	real_interval_sec = $("#realtime_interval").val();
      }
      graph_string=graph_string.replace(/uniqattr=[0-9]+/,"");
      var current_length=interval_array.length;
      $("."+image_id).attr('src',graph_string);
      interval_array[current_length]=setInterval(function() {
	
	f_change_image_src("."+image_id, graph_string+"&uniqattr="+Math.floor(Math.random()*100000))
           }, real_interval_sec*500);
    }
    /* # else redraw the image */
    else {
      if ($("#mode_checkbox").prop("checked")) {
      } else {
        $("."+image_id).attr('src',graph_string);
      }
    }
  });

  /* # step 2 : recreate all links for auto scaling */
  $(graph_div).find('a').each( function() {
    var href_string           = $(this).attr('href');
    var href_id               = $(this).attr('class');
    var from_date_formated_h  = $(time_from).val()+"_"+$(date_from).val().replace(/\//g,"");
    var until_date_formated_h = $(time_until).val()+"_"+$(date_until).val().replace(/\//g,"");
    href_string               = href_string.replace(/"/g,"%22");
    href_string               = href_string.replace(/ /g,"%20");
    href_string               = href_string.replace(/from=\d{2}:\d{2}_\d{8}/g,"from="+from_date_formated_h);
    href_string               = href_string.replace(/until=\d{2}:\d{2}_\d{8}/g,"until="+until_date_formated_h);
    href_string = href_string.replace(/\d{8}_\d{2}:\d{2}~/g,from_date_formated_h.split("_").reverse().join("_")+'~');
    href_string = href_string.replace(/~\d{8}_\d{2}:\d{2}/g,'~'+until_date_formated_h.split("_").reverse().join("_"));
    href_string_link          = href_string.replace(/width=[0-9]+/g,"width="+$(width).val());
	
    if ($(checkbox_real_time).prop("checked")) {
      from_date_formated = "-"+$(real_time_value).val()+$(real_time_unit).val();
      href_string_link   = href_string_link.replace(/from=-[0-9]+[h|min]/g,"from="+from_date_formated);
    }

    if ($(checkbox_auto_scale).is(':checked')) {
      /* # if auto_scale check update graph_string_link with good width */
      var width_autoscaled_f = f_calculate_autoscale(date_from, time_from, date_until, time_until, interval_sec);
      href_string_link       = href_string.replace(/width=[0-9]+/g,"width="+width_autoscaled_f);
    }
	
    $("."+href_id).attr('href',href_string_link);
  });
} /* end of function f_redraw_graphs */

function f_clear_all_timeout(array_timeout) {
  var highest_id = array_timeout.length; 
  for (var i=0 ; i < highest_id ; i++) {
    clearInterval(array_timeout[i]);
  }
  array_timeout.length=0;
}

function f_change_image_src(image_class, source_string) {
 /*$(image_class).attr('src','');*/
 $(image_class).attr('src',source_string);
}

function f_add_graph(graphite_url,graph_container,graph_url,graph_link,graph_identifier,date_from_container,time_from_container,date_until_container,time_until_container,interval,checkbox_real_time,intervals_array, mode) {
  var uniqval = Math.floor(Math.random()*100000);
  var lparid = "";
  var template = $("#template_box").val();
  if ($("#mode_checkbox").prop("checked")) {
    lparid=$("#lpars").val();
  }
  /* # if auto scale */
  if ($('#auto_scale').is(':checked')) {
    /* # if auto_scale checked update graph_string_link with good width */
    var width_autoscaled = f_calculate_autoscale(date_from_container, time_from_container, date_until_container, time_until_container, interval);
    graph_link           = graph_link.replace(/width=[0-9]+/g,"width="+width_autoscaled);
  } 
  if ($("#mode_checkbox").prop("checked")) {
    if ($("#prepend_checkbox").is(':checked')) {
      $("<a class=href_"+graph_identifier+"_"+lparid+"_"+uniqval+" href=http://"+graphite_url+"/render?"+graph_link+"&template="+template+"&uniqattr="+uniqval+" target=\"_blank\"><img class=\"img_"+graph_identifier+"_"+lparid+" dynamicgraphs\" src=\"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval+"\"/></a>").prependTo(graph_container);
    } else {
      $("<a class=href_"+graph_identifier+"_"+lparid+"_"+uniqval+" href=http://"+graphite_url+"/render?"+graph_link+"&template="+template+"&uniqattr="+uniqval+" target=\"_blank\"><img class=\"img_"+graph_identifier+"_"+lparid+" dynamicgraphs\" src=\"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval+"\"/></a>").appendTo(graph_container);
    }
  } else {
    if ($("#prepend_checkbox").is(':checked')) {
      $("<a class=href_"+graph_identifier+" href=http://"+graphite_url+"/render?"+graph_link+"&template="+template+"&uniqattr="+uniqval+" target=\"_blank\"><img class=\"img_"+graph_identifier+" dynamicgraphs\" src=\"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval+"\"/></a>").prependTo(graph_container);
    } else {
      $("<a class=href_"+graph_identifier+" href=http://"+graphite_url+"/render?"+graph_link+"&template="+template+"&uniqattr="+uniqval+" target=\"_blank\"><img class=\"img_"+graph_identifier+" dynamicgraphs\" src=\"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval+"\"/></a>").appendTo(graph_container);
    }
  }
  $(".dynamicgraphs").on("load", function(){
	/*$('#loader_img').hide();*/
	$(".loadingicon").remove();
  });
  /* # if real time */
  if ($(checkbox_real_time).prop("checked")) {
    var real_interval_sec = interval;
    if ($("#realtime_interval").val() == "") {
	real_interval_sec = interval;
    } else {
	real_interval_sec = $("#realtime_interval").val();
    }
    var current_length = intervals_array.length;
    if ($("#mode_checkbox").prop("checked")) {
      intervals_array[current_length]=setInterval(function() { f_change_image_src(".img_"+graph_identifier+"_"+lparid,"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval)}, real_interval_sec*500);
    } else {
      intervals_array[current_length]=setInterval(function() { f_change_image_src(".img_"+graph_identifier,"http://"+graphite_url+"/render?"+graph_url+"&template="+template+"&uniqattr="+uniqval)}, real_interval_sec*500);
    }
  }
}

/* ####### document ready ####### */
$(document).ready(function (){

  var graph_file = "graphlist.txt"
 
  /* # Put graphite box IP here */
  var graphite_url = "192.168.192.233:11082";
  
  /* # Put nmon interval here ; in seconds */
     var nmon_interval = "120";
  
  /* # vars fixed*/
  var real_time_intervals = [];
  var graphs_to_draw      = [];
  var graphs_to_draw_link = [];
  var width_autoscaled;
  var graph_string_link;
  var mode = 0;
  var deleteall = 0;
  var graphlistarray = [];
  var newheight = 0;
  var newymax = 0;
  var newwidth = 0;
  var newfontsize = 0;
  var topas = 0;

  /* # enabling tooltips */
  $(document).tooltip();
  $( "#date_value_from" ).tooltip({ position: { my: "top+45", at: "top" } });
  $( "#date_value_until" ).tooltip({ position: { my: "top+25", at: "top" } });
  $( "#time_value_from" ).tooltip({ position: { my: "left+15 center", at: "right center" } });
  $( "#time_value_until" ).tooltip({ position: { my: "left+15 center", at: "right center" } });

  /* # clear intervals before starting */
  f_clear_all_timeout(real_time_intervals);

  /* # fill chooseboxes */
  f_pseries_select(graphite_url, '#pseries');
  $('#pseries').change(function() {
	f_lpars_select(graphite_url, '#pseries', '#lpars')
  });
  $('#pseries').focus(function() {
	f_lpars_select(graphite_url, '#pseries', '#lpars')
  });
  
  $('#lpars').change(function() {
    var $radios = $('input:radio[name="lpar_choice"]');
    $radios.filter('[value=\"' + $("#pseries").val() + '-' + $("#lpars").val() + '\"]').attr('checked', true);
  });
  $('#lpars').focus(function() {
    var $radios = $('input:radio[name="lpar_choice"]');
    $radios.filter('[value=\"' + $("#pseries").val() + '-' + $("#lpars").val() + '\"]').attr('checked', true);
  });  
  
  /* init LPAR table */
  f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
  
  $('input:radio[name="lpar_choice"]:checked').live('change', function() {
    var pl_val = $('input:radio[name="lpar_choice"]:checked').val().split("-");
    var frame=pl_val[0]+'-'+pl_val[1]+'-'+pl_val[2];
    var lpar=pl_val[3];
    $("#pseries").val(frame);
    $("#lpars").empty();

    if ($("#topas_checkbox").is(':checked')) {
	$.getJSON("http://"+graphite_url+"/metrics/find?query=topas."+frame+".*",null,function(lpars_result) {
		$.each(lpars_result, function(i, item){
			var lpar_values = lpars_result[i].id.split(".");
			$("#lpars").append(new Option(lpar_values[2],lpar_values[2],true,true));
		});
		$('select[name=lpars] option[value='+lpar+']').attr("selected","selected");      
	});
    } else {
	$.getJSON("http://"+graphite_url+"/metrics/find?query=nmon."+frame+".*",null,function(lpars_result) {
		$.each(lpars_result, function(i, item){
			var lpar_values = lpars_result[i].id.split(".");
			$("#lpars").append(new Option(lpar_values[2],lpar_values[2],true,true));
		});
		$('select[name=lpars] option[value='+lpar+']').attr("selected","selected");      
	});
    }
  });

  f_init_times('#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until');
  f_toggle_real_time('#time_value', '#time_unit', '#real_time_checkbox', '#draw_graphs', '#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', '.style-checkbox', real_time_intervals);
  f_toggle_auto_scale('#auto_scale', '#width_box');

  /* # if any element of redraw  class change redraw all graphs */
  $('.redraw').change(function() {
    f_redraw_graphs('#draw_graphs', '#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', '#real_time_checkbox', '#time_value', '#time_unit', real_time_intervals, '#auto_scale', '#width_box', nmon_interval);
  });
  
  $('.redraw').keyup(function() {
    f_redraw_graphs('#draw_graphs', '#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', '#real_time_checkbox', '#time_value', '#time_unit', real_time_intervals, '#auto_scale', '#width_box', nmon_interval);
  });

  $("#fontsize_box").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#nwidth_box").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#time_value").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#height_box").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#ymax_box").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#width_box").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });
  $("#realtime_interval").keyup(function (){ $(this).val($(this).val().replace(/[^0-9]/gi,"")); });

  f_upload_and_progress_bar('#progressbox', '#progressbar', '#statustxt', '#nmon2graphite_submit', '#nmon2graphite_form', '#output');

  if ($("#mygraph_div").is(':checked')) {
        $(".mygraph").show();
  } else {
        $(".mygraph").hide();
  }
  /* # browse the graph file to find associated graphs url render */
  $.get(graph_file,function(data){ /* graphlist.txt */
    graphlistarray = data.split('\n');
  }); /* end of $.get(graph_file,function(data){}) */  

  if ($("#cpuded_checkbox").is(':checked')) {
	$(".t1cpuded").show();
  } else {
	$(".t1cpuded").hide();
  }
  if ($("#cpushr_checkbox").is(':checked')) {
	$(".t2cpushr").show();
  } else {
	$(".t2cpushr").hide();
  }
  if ($("#memory_checkbox").is(':checked')) {
	$(".t3mem").show();
  } else {
	$(".t3mem").hide();
  }
  if ($("#disk_checkbox").is(':checked')) {
	$(".t4disk").show();
  } else {
	$(".t4disk").hide();
  }
  if ($("#adapter_checkbox").is(':checked')) {
	$(".t5adapt").show();
  } else {
	$(".t5adapt").hide();
  }
  if ($("#network_checkbox").is(':checked')) {
	$(".t6net").show();
  } else {
	$(".t6net").hide();
  }

  /* on a checkbox checked draw graph */
  $('#nmon2graphite_form :checkbox').click(function() {
    /* # empty graphs and graph link arrays */
    graphs_to_draw.length      = 0;
    graphs_to_draw_link.length = 0;
    
    /* # create new id/class for newly created graphs */
    var $this     = $(this);
    var wanted_id = this.id;
    var wanted_id_org = wanted_id;
    var wanted_class = this.className;
   
    if (wanted_id == "mode_checkbox") {    
      if ($this.is(':checked')) {
	mode = 1;
	return;
      } else {
	mode = 0;
	return;
      }
    }
    if (wanted_id == "deleteall_checkbox") {
      if ($this.is(':checked')) {
	deleteall = 1;
	$("#draw_graphs").children('img').remove(); /* #draw_graphs */
	$("#draw_graphs").children('a').remove(); /* #draw_graphs */

	$this.attr('checked', false);
	$(".loadingicon").remove();
	return;
    } else {
	deleteall = 0;
	return;
      }
    }
    if (wanted_id == "sortlpar_checkbox") {
	if ($("#con_checkbox").is(':checked')) {
		f_init_lpar_table_con(graphite_url, '#lpar_choice_radio');
	} else {
		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
    }
    if (wanted_id == "period1_checkbox") {
      if ($this.is(':checked')) {
	var tmpstr = $('#period1_from_time_value').val();
	if (tmpstr != '' && tmpstr.length == 12 && tmpstr.substr(0,1) != 'y'){
		$('#date_value_from').val(tmpstr.substr(0,4)+'/'+tmpstr.substr(4,2)+'/'+tmpstr.substr(6,2));
		$('#time_value_from').val(tmpstr.substr(8,2)+':'+tmpstr.substr(10,2));
		$('#period1_from_time_value').css({'color':'blue', 'border':'solid 1px red'});
		$('#period2_from_time_value').css({'color':'black', 'border':'solid 1px black'});
		$('#period2_to_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_from_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_to_time_value').css({'color':'black', 'border':'solid 1px black'});
	}
	var tmpstr = $('#period1_to_time_value').val();
	if (tmpstr != '' && tmpstr.length == 12 && tmpstr.substr(0,1) != 'y'){
		$('#date_value_until').val(tmpstr.substr(0,4)+'/'+tmpstr.substr(4,2)+'/'+tmpstr.substr(6,2));
		$('#time_value_until').val(tmpstr.substr(8,2)+':'+tmpstr.substr(10,2));
		$('#period1_to_time_value').css({'color':'blue', 'border':'solid 1px red'});
		$('#period2_from_time_value').css({'color':'black', 'border':'solid 1px black'});
		$('#period2_to_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_from_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_to_time_value').css({'color':'black', 'border':'solid 1px black'});
	}
	$this.attr('checked', false);
	return;
      } else {
	return;
      }
    }
    if (wanted_id == "period2_checkbox") {
      if ($this.is(':checked')) {
	var tmpstr = $('#period2_from_time_value').val();
	if (tmpstr != '' && tmpstr.length == 12 && tmpstr.substr(0,1) != 'y'){
		$('#date_value_from').val(tmpstr.substr(0,4)+'/'+tmpstr.substr(4,2)+'/'+tmpstr.substr(6,2));
		$('#time_value_from').val(tmpstr.substr(8,2)+':'+tmpstr.substr(10,2));
		$('#period2_from_time_value').css({'color':'blue', 'border':'solid 1px red'});
		$('#period1_from_time_value').css({'color':'black', 'border':'solid 1px black'});
		$('#period1_to_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_from_time_value').css({'color':'black', 'border':'solid 1px black'});
 		$('#period3_to_time_value').css({'color':'black', 'border':'solid 1px black'});
	}
	var tmpstr = $('#period2_to_time_value').val();
	if (tmpstr != '' && tmpstr.length == 12 && tmpstr.substr(0,1) != 'y'){
		$('#date_value_until').val(tmpstr.substr(0,4)+'/'+tmpstr.substr(4,2)+'/'+tmpstr.substr(6,2));
		$('#time_value_until').val(tmpstr.substr(8,2)+':'+tmpstr.substr(10,2));
		$('#period2_to_time_value').css({'color':'blue', 'border':'solid 1px red'});
		$('#period1_from_time_value').css({'color':'black', 'border':'solid 1px black'});
		$('#period1_to_time_value').css({'color':'black', 'border':'solid 1px black'});
                $('#period3_from_time_value').css({'color':'black', 'border':'solid 1px black'});
                $('#period3_to_time_value').css({'color':'black', 'border':'solid 1px black'});
        }
        $this.attr('checked', false);
        return;
      } else {
        return;
      }
    }
    if (wanted_id == "prepend_checkbox") {    
	return;
    }
    if (wanted_id == "mindays_checkbox") {    
	return;
    }
    if (wanted_id == "real_time_checkbox") {    
	return;
    }
    if (wanted_id == "auto_scale") {    
	return;
    }
    if (wanted_id == "newheight") {    
      if ($this.is(':checked')) {
	newheight = 1;
	return;
      } else {
	newheight = 0;
	return;
      }
    }
    if (wanted_id == "newymax") {    
      if ($this.is(':checked')) {
	newymax = 1;
	return;
      } else {
	newymax = 0;
	return;
      }
    }
    if (wanted_id == "newwidth") {    
      if ($this.is(':checked')) {
	newwidth = 1;
	return;
      } else {
	newwidth = 0;
	return;
      }
    }
    if (wanted_id == "newfontsize") {    
      if ($this.is(':checked')) {
	newfontsize = 1;
	return;
      } else {
	newfontsize = 0;
	return;
      }
    }
    if (wanted_id == "lpartable_checkbox") {    
      if ($this.is(':checked')) {
	$(".lpar_checkboxes").show();
	return;
      } else {
	$(".lpar_checkboxes").hide();
	return;
      }
    }
    if (wanted_id == "mygraph_div") {    
      if ($this.is(':checked')) {
	$(".mygraph").show();
	return;
      } else {
	$(".mygraph").hide();
	return;
      }
    }
    if (wanted_id == "reflpartbl") {    
      if ($this.is(':checked')) {
	/* # fill chooseboxes */
	f_pseries_select(graphite_url, '#pseries');
	if ($("#topas_checkbox").is(':checked')) {
		/* init LPAR table */
		f_init_lpar_table_topas(graphite_url, '#lpar_choice_radio');  
	} else if ($("#con_checkbox").is(':checked')) {
                f_init_lpar_table_con(graphite_url, '#lpar_choice_radio');
        } else {
		/* init LPAR table */
		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	$this.attr('checked', false);
	return;
      } else {
	return;
      }
    }
    if (wanted_id == "cpuded_checkbox") {    
      if ($this.is(':checked')) {
	$(".t1cpuded").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t1cpuded").hide();
	return;
      }
    }
    if (wanted_id == "cpushr_checkbox") {    
      if ($this.is(':checked')) {
	$(".t2cpushr").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t2cpushr").hide();
	return;
      }
    }
    if (wanted_id == "memory_checkbox") {    
      if ($this.is(':checked')) {
	$(".t3mem").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t3mem").hide();
	return;
      }
    }
    if (wanted_id == "disk_checkbox") {    
      if ($this.is(':checked')) {
	$(".t4disk").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t4disk").hide();
	return;
      }
    }
    if (wanted_id == "adapter_checkbox") {    
      if ($this.is(':checked')) {
	$(".t5adapt").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t5adapt").hide();
	return;
      }
    }
    if (wanted_id == "network_checkbox") {    
      if ($this.is(':checked')) {
	$(".t6net").show();
  	topas = 0;
	$("#linux_checkbox").attr('checked', false);
	if ($("#topas_checkbox").is(':checked') || $("#con_checkbox").is(':checked')) {
		$("#topas_checkbox").attr('checked', false);
		$("#con_checkbox").attr('checked', false);
		f_pseries_select(graphite_url, '#pseries');
  		f_init_lpar_table(graphite_url, '#lpar_choice_radio');  
	}
	return;
      } else {
	$(".t6net").hide();
	return;
      }
    }
    if (wanted_id == "hideleft_checkbox") {    
      if ($this.is(':checked')) {
	$(".lpar_choice").hide();
	$(".newfontsize").hide();
	$(".newwidth").hide();
	$(".inject").hide();
	$(".lpar_checkboxes").hide();
	$(".fixed_time").hide();
	$(".lpartable").hide();
	$(".graphtype").hide();
	$(".mode").hide();
	$(".prepend").hide();
	$(".real_time").hide();
	$(".newheight").hide();
	$(".newymax").hide();
	$(".width_scale").hide();
	$(".mygraph").hide();
	$(".all_checkboxes").hide();
	$("#fill_value_box").hide();
	$("#nmon2graphite_form").css("width", "2%");
	$("#all_graphs").css("width", "96%");
	return;
      } else {
	$("#nmon2graphite_form").css("width", "43%");
	$("#all_graphs").css("width", "56%");
	$(".lpar_choice").show();
	$(".newfontsize").show();
	$(".newwidth").show();
	$(".inject").show();
	$(".lpar_checkboxes").show();
	$(".fixed_time").show();
	$(".lpartable").show();
	$(".graphtype").show();
	$(".mode").show();
	$(".prepend").show();
	$(".real_time").show();
	$(".newheight").show();
	$(".newymax").show();
	$(".width_scale").show();
	$(".mygraph").show();
	$(".all_checkboxes").show();
	$("#fill_value_box").show();
	return;
      }
    }
    if (wanted_id == "fill_checkbox") {    
      if ($this.is(':checked')) {
		var chlen = $("input:checkbox[name='lpar_choice_checkbox']:checked").length;

		$this.attr('checked', false);
		if ((chlen > 0) && ($("#fill_value").val() != '')){
			$("input:checkbox[name='lpar_choice_checkbox']:checked").each(function(){
				var lparstr = $(this).val();
				var scalebox = "#"+lparstr+"_scale";
				$(scalebox).val($("#fill_value").val());
			});
			return;
		} else {
			return;
		}
      } else {
		/*$("#fill_value").val("");*/
		return;
      }
    }
    if (wanted_id == "mygraph") {    
      if ($this.is(':checked')) {
	if ($("#mode_checkbox").prop("checked")) {
	  $this.attr('checked', false);
	}      
        var from_date_formated=$("#time_value_from").val()+"_"+$("#date_value_from").val().replace(/\//g,""); /* HH:MM_YYYYMMDD */
        var until_date_formated=$("#time_value_until").val()+"_"+$("#date_value_until").val().replace(/\//g,""); /* HH:MM_YYYYMMDD */
        /* var graph_string=$("#mygraph_box").val(); */
	var graph_string=$("#mygraph_box").attr('value');
        var sel_pseries=$("#pseries").val();
        var sel_lpar=$("#lpars").val();
        var repeatval=$("#repeat_box").val();
        var smtmodeval=$("#smtmode_box").val();
        graph_string = graph_string.replace(/"/g,"%22");
        graph_string = graph_string.replace(/ /g,"%20");
        graph_string = graph_string.replace(/PPPPP/g,sel_pseries);
        graph_string = graph_string.replace(/LLLLL/g,sel_lpar);
        graph_string = graph_string.replace(/RRRRR/g,repeatval);
        graph_string = graph_string.replace(/mmmmm/g,1/smtmodeval);
        graph_string = graph_string.replace(/MMMMM/g,  smtmodeval);
        if ($("#real_time_checkbox").prop("checked")) {
          graph_string = graph_string + "&noCache";
          graph_string = graph_string.replace(/\&until\=UUUUU/g,'');
          from_date_formated="-"+$('#time_value').val()+$('#time_unit').val();
        }
        if ($("#newfontsize").prop("checked")) {
          graph_string = graph_string + "&fontSize=" + $('#fontsize_box').val(); /* default fontSize=10 */
        }
        graph_string = graph_string.replace(/UUUUU/g,until_date_formated);
        graph_string = graph_string.replace(/SSSSS/g,from_date_formated);
        if ($("#real_time_checkbox").is(':checked')) {
		graph_string = graph_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~Now');
	} else {
		if (($("#mindays_checkbox").is(':checked')) && ($("#mindays_value").val() != '')) {
			var fromdate = from_date_formated.split("_");
			var untildate = until_date_formated.split("_");
			graph_string = graph_string.replace(/TTTTT/g, moment(fromdate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+fromdate[0]+'~'+moment(untildate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+untildate[0]);
		} else {
			graph_string = graph_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~'+until_date_formated.split("_").reverse().join("_"));
		}
	}
        if ($("#newheight").prop("checked")) {
            if ( graph_string.indexOf("height") >= 0 ) { /* -1 if no match */
		graph_string = graph_string.replace(/height=[0-9]+/g,"height="+$("#height_box").val());
	    } else {
		graph_string = graph_string + "&height=" + $('#height_box').val();
	    }
	}	    
        if ($("#newymax").prop("checked")) {
            if ( graph_string.indexOf("yMaxLeft=") >= 0 ) { /* -1 if no match */
		graph_string = graph_string.replace(/yMaxLeft=[0-9]+/g,"yMaxLeft="+$("#ymax_box").val());
	    } else if ( graph_string.indexOf("yMax=") >= 0 ) {
		graph_string = graph_string.replace(/yMax=[0-9]+/g,"yMax="+$("#ymax_box").val());
	    } else {
		graph_string = graph_string + "&yMax=" + $('#ymax_box').val();
	    }
	}	    
        if ($("#newwidth").prop("checked")) {
            if ( graph_string.indexOf("width") >= 0 ) { /* -1 if no match */
		graph_string = graph_string.replace(/width=[0-9]+/g,"width="+$("#nwidth_box").val());
	    } else {
		graph_string = graph_string + "&width=" + $('#nwidth_box').val();
	    }
	}	    
        /* # if fixed scale */	    
	if ($("#prepend_checkbox").is(':checked')) {
	  $("<div class='loadingicon'><img src='images/loading_"+Math.floor(Math.random()*57)+".gif' height=\"270\" /></div>").prependTo("#draw_graphs");
	} else {
	  $("<div class='loadingicon'><img src='images/loading_"+Math.floor(Math.random()*57)+".gif' height=\"270\" /></div>").appendTo("#draw_graphs");
	}
        graph_string_link = graph_string.replace(/width=[0-9]+/g,"width="+$("#width_box").val());
        f_add_graph(graphite_url,'#draw_graphs',graph_string,graph_string_link,'mygraph','#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', nmon_interval,'#real_time_checkbox', real_time_intervals, mode);

	/* # removing graph if checkbox uncheked */
      } else { /* Not mygraph checked */
	if ($("#mode_checkbox").prop("checked")) {/* single node mode => delete graph, multi-node mode => use deleteall */
	  /* uncheck checkbox ? */
	} else {
	  /* # remove all fixed img */
	  $(".href_mygraph").remove();
	}
      } /* end of $this.is(':checked') */
      return;
    } /* end of mygraph */
    
    wanted_id     = wanted_id.replace("checkbox_","");

    /* # $this will contain a reference to the checkbox */
    if ($this.is(':checked')) {
      if (wanted_class != "lpar_choice_checkbox") {    
	if ($("#prepend_checkbox").is(':checked')) {
	  $("<div class='loadingicon'><img src='images/loading_"+Math.floor(Math.random()*57)+".gif' height=\"270\" /></div>").prependTo("#draw_graphs");
	} else {
	  $("<div class='loadingicon'><img src='images/loading_"+Math.floor(Math.random()*57)+".gif' height=\"270\" /></div>").appendTo("#draw_graphs");
	}
      } else {
	return;
      }
      if ($("#mode_checkbox").prop("checked")) {
	$this.attr('checked', false);
	$('#' + wanted_id_org).next().css("font-weight", "bold");
      }

      /* # browse the graph file to find associated graphs url render */
      $.each(graphlistarray, function(index, value) { /* each graph */
          var array_line = value.split(':');

          /* if graph match graph_file */
          if ( array_line[0] == wanted_id ) {
            var from_date_formated=$("#time_value_from").val()+"_"+$("#date_value_from").val().replace(/\//g,""); /* HH:MM_YYYYMMDD */
            var until_date_formated=$("#time_value_until").val()+"_"+$("#date_value_until").val().replace(/\//g,""); /* HH:MM_YYYYMMDD */
	    var graph_string=array_line[2];
            var sel_pseries=$("#pseries").val();
            var sel_lpar=$("#lpars").val();
	    var repeatval=$("#repeat_box").val();
	    var smtmodeval=$("#smtmode_box").val();

	    if ( wanted_id == "t1cpuded_pcpu_total_server_new__" ) {
		var dedlpars="";
		var shrlpars="";

		$.ajaxSetup({
			async: false
		 });
		$.getJSON("http://"+graphite_url+"/metrics/find?query=nmon."+sel_pseries+".*",null,function(lpars_result) {
			$.each(lpars_result, function(i, item){
				var lpar_values = lpars_result[i].id.split(".");
				$.getJSON("http://"+graphite_url+"/metrics/find?query=nmon."+sel_pseries+"."+lpar_values[2]+".lpar.physicalcpu",null,function(retvalues) {
					if (retvalues.length == 0) {
						if (dedlpars.length == 0) {
                        				dedlpars = lpar_values[2];
						} else {
                        				dedlpars = dedlpars + "," + lpar_values[2];
						}
					} else {
                        			if (shrlpars.length == 0) {
							shrlpars = lpar_values[2];
						} else {
							shrlpars = shrlpars + "," + lpar_values[2];
						}
					}
				});
			});
		});
		$.ajaxSetup({
			async: true
		 });
            	graph_string = graph_string.replace(/dedlpars/, dedlpars).replace(/shrlpars/, shrlpars);
	    }

	    $("#mygraph_box").attr('value', graph_string);
            graph_string = graph_string.replace(/"/g,"%22");
            graph_string = graph_string.replace(/ /g,"%20");
            graph_string = graph_string.replace(/PPPPP/g,sel_pseries);
            graph_string = graph_string.replace(/LLLLL/g,sel_lpar);
	    graph_string = graph_string.replace(/RRRRR/g,repeatval);
	    graph_string = graph_string.replace(/mmmmm/g,1/smtmodeval);
	    graph_string = graph_string.replace(/MMMMM/g,  smtmodeval);
            if ($("#real_time_checkbox").prop("checked")) {
              graph_string = graph_string + "&noCache";
              graph_string = graph_string.replace(/\&until\=UUUUU/g,'');
              from_date_formated="-"+$('#time_value').val()+$('#time_unit').val();
            }
            if ($("#newfontsize").prop("checked")) {
              graph_string = graph_string + "&fontSize=" + $('#fontsize_box').val(); /* default fontSize=10 */
            }
            graph_string = graph_string.replace(/UUUUU/g,until_date_formated);
            graph_string = graph_string.replace(/SSSSS/g,from_date_formated);
	    if ($("#real_time_checkbox").is(':checked')) {
		graph_string = graph_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~Now');
	    } else {
                if (($("#mindays_checkbox").is(':checked')) && ($("#mindays_value").val() != '')) {
                        var fromdate = from_date_formated.split("_");
                        var untildate = until_date_formated.split("_");
			graph_string = graph_string.replace(/TTTTT/g, moment(fromdate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+fromdate[0]+'~'+moment(untildate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+untildate[0]);
                } else {
                        graph_string = graph_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~'+until_date_formated.split("_").reverse().join("_"));
                }
	    }
	    if ($("#newheight").prop("checked")) {
		if ( graph_string.indexOf("height") >= 0 ) { /* -1 if no match */
			graph_string = graph_string.replace(/height=[0-9]+/g,"height="+$("#height_box").val());
		} else {
			graph_string = graph_string + "&height=" + $('#height_box').val();
		}
	    }	    
	    if ($("#newymax").prop("checked")) {
		if ( graph_string.indexOf("yMaxLeft=") >= 0 ) { /* -1 if no match */
			graph_string = graph_string.replace(/yMaxLeft=[0-9]+/g,"yMaxLeft="+$("#ymax_box").val());
		} else if ( graph_string.indexOf("yMax=") >= 0 ) { /* -1 if no match */
                        graph_string = graph_string.replace(/yMax=[0-9]+/g,"yMax="+$("#ymax_box").val());
                } else {
			graph_string = graph_string + "&yMax=" + $('#ymax_box').val();
		}
	    }	    
	    if ($("#newwidth").prop("checked")) {
		if ( graph_string.indexOf("width") >= 0 ) { /* -1 if no match */
			graph_string = graph_string.replace(/width=[0-9]+/g,"width="+$("#nwidth_box").val());
		} else {
			graph_string = graph_string + "&width=" + $('#nwidth_box').val();
		}
	    }	    
            /* # if fixed scale */	    
            graph_string_link = graph_string.replace(/width=[0-9]+/g,"width="+$("#width_box").val());
	    
            /* # if multiple graphs */
            if ( array_line[0].indexOf("_newtop_") >= 0 ) { /* -1 if no match */
              json_string = array_line[3];
              json_string = json_string.replace(/"/g,"%22");
              json_string = json_string.replace(/ /g,"%20");
              json_string = json_string.replace(/PPPPP/g,sel_pseries);
              json_string = json_string.replace(/LLLLL/g,sel_lpar);
              json_string = json_string.replace(/UUUUU/g,until_date_formated);
              json_string = json_string.replace(/SSSSS/g,from_date_formated);
	      if ($("#real_time_checkbox").is(':checked')) {
		json_string = json_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~Now');
	      } else {
                if (($("#mindays_checkbox").is(':checked')) && ($("#mindays_value").val() != '')) {
                        var fromdate = from_date_formated.split("_");
                        var untildate = until_date_formated.split("_");
                        json_string = json_string.replace(/TTTTT/g, moment(fromdate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+fromdate[0]+'~'+moment(untildate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+untildate[0]);
                } else {
                        json_string = json_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~'+until_date_formated.split("_").reverse().join("_"));
                }
	      }
	      var my_disks;
	      var firstmember = 1;
	      $.ajaxSetup({
		async: false
	      });
              $.getJSON("http://"+graphite_url+"/render?"+json_string,null,function(cust_result){
                $.each(cust_result, function(i, item) {
		  if (firstmember == 1) {
			my_disks = cust_result[i].target;
			firstmember = 0;
		  } else {
			my_disks = my_disks + "," + cust_result[i].target;
		  }
                });
              });

              var new_buffer_string      = graph_string;
              var new_buffer_string_link = graph_string;

              new_buffer_string          = new_buffer_string.replace(/ZZZZZ/g,my_disks); /* diskbusy* */
              new_buffer_string_link     = new_buffer_string.replace(/width=[0-9]+/g,"width="+$("#width_box").val());
	      f_add_graph(graphite_url,'#draw_graphs',new_buffer_string,new_buffer_string_link,wanted_id,'#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', nmon_interval,'#real_time_checkbox', real_time_intervals, mode);
	      $("#mygraph_box").attr('value', new_buffer_string);
	      $.ajaxSetup({
		async: true
	      });
	      return;
            }
            if ( array_line[0].indexOf("_newtoplist_") >= 0 ) { /* -1 if no match */
              json_string = array_line[3];
              json_string = json_string.replace(/"/g,"%22");
              json_string = json_string.replace(/ /g,"%20");
              json_string = json_string.replace(/PPPPP/g,sel_pseries);
              json_string = json_string.replace(/LLLLL/g,sel_lpar);
              json_string = json_string.replace(/UUUUU/g,until_date_formated);
              json_string = json_string.replace(/SSSSS/g,from_date_formated);
	      if ($("#real_time_checkbox").is(':checked')) {
		json_string = json_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~Now');
	      } else {
                if (($("#mindays_checkbox").is(':checked')) && ($("#mindays_value").val() != '')) {
                        var fromdate = from_date_formated.split("_");
                        var untildate = until_date_formated.split("_");
                        json_string = json_string.replace(/TTTTT/g, moment(fromdate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+fromdate[0]+'~'+moment(untildate[1], 'YYYYMMDD').subtract($("#mindays_value").val(), 'days').format('YYYYMMDD')+"_"+untildate[0]);
                } else {
                        json_string = json_string.replace(/TTTTT/g,from_date_formated.split("_").reverse().join("_")+'~'+until_date_formated.split("_").reverse().join("_"));
                }
	      }
	      var firstmember = 1;
              var target_template = graph_string;
              var target_string;
	      var cur_target;
	
              target_template = target_template.replace(/&height.*/g, "");

	      $.ajaxSetup({
		async: false
	      });
              $.getJSON("http://"+graphite_url+"/render?"+json_string,null,function(cust_result){
                $.each(cust_result, function(i, item) {
		  cur_target = target_template;
		  cur_target = cur_target.replace(/ZZZZZ/g, cust_result[i].target);
		  if (firstmember == 1) {
			firstmember = 0;
			target_string = cur_target;
		  } else {
			target_string = target_string + "&" + cur_target;
		  }
                });
              });

              var new_buffer_string      = graph_string;
              var new_buffer_string_link = graph_string;

              new_buffer_string = new_buffer_string.replace(/target=.*&height/g, target_string+"&height");
              new_buffer_string_link     = new_buffer_string.replace(/width=[0-9]+/g,"width="+$("#width_box").val());
	      f_add_graph(graphite_url,'#draw_graphs',new_buffer_string,new_buffer_string_link,wanted_id,'#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', nmon_interval,'#real_time_checkbox', real_time_intervals, mode);
	      $("#mygraph_box").attr('value', new_buffer_string);
	      $.ajaxSetup({
		async: true
	      });
	      return;
            }
            /* if single graph */
            f_add_graph(graphite_url,'#draw_graphs',graph_string,graph_string_link,wanted_id,'#date_value_from', '#time_value_from', '#date_value_until', '#time_value_until', nmon_interval,'#real_time_checkbox', real_time_intervals, mode);
          } /* end of "graph match graph_file" */
        }); /* end of $.each(array, function(index, value) {}) */
    /* # removing graph if checkbox uncheked */
    } else { /* Not $this.is(':checked') */
      $(".loadingicon").remove();
      if ($("#mode_checkbox").prop("checked")) { /* single node mode => delete graph, multi-node mode => use deleteall */
	/* uncheck checkbox ? */
      } else {
	/* # remove all fixed img */
	/* $(".img_"+wanted_id).remove(); */
	$("img[class*="+wanted_id+"]").remove(); /* class which contains wanted_id */
      }
    } /* end of $this.is(':checked') */
  }); /* $('#nmon2graphite_form :checkbox').click(function() {}) */
}); /* $(document).ready(function (){}) */
