
//test
	var tbodyContent="";
  var tDelayContent = "";

	var ajax = function(options, callback) {
	  var xhr;
	  xhr = new XMLHttpRequest();
	  xhr.open(options.type, options.url, options.async || true);

	  xhr.onreadystatechange = function() {
	    if (xhr.readyState === 4) {
	      return callback(xhr.responseText,options.url);
	    }
	  };
	  return xhr.send();
	};


	function callNaverDatalab(v){
		console.log(v);
		$.ajax({
        url: "https://owops0uaq6.execute-api.us-west-2.amazonaws.com/prod",
        type: 'POST',
        data: JSON.stringify({startDate:FROM_TO_MONTH["startDate"],endDate:FROM_TO_MONTH["endDate"],queryGroups:v+"__SZLIG__"+v}),
        contentType: 'application/json',
        success: function(data) {

          console.log(data);
					drawDatalabChart(v,data)


        },
        error: function(e){
          //alert('error');
          console.log(e);


        }
    });
	}

	var cors_url = "https://cors-anywhere-esko.herokuapp.com/";
	var getTargetURL = function(target,query,date, method){

		if (method=="cafe"){
    	var naver_url = "https://search.naver.com/search.naver?sm=mtb_pcv&where=article&ie=utf8&st=rel&date_option=6&board=&srchby=text&dup_remove=1&cafe_url=&without_cafe_url=";
		}
		else if (method=="blog"){
			var naver_url = "https://search.naver.com/search.naver?sm=mtb_pcv&where=post&query=&ie=utf8&st=rel&date_from=&date_to=&date_option=8&srchby=all&dup_remove=1&post_blogurl="
		}

		if(target=='NAVER'){
      var target_url = naver_url;
      target_url+="&query="+encodeURIComponent(query);
      target_url+="&date_from="+date.from.replace(/-/gi,".");
      target_url+="&date_to="+date.to.replace(/-/gi,".");
      //%EC%B2%AD%EC%86%8C%EA%B8%B0%20%EA%B0%80%EC%9D%B4%ED%83%80%EC%9D%B4%EB%84%88
      //&date_from=2017.01.01&date_to=2017.06.05

			return cors_url+target_url;
		}
	}

	$('#search').on('click',function(){
		resetSearch();
		var keywords = $('#searchArea').val().split('\n');
		$.each(keywords,function(i,v){

			if(v!=""){
				console.log(v);
				var div_relative = '<div class="relative_keywords tagcloud01" style="width:100%;margin: 0 auto;"><ul  id="rel_'+v.replace(/ /gi,"_")+'"></ul></div>';
				var url = getTargetURL("NAVER",v,{from:"",to:""}, "cafe");
				callTargetUrlForRelative("NAVER",url,v,{from:"",to:""},{});


				var div_table = '<div id="table_'+v.replace(/ /gi,"_")+'" style="width:80%;margin: 0 auto;"></div>';
				var div = '<div id="echart_line_'+v.replace(/ /gi,"_")+'" style="height:300px;"></div>';
				var div_words = '<div id="div_words_cafe'+v.replace(/ /gi,"_")+'" style="width: 80%;margin: 0 auto;line-height: 0.3;"></div>';

				var div_table2 = '<div id="table_2'+v.replace(/ /gi,"_")+'" style="width:80%;margin: 0 auto;"></div>';
				var div2 = '<div id="echart_line_2'+v.replace(/ /gi,"_")+'" style="height:300px;"></div>';
				var div_words2 = '<div id="div_words_blog'+v.replace(/ /gi,"_")+'" style="width: 80%;margin: 0 auto;line-height: 0.3;"></div>';

				var div3 = '<div id="echart_line_3'+v.replace(/ /gi,"_")+'" style="height:300px;"></div>';
				var div_button = '<div id="button_3'+v.replace(/ /gi,"_")+'" style="height:50px;"></div>';


				var total_div = "<div class='each_div'>"+div_relative+div+div_table+div_words+ div2 + div_table2 + div_words2+div3+div_button+"</div>";

				$('#every-here').append(total_div);


				var NAVER_RESULT = {};
				var NAVER_RESULT2 = {};
        $(DATES).each(function(inx,date){
          getPeriod(date,v,NAVER_RESULT, "cafe");
					getPeriod(date,v,NAVER_RESULT2, "blog");
        })

				callNaverDatalab(v);


			}
		});
	})

  var DATES = [];
	var FROM_TO_MONTH = {
		startDate : "",
		endDate : ""
	}

	function generateFromToMonth(){
    var today = new Date();
    var current_year = today.getFullYear();
    var current_month = (today.getMonth()+1<10?"0"+(today.getMonth()+1):today.getMonth()+1);

		FROM_TO_MONTH["startDate"] = ((current_year-2)==2015?2016:(current_year-2))+"01";
		FROM_TO_MONTH["endDate"] = current_year+current_month;


  }

  function generateTargetDates(){
    var today = new Date();
    var current_year = today.getFullYear();
    // var current_year_1 = current_year-1;
    // var current_year_2 = current_year-2;

    var current_month = (today.getMonth()+1<10?"0"+(today.getMonth()+1):today.getMonth()+1);
    var current_date = (today.getDate()<10?"0"+(today.getDate()):today.getDate());


    for(var i=0;i<3;i++){
      var obj = {
        to : (current_year-i)+"-"+current_month+"-"+current_date ,
        from : (current_year-i)+"-01-01"
      }
			if(i!=0){
				obj["to"] = (current_year-i)+"-12-31"
			}

      DATES.push(obj);
    }



  }

  var END_OF_MONTH = [
    "01-31","02-28","03-31","04-30","05-31","06-30","07-31","08-31","09-30","10-31","11-30","12-31"
  ]


  function getPeriod(date,v,NAVER_RESULT, target){

    var year = new Date(date.to).getFullYear();
    var endMonth = new Date(date.to).getMonth();
    var date = new Date(date.to).getDate();


    var obj = {}
    for(var i=0;i<=endMonth;i++){
      var start = year+"-"+(i+1<10?"0"+(i+1):i+1)+"-01";
      var end = year+"-"+END_OF_MONTH[i];


			//obj[(i+1<10?"0"+(i+1):i+1)] = "-";
			obj[(i+1)+"월"] = "-";

      if(i==endMonth){
        end = year+"-"+(i+1<10?"0"+(i+1):i+1)+"-"+(date<10?"0"+(date):date);
        NAVER_RESULT[year] = obj;
      }
      var url = getTargetURL("NAVER",v,{from:start,to:end},target);
      callTargetUrl("NAVER",url,v,{from:start,to:end},NAVER_RESULT,target);
    }
  }

  generateTargetDates();
	generateFromToMonth();
	var search = {};
	var idcount = 0;
	var resetSearch = function(){


		$('#every-here').html('');
	}

	var callTargetUrlForRelative = function(target,url,v, date,naver_result){
    ajax({type:"GET", url:url},function(result,_url){
			//#nx_related_keywords > dl > dd.lst_relate
			//default 검색 결과는 일단 카페로 디스플레이.
			var rel_head = $(result).find('#nx_related_keywords>dl>dd.lst_relate>ul>li>a');

			$('#rel_'+v.replace(/ /gi,"_")).html("");

			$(rel_head).each(function(inx,rel){


				var atag = "<a href='https://search.naver.com/search.naver?where=article&query="+$(this).text()+"' target='_blank'># "+$(this).text()+"</a>";
				$('#rel_'+v.replace(/ /gi,"_")).append("<li>"+atag+"</li>");
			})
			return;
		})
	}

  var callTargetUrl = function(target,url,v, date,naver_result, target){
    ajax({type:"GET", url:url},function(result,_url){
      var year = new Date(date.from).getFullYear();
      var month = new Date(date.from).getMonth()+1;
			month = month+"월";
			var section_head;
			var rel_head = $(result).find('#nx_related_keywords > dl > dd.lst_relate > ul > li:nth-child(1) > a').text().trim();

			if (target=="cafe"){
				section_head = $(result).find('#_cafe_section>div>span.title_num').text().trim();
			}
			else if (target=="blog"){
			 	section_head = $(result).find('#main_pack>div.blog.section._blogBase>div>span.title_num').text().trim();
			}


			if(section_head.split("/").length>=2){
				section_head = section_head.split("/")[1].trim().replace("건","").replace(/,/gi,"");
			}

      naver_result[year][month]  = section_head+"^"+_url.replace(cors_url,"");


			if(JSON.stringify(naver_result).indexOf('-')<0){

				var legend = Object.keys(naver_result);
				var xaxis = Object.keys(naver_result[legend[0]]);
				var series = [];



				$(legend).each(function(inx,l){
					var datas = [];
					$(naver_result[l]).each(function(jnx,nr){

						for(var key in nr){

							var _nr = (nr[key].split("^").length>0?nr[key].split("^")[0]:"");
							datas.push(_nr);
						}


					})
					var obj = {
						name: l,
						type: 'line',
						smooth: true,

						data: datas//Object.values(naver_result[l])
					}
					if(inx!=legend.length-1){
						obj["itemStyle"] = {
																	normal: {
																		areaStyle: {
																			type: 'default'
																		}
																	}
																};

					}
					series.push(obj);
				})

			}

			drawTable(v,naver_result,target);
			drawLineChart(v,legend,xaxis,series,target)

    })
  }
	function onThumbnailLoad(){
		return;
	}
	function onThumbnailError(){
		return;
	}
	function recursiveCallPage(target,v,url,word_count, total_page_count,page_count){

		var callurl = url+"&start="+page_count;

		ajax({type:"GET", url:cors_url+callurl},function(result,_url){

			WORD_COUNT_PROCESS[target+"^"+v][page_count]=true;

			var count = Number($('#loading_'+target+v.replace(/ /gi,"_")).text())+1;
			$('#loading_'+target+v.replace(/ /gi,"_")).html(count);
			var texts = ""

			if(target=="cafe"){
				texts = $(result).find('dd.sh_cafe_passage').text().split(" ");
			}else{
				texts = $(result).find('dd.sh_blog_passage').text().split(" ");

			}


			$(texts).each(function(inx, text){
				if(word_count[text]){
					word_count[text]++;
				}else{
					word_count[text] = 1;
				}
			})

			if(JSON.stringify(WORD_COUNT_PROCESS[target+"^"+v]).indexOf("false")<0){
				drawWordCountTable(target,v,word_count);
			}
			// if(page_count<total_page_count){
			// 	recursiveCallPage(target,v,url,word_count,total_page_count,page_count+1);
			// }else{
			// 	drawWordCountTable(target,v,word_count);
			// }
		})
	}
	var CLIP_BOARD_DATA = {};
	function drawWordCountTable(target,v,word_count){
		var html = "<table id='datatable_"+target+v.replace(/ /gi,"_")+"'>"
							+"<thead><th>키워드</th><th>횟수</th></thead>"
							+"<tbody>"

		for(var key in word_count){
			html+="<tr><td>"+key+"</td><td>"+word_count[key]+"</td>"
		}

		html+="</tbody>"
					+"</table>"

		$('#div_words_'+target+v.replace(/ /gi,"_")).html(html);
		$('#datatable_'+target+v.replace(/ /gi,"_")).DataTable({
			"order": [[ 1, "desc" ]]
		});

		CLIP_BOARD_DATA[target+"^"+v.replace(/ /gi,"_")]= word_count;

		var copy_clipboard_btn = "<button type='button' class='btn btn-xs' style='    color: silver;border: 1px solid silver;background-color: white;' onclick=copyClipboard('"+target+"^"+v.replace(/ /gi,"_")+"','"+target+"') ><i class='glyphicon glyphicon-save'></i>Copy Clipboard</button>"
		$('#div_words_'+target+v.replace(/ /gi,"_")).append(copy_clipboard_btn)
	}

	function copyClipboard(key,target){
		var word_count = CLIP_BOARD_DATA[key];
		var clipboard_text = "";
		for(var word in word_count){
			clipboard_text+=word+"^"+word_count[word]+"\n";
		}


		var fakeElem = document.body.appendChild(document.createElement('textarea'));
	  fakeElem.style.position = 'absolute';
	  fakeElem.style.left = '100px';
	  fakeElem.setAttribute('readonly', '');
	  fakeElem.value = clipboard_text;
	  fakeElem.select();

		try {
	    document.execCommand('copy');
			alert("복사 되었습니다. 엑셀/메모장 등에 붙여넣기 하세요.");
	  } catch (err) {

			console.log("복사 실패");
	  } finally {
	    fakeElem.parentNode.removeChild(fakeElem);
	  }

		//
		// var copyFrom = document.createElement("textarea");
		// copyFrom.setAttribute("id",'clipboard-id-'+target)
		//
		// copyFrom.textContent = clipboard_text;
		// var body = document.getElementsByTagName('body')[0];
		// body.appendChild(copyFrom);
		// copyFrom.select();
		// var result;
		// if(target=="cafe"){
		// 	result = document.execCommand('copy');
		// }else if(target=="blog"){
		// 	result = document.execCommand('cut');
		// }
		//
		// console.log(result);
		// body.removeChild(copyFrom);
		//
		// alert("복사 되었습니다. 엑셀/메모장 등에 붙여넣기 하세요.");

	}

	var WORD_COUNT_PROCESS = {};
	function getWordCounts(param,target,key,index){
		var url = param.url;
		var v = param.v;
		var word_count = {};
		$('#div_words_'+target+v.replace(/ /gi,"_")).html("");
		$('#div_words_'+target+v.replace(/ /gi,"_")).animate({
			height:340
		})


		ajax({type:"GET", url:cors_url+url},function(result,_url){

			var section_head;

			if (target=="cafe"){
				section_head = $(result).find('#_cafe_section>div>span.title_num').text().trim();
			}
			else if (target=="blog"){
				section_head = $(result).find('#main_pack>div.blog.section._blogBase>div>span.title_num').text().trim();
			}

			if(section_head.split("/").length>=2){
				section_head = section_head.split("/")[1].trim().replace("건","").replace(/,/gi,"");
			}

			var loading_msg = "<div class='loading-div'>"+key+"년 "+index+"월 Data 수집중.. <span id='loading_"+target+v.replace(/ /gi,"_")+"'>0</span> / <span>"+Math.ceil(Number(section_head)/10)+"</span></div>"
			$('#div_words_'+target+v.replace(/ /gi,"_")).html(loading_msg);

			var pages = Number(section_head)/10;
			WORD_COUNT_PROCESS[target+"^"+v] = {}
			for(var inx=1;inx<=pages;inx++){
				WORD_COUNT_PROCESS[target+"^"+v][inx]=false;
				recursiveCallPage(target,v,url,word_count,pages,inx);
			}

		});
	}



	function drawTable(v,result,target){

		var keys = Object.keys(result).sort(); 
		var trs = "";
		$(keys).each(function(inx,key){
			var tr = "<tr><th>"+key+"</th>";

			//var values = Object.values(result[key]);

			var values = Object.keys(result[key]).map(function(_k) {
			    return result[key][_k];
			});

			$(values).each(function(inx,value){

				var _vs = value.split("^");
				var _param = {
					url : _vs[1],
					v : v.replace(/ /gi,"_")
				}
				tr+="<td><a href='"+_vs[1]+"' target='_blank'>"+_vs[0]+"</a>&nbsp;<button type='button' class='btn btn-xs' style='    color: silver;border: 1px solid silver;background-color: white;' onclick=getWordCounts("+JSON.stringify(_param)+",'"+target +"','"+key +"','"+(inx+1) +"') ><i class='glyphicon glyphicon-list'></i></button></td>"

				if(inx==values.length-1){
					var margin = 12-inx;

					for(var jnx=1;jnx<margin;jnx++){
						tr+="<td>-</td>"
					}
				}

			});
			tr +="</tr>"
			trs+=tr;
		})

		var html = "<table class='table'>"
									+"<thead>"
										+"<th></th>"
										+"<th>1월</th>"
										+"<th>2월</th>"
										+"<th>3월</th>"
										+"<th>4월</th>"
										+"<th>5월</th>"
										+"<th>6월</th>"
										+"<th>7월</th>"
										+"<th>8월</th>"
										+"<th>9월</th>"
										+"<th>10월</th>"
										+"<th>11월</th>"
										+"<th>12월</th>"
									+"</thead>"
									+"<tbody>"
										+trs
									+"</tbody>"

								+"</table>";
				if ( target=="cafe"){
					$('#table_'+v.replace(/ /gi,"_")).html(html);
				}else if (target=="blog"){
					$('#table_2'+v.replace(/ /gi,"_")).html(html);
				}

	}
	function drawLineChart(v,legend,xaxis,series,target){


		var koreanmethod = "";
		var echartLine;
		if (target=="cafe"){
			echartLine = echarts.init(document.getElementById('echart_line_'+v.replace(/ /gi,"_")), theme);
			koreanmethod = "카페";
		}
		if (target=="blog"){
			echartLine = echarts.init(document.getElementById('echart_line_2'+v.replace(/ /gi,"_")), theme);
			koreanmethod = "블로그"
		}

		echartLine.setOption({
			title: {
				text: koreanmethod +" 내 검색결과 : " + v,
				subtext: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				x: 220,
				y: 40,
				data:legend
			},
			toolbox: {
				show: true,
				feature: {
					magicType: {
						show: true,
						title: {
							line: 'Line',
							bar: 'Bar',
							stack: 'Stack',
							tiled: 'Tiled'
						},
						type: ['line', 'bar', 'stack', 'tiled']
					},
					restore: {
						show: true,
						title: "Restore"
					},
					saveAsImage: {
						show: true,
						title: "Save Image"
					}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: xaxis
			}],
			yAxis: [{
				type: 'value'
			}],
			series: series
		});
	}

	var callDelivery = function(title, url,del_no){

		drawResultArea(title,url,del_no);
		ajax({type:"GET", url:url},function(result){
			//result = result.replace(/<img/gi,'<div');


			if(title=="한진택배"){
				hanjinParser(title,url, result,del_no);
			}else if(title=="대한통운"||title=="CJ_GLS"){
				cjParser(title,url, result,del_no);
			}else{
				lotteParser(title,url, result,del_no);
			}

		})
	}



	function copyTextToClipboard() {


		var copyFrom = document.createElement("textarea");
		copyFrom.setAttribute("id",'clipboard-id')

		copyFrom.textContent = tbodyContent;
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(copyFrom);
		copyFrom.select();
		document.execCommand('copy');
		body.removeChild(copyFrom);

		//alert("복사 되었습니다. 엑셀/메모장 등에 붙여넣기 하세요.")
		showMessageTemporary();
	}
	function copyDelayTextToClipboard() {


		var copyFrom = document.createElement("textarea");
		copyFrom.setAttribute("id",'clipboard-id')

		copyFrom.textContent = tDelayContent;

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(copyFrom);
		copyFrom.select();
		document.execCommand('copy');
		body.removeChild(copyFrom);

		//alert("복사 되었습니다. 엑셀/메모장 등에 붙여넣기 하세요.")
		showMessageTemporary();
	}

	function showMessageTemporary(){
		$('#info').show();
		setTimeout(function(){
			$('#info').hide();
		},3000)
	}

	$('#copy').on('click',function(){

		copyTextToClipboard();
	});

	$('#copy-delay').on('click',function(){

		copyDelayTextToClipboard();
	});


function realDrawChart(v,legend,xaxis,series,hashKey){


 var go_naver_btn = "<button type='button' class='btn btn-xs' style='color: silver;border: 1px solid silver;background-color: white;'><a href='http://datalab.naver.com/keyword/trendResult.naver?hashKey="+hashKey+"' target='_blank'>DATALAB 가기</a></button>"
	console.log(go_naver_btn)
	$('#button_3'+v.replace(/ /gi,"_")).append(go_naver_btn);
	var echartLine = echarts.init(document.getElementById('echart_line_3'+v.replace(/ /gi,"_")), theme);
  echartLine.setOption({
    title: {
      text: "Naver 데이타랩 결과",
      subtext: "http://datalab.naver.com/keyword/trendResult.naver?hashKey="+hashKey
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      x: 220,
      y: 40,
      data:legend
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          show: true,
          title: {
            line: 'Line',
            bar: 'Bar',
            stack: 'Stack',
            tiled: 'Tiled'
          },
          type: ['line', 'bar', 'stack', 'tiled']
        },
        restore: {
          show: true,
          title: "Restore"
        },
        saveAsImage: {
          show: true,
          title: "Save Image"
        }
      }
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: xaxis
    }],
    yAxis: [{
      type: 'value'
    }],
    series: series
  });
}
function drawDatalabChart(v,dummy){

  var legend=[],xaxis=[],series=[]
  var datas = [], datas2 = [];
  var layered = [];

  legend.push("결과");
  $(dummy.result).each(function(inx, d){

		xaxis.push(d.period);
		datas.push(d.value);

    if(inx==dummy.result.length-1){
      var obj = {
        name: "DataLab",
        type: 'line',
        smooth: true,
        data: datas, //Object.values(naver_result[l])
				itemStyle:{
                    normal: {
                      areaStyle: {
                        type: 'default'
                      }
                    }
                  }
      }
      series.push(obj);
      realDrawChart(v,legend,xaxis,series,dummy.hashKey);
    }
  })

}


	var theme = {
			color: [
					'#26B99A', '#34495E', '#d95f5f', '#3498DB',
					'#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
			],

			title: {
					itemGap: 8,
					textStyle: {
							fontWeight: 'normal',
							color: '#373723'
					}
			},

			dataRange: {
					color: ['#1f610a', '#97b58d']
			},

			toolbox: {
					color: ['#373723', '#373723', '#373723', '#373723']
			},

			tooltip: {
					backgroundColor: 'rgba(0,0,0,0.5)',
					axisPointer: {
							type: 'line',
							lineStyle: {
									color: '#373723',
									type: 'dashed'
							},
							crossStyle: {
									color: '#373723'
							},
							shadowStyle: {
									color: 'rgba(200,200,200,0.3)'
							}
					}
			},

			dataZoom: {
					dataBackgroundColor: '#eee',
					fillerColor: 'rgba(64,136,41,0.2)',
					handleColor: '#373723'
			},
			grid: {
					borderWidth: 0
			},

			categoryAxis: {
					axisLine: {
							lineStyle: {
									color: '#373723'
							}
					},
					splitLine: {
							lineStyle: {
									color: ['#eee']
							}
					}
			},

			valueAxis: {
					axisLine: {
							lineStyle: {
									color: '#373723'
							}
					},
					splitArea: {
							show: true,
							areaStyle: {
									color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
							}
					},
					splitLine: {
							lineStyle: {
									color: ['#eee']
							}
					}
			},
			timeline: {
					lineStyle: {
							color: '#373723'
					},
					controlStyle: {
							normal: {color: '#373723'},
							emphasis: {color: '#373723'}
					}
			},

			k: {
					itemStyle: {
							normal: {
									color: '#68a54a',
									color0: '#a9cba2',
									lineStyle: {
											width: 1,
											color: '#373723',
											color0: '#86b379'
									}
							}
					}
			},
			map: {
					itemStyle: {
							normal: {
									areaStyle: {
											color: '#ddd'
									},
									label: {
											textStyle: {
													color: '#c12e34'
											}
									}
							},
							emphasis: {
									areaStyle: {
											color: '#99d2dd'
									},
									label: {
											textStyle: {
													color: '#c12e34'
											}
									}
							}
					}
			},
			force: {
					itemStyle: {
							normal: {
									linkStyle: {
											strokeColor: '#373723'
									}
							}
					}
			},
			chord: {
					padding: 4,
					itemStyle: {
							normal: {
									lineStyle: {
											width: 1,
											color: 'rgba(128, 128, 128, 0.5)'
									},
									chordStyle: {
											lineStyle: {
													width: 1,
													color: 'rgba(128, 128, 128, 0.5)'
											}
									}
							},
							emphasis: {
									lineStyle: {
											width: 1,
											color: 'rgba(128, 128, 128, 0.5)'
									},
									chordStyle: {
											lineStyle: {
													width: 1,
													color: 'rgba(128, 128, 128, 0.5)'
											}
									}
							}
					}
			},
			gauge: {
					startAngle: 225,
					endAngle: -45,
					axisLine: {
							show: true,
							lineStyle: {
									color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#373723']],
									width: 8
							}
					},
					axisTick: {
							splitNumber: 10,
							length: 12,
							lineStyle: {
									color: 'auto'
							}
					},
					axisLabel: {
							textStyle: {
									color: 'auto'
							}
					},
					splitLine: {
							length: 18,
							lineStyle: {
									color: 'auto'
							}
					},
					pointer: {
							length: '90%',
							color: 'auto'
					},
					title: {
							textStyle: {
									color: '#333'
							}
					},
					detail: {
							textStyle: {
									color: 'auto'
							}
					}
			},
			textStyle: {
					fontFamily: 'Arial, Verdana, sans-serif'
			}
	};
