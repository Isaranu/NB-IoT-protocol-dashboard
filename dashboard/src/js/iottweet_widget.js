var chart = [], gauge = [], labelValue = [], mixedChart = [];
var _numChart = 0, _numGauge = 0, _numLabelValue = 0, _numMixedChart = 0;
var spawnChartCanvas = [], spawnGaugeCanvas = [], spawnLabelValue = [], spawnMixedChartCanvas = [];
var currentChartSpawned, currentGaugeSpawned, currentLabelValueSpawned, currentMixedChartSpawned;
var chart_position = [], gauge_position = [], labelvalue_position = [], mixedChart_position = [];

var target_spawn_div;
var buff_div = [], mixedChart_buff_div = [];

var born_pos_left = 0, born_pos_top = 0;
var pos_left_offset = 10, pos_top_offset = 10;

var pos_label = [], gauge_pos_label = [], labelValue_pos_label = [], mixedChart_pos_label = [];
var currentPos_left = [], currentPos_top = [];
var gauge_currentPos_left = [], gauge_currentPos_top = [];
var labelValue_currentPos_left = [], labelValue_currentPos_top = [];
var mixedChart_currentPos_left = [], mixedChart_currentPos_top = [];

var chart_id_button = [], gauge_id_button =  [], labelvalue_id_button, mixedchart_id_button = [];

var lbv_val = [];
var lbv_title_span = [], lbv_title_name = [];
var lbv_unit_span = [], lbv_unit_name = [];

function createChart(_jsonChartParams){

  // x. Parse json format
  var strToParse = JSON.stringify(_jsonChartParams);
  var parsedChart = JSON.parse(strToParse);

  var _chartTitle = parsedChart.chartTitle;
  var _chartWidth = String(parsedChart.chartWidth);
  var _chartHeight = String(parsedChart.chartHeight);
  var _yaxisLabel = parsedChart.yaxisLabel;
  var _yMin = parsedChart.yMin;
  var _yMax = parsedChart.yMax;
  var _gridXdisplay = parsedChart.gridXdisplay;
  var _gridYdisplay = parsedChart.gridYdisplay;
  var _CharSpawnPosition = parsedChart.ChartSpawnPosition;
  var _type = parsedChart.type;
  var _dataset = parsedChart.yData;
  var _timeset = parsedChart.xData;
  var _lineColor = parsedChart.lineColor;
  var _fillColor = parsedChart.fillColor;
  var _theme = parsedChart.theme;
  var _spawnAnimate = parsedChart.spawnAnimate;
  var _spawnPoint = parsedChart.spawnPoint;

  // 0. Set destination of widget spawning
  target_spawn_div = document.getElementById(_CharSpawnPosition);

  buff_div[_numChart] = document.createElement('div');
  buff_div[_numChart].id = 'ch-block' + _numChart;
  buff_div[_numChart].className = 'chartframe';
  var setChartWidth = _chartWidth + 'px';
  var setChartHeight = _chartHeight + 'px';
  buff_div[_numChart].style.width = setChartWidth;
  buff_div[_numChart].style.height = setChartHeight;

  spawnChartCanvas[_numChart] = document.createElement('canvas');
    //spawnChartCanvas[_numChart].getContext('2d');
  spawnChartCanvas[_numChart].id = 'ch' + _numChart;
  /*
    var _name = 'ch' + _numChart;
    document.getElementById(_name).canvas.width = Number(_chartWidth);
    document.getElementById(_name).canvas.height = Number(_chartHeight);
  */
  spawnChartCanvas[_numChart].className = 'w3-card w3-hover-shadow bevelBox';

  // Create span of left, top postion display
  pos_label[_numChart] = document.createElement('span');
  pos_label[_numChart].className = 'pos-label-span';
  pos_label[_numChart].id = 'ch-block' + _numChart + '-pos';

  var pos_label_txt = document.createTextNode('widget info');
  pos_label_txt.className = 'pos-txt-node';
  pos_label[_numChart].appendChild(pos_label_txt);

  // Create chart ID button
  chart_id_button[_numChart] = document.createElement('button');
  chart_id_button[_numChart].className = 'w3-button chart-id-btn';
  chart_id_button[_numChart].id = 'chart-id-btn' + _numChart;
  (function(_btnNum){
    chart_id_button[_btnNum].addEventListener('click', function(){
      console.log('chart id : ' + 'ch' + _btnNum);
      alert('chart_widget_id :' + _btnNum);
    }, false);
  })(_numChart);

  var chart_id_button_txt = document.createTextNode('widget ID');
  chart_id_button[_numChart].appendChild(chart_id_button_txt);

  buff_div[_numChart].appendChild(chart_id_button[_numChart]);
  buff_div[_numChart].appendChild(spawnChartCanvas[_numChart]);
  buff_div[_numChart].appendChild(pos_label[_numChart]);
  target_spawn_div.appendChild(buff_div[_numChart]);

  // Get initial position of widget
  chart_position['#ch' + _numChart] = $('#ch' + _numChart).position();
  console.log(chart_position);

  // Set draggable
  var draggable_name = '#ch-block' + _numChart;
  $(draggable_name).draggable({
    grid: [5,5],
    stop: function(){
      console.log('dragged stop ! ' + draggable_name);
      chart_position[draggable_name] = $(draggable_name).position();
      console.log(chart_position);

      var chartwidgetInfo = 'L:' + chart_position[draggable_name].left + ',T:' + chart_position[draggable_name].top;
          chartwidgetInfo += ', w:' + setChartWidth + ', h:' + setChartHeight;

      $(draggable_name + '-pos').text(chartwidgetInfo);
    },
    drag: function(){
      // do something
    }
  });

  // 0.1 Set theme of chart
  var _fontcolor, _gridlinecolor;
  switch (_theme) {
    case 'light':
        _fontcolor = '#5e5e5e';
        _gridlinecolor = '#ededed';
        spawnChartCanvas[_numChart].style.backgroundColor = 'white';
      break;
    case 'dark':
        _fontcolor = '#727272';
        _gridlinecolor = '#232323';
        spawnChartCanvas[_numChart].style.backgroundColor = 'black';
      break;
    default:
        _fontcolor = '#5e5e5e';
        _gridlinecolor = '#ededed';
        spawnChartCanvas[_numChart].style.backgroundColor = 'white';

  }

  chart[_numChart] = new Chart(spawnChartCanvas[_numChart], {
  type: _type,
  data: {
      labels: _timeset,
      datasets: [{
          label: _chartTitle,
          fill: true,
          lineTension: 0.5,
          backgroundColor: _fillColor,
          borderColor: _lineColor,
          data: _dataset
      }]
  },
  options: {
    legend:{
      labels:{
        fontColor: _fontcolor
      }
    },
      animation: false,
      scales: {
        xAxes: [{
          ticks:{
            fontSize : 9,
            fontColor: _fontcolor
          },
          gridLines:{
            display: _gridXdisplay,
            borderDash: [20,10],
            color: _gridlinecolor
          }
        }],
        yAxes: [{
          ticks:{
            fontSize: 10,
            fontColor: _fontcolor,
            min: _yMin,
            max: _yMax
          },
          gridLines:{
            display: _gridYdisplay,
            borderDash: [5,15],
            color: _gridlinecolor
          },
          scaleLabel: {
            display: true,
            labelString: _yaxisLabel,
            fontColor: _fontcolor
          }
        }]
      }
    }
  });

/*
  $('#ch-block' + _numChart).animate({left: born_pos_left, top: born_pos_top}, 500);
  born_pos_left = born_pos_left + pos_left_offset;
  born_pos_top = born_pos_top + pos_top_offset;
*/

  // Initial hide widget after spawned
  $('#ch-block' + _numChart).hide();

  if(_spawnAnimate){
    switch (_spawnPoint) {
      case 'center':
        var midBrowserWidth = ($(window).width() - _chartWidth)/2;
        var midBrowserHeight = ($(window).height() - _chartHeight)/2;
        $('#ch-block' + _numChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
        $('#ch-block' + _numChart).fadeIn('400');
        break;
      case 'top center':
        var midBrowserWidth = ($(window).width() - _chartWidth)/2;
        var midBrowserHeight = 0;
        $('#ch-block' + _numChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
        $('#ch-block' + _numChart).fadeIn('400');
        break;
      case 'bottom center':
        var midBrowserWidth = ($(window).width() - _chartWidth)/2;
        var midBrowserHeight = $(window).height() - _chartHeight;
        $('#ch-block' + _numChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
        $('#ch-block' + _numChart).fadeIn('400');
        break;
      default:
        var midBrowserWidth = ($(window).width() - _chartWidth)/2;
        var midBrowserHeight = ($(window).height() - _chartHeight)/2;
        $('#ch-block' + _numChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
        $('#ch-block' + _numChart).fadeIn('400');
    }
  }else {
        //.. Do nothing
  }

  _numChart++;

}

function updateChart(_jsonChartUpdate){

  var chartUpdateStr = JSON.stringify(_jsonChartUpdate);
  var chartUpdateParsed = JSON.parse(chartUpdateStr);

  var chart_widget_id = chartUpdateParsed.chart_widget_id;
  var chart_yData = chartUpdateParsed.yData;
  var chart_xData = chartUpdateParsed.xData;

  console.log(chart_widget_id);
  console.log(chart_xData);
  console.log(chart_yData);

  chart[chart_widget_id].data.datasets[0].data = chart_yData;
  chart[chart_widget_id].data.labels = chart_xData;
  chart[chart_widget_id].update();

}

function createGauge(_jsonGaugeParams){

  // x. Parse json format
  var strToParse = JSON.stringify(_jsonGaugeParams);
  var parsedGauge = JSON.parse(strToParse);

  var _gaugeTitle = parsedGauge.gaugeTitle;
  var _gaugeWidth = String(parsedGauge.gaugeWidth);
  var _gaugeHeight = String(parsedGauge.gaugeHeight);
  var _gaugeTitleFontSize = parsedGauge.gaugeTitleFontSize;
  var _gaugeTitleFontColor = parsedGauge.gaugeTitleFontColor;
  var _gaugeValueFontColor = parsedGauge.gaugeValueFontColor;
  var _initialValue = parsedGauge.initialValue;
  var _minScale = parsedGauge.minScale;
  var _maxScale = parsedGauge.maxScale;
  var _GaugeSpawnPosition = parsedGauge.GaugeSpawnPosition;
  var _reverseScale = parsedGauge.reverseScale;
  var _unitName = parsedGauge.unitName;
  var _symbol = ' ' + String(parsedGauge.symbol);
  var _pointer = parsedGauge.pointer;
  var _scaleWidth = parsedGauge.scaleWidth;
  var _theme = parsedGauge.theme;
  var _spawnAnimate = parsedGauge.spawnAnimate;
  var _spawnPoint = parsedGauge.spawnPoint;

  // 0. Set destination of widget spawning
  target_spawn_div = document.getElementById(_GaugeSpawnPosition);

  // 1. Check current gauge spawned
  spawnGaugeCanvas[_numGauge] = document.createElement('div');
  spawnGaugeCanvas[_numGauge].id = 'g' + _numGauge;
  spawnGaugeCanvas[_numGauge].className = 'w3-card w3-hover-shadow gauge bevelBox';

  var setGaugeWidth = _gaugeWidth + 'px';
  var setGaugeHeight = _gaugeHeight + 'px';
  spawnGaugeCanvas[_numGauge].style.width = setGaugeWidth;
  spawnGaugeCanvas[_numGauge].style.height = setGaugeHeight;

  // Create label span
  gauge_pos_label[_numGauge] = document.createElement('span');
  gauge_pos_label[_numGauge].className = 'gauge-pos-label-span';
  gauge_pos_label[_numGauge].id = 'g' + _numGauge + '-pos';
  var LTadj = Number(_gaugeHeight) + 50;
  var setPosLabelTop = '-' + String(LTadj) + 'px';
  gauge_pos_label[_numGauge].style.top = setPosLabelTop;

  var gauge_pos_label_txt = document.createTextNode('widget info');
  gauge_pos_label_txt.className = 'pos-txt-node';
  gauge_pos_label[_numGauge].appendChild(gauge_pos_label_txt);

  // Create gauge ID button
  gauge_id_button[_numGauge] = document.createElement('button');
  gauge_id_button[_numGauge].className = 'w3-button gauge-id-btn';
  gauge_id_button[_numGauge].id = 'gauge-id-btn' + _numGauge;
  (function(_btnNum){
    gauge_id_button[_btnNum].addEventListener('click', function(){
      console.log('gauge id : ' + 'g' + _btnNum);
      alert('gauge_widget_id : ' + _btnNum);
    }, false);
  })(_numGauge);

  var gauge_id_button_txt = document.createTextNode('widget ID');
  gauge_id_button[_numGauge].appendChild(gauge_id_button_txt);

  var widgetBTNadj = Number(_gaugeHeight) + 35;
  var setWidgetBtnTop = '-' + String(widgetBTNadj) + 'px';
  gauge_id_button[_numGauge].style.top = setWidgetBtnTop;

  spawnGaugeCanvas[_numGauge].appendChild(gauge_id_button[_numGauge]);
  spawnGaugeCanvas[_numGauge].appendChild(gauge_pos_label[_numGauge]);
  target_spawn_div.appendChild(spawnGaugeCanvas[_numGauge]);

  console.log(spawnGaugeCanvas);

  // Get initial position of widget
  gauge_position['#g' + _numGauge] = $('#g' + _numGauge).position();
  console.log(gauge_position);

  // Set draggable
  var draggable_name = '#g' + _numGauge;
  $(draggable_name).draggable({
    grid: [5,5],
    stop: function(){
      console.log('dragged stop ! ' + draggable_name);
      gauge_position[draggable_name] = $(draggable_name).position();
      console.log(gauge_position);

      var gaugewidgetInfo = 'L:' + gauge_position[draggable_name].left + ',T:' + gauge_position[draggable_name].top;
          gaugewidgetInfo += ', w:' + setGaugeWidth + ', h:' + setGaugeHeight;

      $(draggable_name + '-pos').text(gaugewidgetInfo);
    },
    drag: function(){
      //..do something
    }
  });

  // 0.1 Set theme of gauge
  var _pointerColor;

  switch (_theme) {
    case 'light':
        spawnGaugeCanvas[_numGauge].classList.add('light-gauge');
        _pointerColor = '#ccc';
      break;
    case 'dark':
        spawnGaugeCanvas[_numGauge].classList.add('dark-gauge');
        _pointerColor = '#ccc';
      break;
    default:
        spawnGaugeCanvas[_numGauge].classList.add('light-gauge');
        _pointerColor = '#ccc';

  }

    gauge[_numGauge] = new JustGage({
      id: 'g' + _numGauge,
      value: _initialValue,
      min: _minScale,
      max: _maxScale,
      reverse: _reverseScale,
      title: String(_gaugeTitle),
      titleMinFontSize: _gaugeTitleFontSize,
      titleFontColor: _gaugeTitleFontColor,
      valueFontColor: _gaugeValueFontColor,
      label: _unitName,
      symbol: _symbol,
      //donut: true,
      pointer: _pointer,
      pointerOptions: {
        toplength: 8,
          bottomlength: -20,
          bottomwidth: 6,
          color: _pointerColor
      },
      gaugeWidthScale: _scaleWidth,
      /*customSectors: [{
        color : "#00ff00",
        lo : 0,
        hi : 50
      },{
        color : "#f2fa57",
        lo : 50,
        hi : 100
      },{
        color : "#ff0000",
        lo : 100,
        hi : 300
      }],*/
      counter: true
    });

    // Initial hide widget
    $('#g' + _numGauge).hide();
/*
    $('#g' + _numGauge).animate({left: born_pos_left, top: born_pos_top}, 500);
    born_pos_left = born_pos_left + pos_left_offset;
    born_pos_top = born_pos_top + pos_top_offset;
*/

    if(_spawnAnimate){
      switch (_spawnPoint) {
        case 'center':
            var midBrowserWidth = ($(window).width() - _gaugeWidth)/2;
            var midBrowserHeight = ($(window).height() - _gaugeHeight)/2;
            $('#g' + _numGauge).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#g' + _numGauge).fadeIn('400');
          break;
        case 'top center':
            var midBrowserWidth = ($(window).width() - _gaugeWidth)/2;
            var midBrowserHeight = 0;
            $('#g' + _numGauge).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#g' + _numGauge).fadeIn('400');
          break;
        case 'bottom center':
            var midBrowserWidth = ($(window).width() - _gaugeWidth)/2;
            var midBrowserHeight = $(window).height() - _gaugeHeight;
            $('#g' + _numGauge).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#g' + _numGauge).fadeIn('400');
          break;
        default:
            var midBrowserWidth = ($(window).width() - _gaugeWidth)/2;
            var midBrowserHeight = ($(window).height() - _gaugeHeight)/2;
            $('#g' + _numGauge).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#g' + _numGauge).fadeIn('400');
      }
    }else {
        //.. Do nothing
    }

    _numGauge++;
}

function updateGauge(_jsonGaugeUpdate){

  var gaugeUpdateStr = JSON.stringify(_jsonGaugeUpdate);
  var gaugeUpdateParsed = JSON.parse(gaugeUpdateStr);

  var gauge_widget_id = gaugeUpdateParsed.gauge_widget_id;
  var gauge_Data = parseFloat(gaugeUpdateParsed.Data).toFixed(2);

  gauge[gauge_widget_id].refresh(gauge_Data);

}

function createLabelValue(_jsonLabelValueParams){

  var strToParse = JSON.stringify(_jsonLabelValueParams);
  var parsedLabelValue = JSON.parse(strToParse);

  var _labelValueTitle = parsedLabelValue.labelValueTitle;
  var _labelValueTitleColor = parsedLabelValue.labelValueTitleColor;
  var _labelValueWidth = String(parsedLabelValue.labelValueWidth);
  var _labelValueHeight = String(parsedLabelValue.labelValueHeight);
  var _labelValueSpawnPosition = parsedLabelValue.labelValueSpawnPosition;
  var _labelValueTxt = parsedLabelValue.labelValueTxt;
  var _labelValueUnit = parsedLabelValue.labelValueUnit;
  var _labelValueUnitColor = parsedLabelValue.labelValueUnitColor;
  var _labelValueFontColor = parsedLabelValue.labelValueFontColor;
  var _labelValueFontSize = parsedLabelValue.labelValueFontSize;
  var _labelValueBGcolor = String(parsedLabelValue.labelValueBGcolor);
  var _spawnAnimate = parsedLabelValue.spawnAnimate;
  var _spawnPoint = parsedLabelValue.spawnPoint;

  // Set destination of widget spawning
  target_spawn_div = document.getElementById(_labelValueSpawnPosition);

  // 1. Create div of label value
  spawnLabelValue[_numLabelValue] = document.createElement('div');
  spawnLabelValue[_numLabelValue].id = 'lbv' + _numLabelValue;
  spawnLabelValue[_numLabelValue].className = 'w3-card w3-hover-shadow label-value-div bevelBox';

  // Set size div
  var lbv_width = _labelValueWidth + 'px';
  var lbv_height = _labelValueHeight + 'px';
  spawnLabelValue[_numLabelValue].style.width = lbv_width;
  spawnLabelValue[_numLabelValue].style.height = lbv_height;
  spawnLabelValue[_numLabelValue].style.backgroundColor = _labelValueBGcolor;

  // Create span for Title
  lbv_title_span[_numLabelValue] = document.createElement('span');
  lbv_title_span[_numLabelValue].className = 'lbv-title-txt';
  lbv_title_span[_numLabelValue].style.color = _labelValueTitleColor;
  lbv_title_span[_numLabelValue].id = 'lbv_title' + _numLabelValue;

  lbv_title_name[_numLabelValue] = document.createTextNode(String(_labelValueTitle));

    // Set position of title display
    lbv_title_span[_numLabelValue].style.left = '5px';
    lbv_title_span[_numLabelValue].style.top = '5px';

    lbv_title_span[_numLabelValue].appendChild(lbv_title_name[_numLabelValue]);

  // Create span for unit
  lbv_unit_span[_numLabelValue] = document.createElement('span');
  lbv_unit_span[_numLabelValue].className = 'lbv-unit-txt';
  lbv_unit_span[_numLabelValue].style.color = _labelValueUnitColor;
  lbv_unit_span[_numLabelValue].id = 'lbv_unit' + _numLabelValue;

  lbv_unit_name[_numLabelValue] = document.createTextNode(String(_labelValueUnit));

    // Set position of title display
    lbv_unit_span[_numLabelValue].style.right = '5px';
    lbv_unit_span[_numLabelValue].style.bottom = '5px';

    lbv_unit_span[_numLabelValue].appendChild(lbv_unit_name[_numLabelValue]);

  // Create span for value
  lbv_val[_numLabelValue] = document.createElement('span');
  lbv_val[_numLabelValue].className = 'lbv-val-txt';
  lbv_val[_numLabelValue].id = 'lbv_val' + _numLabelValue;
  var lbv_val_initTxt = document.createTextNode('value');

    // Set position of value display
    lbv_val[_numLabelValue].style.left = String(Number(_labelValueWidth)*0.25) + 'px';
    lbv_val[_numLabelValue].style.bottom = String(Number(_labelValueHeight)*0.25) + 'px';

    // Set value font size
    lbv_val[_numLabelValue].style.fontSize = String(Number(_labelValueFontSize)) + 'px';

    // Set value font color
    lbv_val[_numLabelValue].style.color = String(_labelValueFontColor);

    lbv_val[_numLabelValue].appendChild(lbv_val_initTxt);

  // Create span for label value widget info
  labelValue_pos_label[_numLabelValue] = document.createElement('span');
  labelValue_pos_label[_numLabelValue].className = 'labelValue-pos-label-span';
  labelValue_pos_label[_numLabelValue].id = 'lbv' + _numLabelValue + '-pos';

  var lableTxtNode = document.createTextNode('widget info');
  lableTxtNode.className = 'pos-txt-node';

  // Merge element
  labelValue_pos_label[_numLabelValue].appendChild(lableTxtNode);
  spawnLabelValue[_numLabelValue].appendChild(lbv_title_span[_numLabelValue]);
  spawnLabelValue[_numLabelValue].appendChild(lbv_unit_span[_numLabelValue]);
  spawnLabelValue[_numLabelValue].appendChild(labelValue_pos_label[_numLabelValue]);
  spawnLabelValue[_numLabelValue].appendChild(lbv_val[_numLabelValue]);
  target_spawn_div.appendChild(spawnLabelValue[_numLabelValue]);

  // Set draggable
  var lbvDraggable_name = '#lbv' + _numLabelValue;
  $(lbvDraggable_name).draggable({
    grid: [5,5],
    stop: function(){
      console.log('dragged stop ! ' + lbvDraggable_name);
      labelvalue_position[lbvDraggable_name] = $(lbvDraggable_name).position();
      console.log(labelvalue_position);

      console.log('label value w: ' + _labelValueWidth);

      var lbvwidgetInfo = 'L:' + labelvalue_position[lbvDraggable_name].left + ',T:' + labelvalue_position[lbvDraggable_name].top;
          lbvwidgetInfo += ', w:' + lbv_width + ', h:' + lbv_height;

      $(lbvDraggable_name + '-pos').text(lbvwidgetInfo);
    },
    drag: function(){
      //.. do something
    }
  });

  // Initial hide widget
  $('#lbv' + _numLabelValue).hide();

/*
  $('#lbv' + _numLabelValue).animate({left: born_pos_left, top: born_pos_top}, 500);
  born_pos_left = born_pos_left + pos_left_offset;
  born_pos_top = born_pos_top + pos_top_offset;
*/

  if(_spawnAnimate){
      switch (_spawnPoint) {
        case 'center':
            var midBrowserWidth = ($(window).width() - _labelValueWidth)/2;
            var midBrowserHeight = ($(window).height() - _labelValueHeight)/2;
            $('#lbv' + _numLabelValue).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#lbv' + _numLabelValue).fadeIn('400');
          break;
        case 'top center':
            var midBrowserWidth = ($(window).width() - _labelValueWidth)/2;
            var midBrowserHeight = 0;
            $('#lbv' + _numLabelValue).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#lbv' + _numLabelValue).fadeIn('400');
          break;
        case 'bottom center':
            var midBrowserWidth = ($(window).width() - _labelValueWidth)/2;
            var midBrowserHeight = $(window).height() - _labelValueHeight;
            $('#lbv' + _numLabelValue).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#lbv' + _numLabelValue).fadeIn('400');
          break;
        default:
            var midBrowserWidth = ($(window).width() - _labelValueWidth)/2;
            var midBrowserHeight = ($(window).height() - _labelValueHeight)/2;
            $('#lbv' + _numLabelValue).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
            $('#lbv' + _numLabelValue).fadeIn('400');
      }
  }else {
    // .. Do nothing
  }

  _numLabelValue++;

}

function updateLabelValue(_jsonLBVupdate){

  var _lbvUpdateVal = JSON.stringify(_jsonLBVupdate);
  var _lbvUpdateValParsed = JSON.parse(_lbvUpdateVal);

  var _label_widget_id = _lbvUpdateValParsed.label_widget_id;
  var _Data = _lbvUpdateValParsed.Data;

  var setEffLBV = '#lbv_val' + String(_label_widget_id);
  $(setEffLBV).text(_Data);

}

function createMixedChart(_jsonMixedChartParams){

  var _mixedChartStr = JSON.stringify(_jsonMixedChartParams);
  var _mixedChartParsed = JSON.parse(_mixedChartStr);

  var _type = _mixedChartParsed.type;
  var _CharSpawnPosition = _mixedChartParsed.ChartSpawnPosition;
  var _chartWidth = _mixedChartParsed.chartWidth;
  var _chartHeight = _mixedChartParsed.chartHeight;
  var _yMin = _mixedChartParsed.yMin;
  var _yMax = _mixedChartParsed.yMax;
  var _gridXdisplay = _mixedChartParsed.gridXdisplay;
  var _gridYdisplay = _mixedChartParsed.gridYdisplay;
  var _yaxisLabel = _mixedChartParsed.yaxisLabel;
  var _xData = _mixedChartParsed.xData;
  var _theme = _mixedChartParsed.theme;

  var _chartTitle_1 = _mixedChartParsed.chart1.chartTitle;
  var _lineColor_1 = _mixedChartParsed.chart1.lineColor;
  var _fillColor_1 = _mixedChartParsed.chart1.fillColor;
  var _yData_1 = _mixedChartParsed.chart1.yData;

  var _chartTitle_2 = _mixedChartParsed.chart2.chartTitle;
  var _lineColor_2 = _mixedChartParsed.chart2.lineColor;
  var _fillColor_2 = _mixedChartParsed.chart2.fillColor;
  var _yData_2 = _mixedChartParsed.chart2.yData;

  var _spawnAnimate = _mixedChartParsed.spawnAnimate;
  var _spawnPoint = _mixedChartParsed.spawnPoint;

  // 0. Set destination of widget spawning
  target_spawn_div = document.getElementById(_CharSpawnPosition);

  mixedChart_buff_div[_numMixedChart] = document.createElement('div');
  mixedChart_buff_div[_numMixedChart].id = 'ch-mixed-block' + _numMixedChart;
  mixedChart_buff_div[_numMixedChart].className = 'chartframe';
    var setChartWidth = _chartWidth + 'px';
    var setChartHeight = _chartHeight + 'px';
    console.log('mix size : ' + setChartWidth + ',' + setChartHeight);
    mixedChart_buff_div[_numMixedChart].style.width = setChartWidth;
    mixedChart_buff_div[_numMixedChart].style.height = setChartHeight;

  spawnMixedChartCanvas[_numMixedChart] = document.createElement('canvas');
  spawnMixedChartCanvas[_numMixedChart].id = 'ch-mixed' + _numMixedChart;
  spawnMixedChartCanvas[_numMixedChart].className = 'w3-card w3-hover-shadow bevelBox';

  // Create span of left, top postion display
  mixedChart_pos_label[_numMixedChart] = document.createElement('span');
  mixedChart_pos_label[_numMixedChart].className = 'pos-label-span';
  mixedChart_pos_label[_numMixedChart].id = 'ch-mixed-block' + _numMixedChart + '-pos';

  var pos_label_txt = document.createTextNode('widget info');
  pos_label_txt.className = 'pos-txt-node';
  mixedChart_pos_label[_numMixedChart].appendChild(pos_label_txt);

  // Create chart ID button
  mixedchart_id_button[_numMixedChart] = document.createElement('button');
  mixedchart_id_button[_numMixedChart].className = 'w3-button chart-id-btn';
  mixedchart_id_button[_numMixedChart].id = 'chart-mixed-id-btn' + _numMixedChart;
  (function(_btnNum){
    mixedchart_id_button[_btnNum].addEventListener('click', function(){
      console.log('chart mixed id : ' + 'ch-mixed' + _btnNum);
      alert('mixed_chart_widget_id :' + _btnNum);
    }, false);
  })(_numMixedChart);

  var chart_id_button_txt = document.createTextNode('widget ID');
  mixedchart_id_button[_numMixedChart].appendChild(chart_id_button_txt);

  mixedChart_buff_div[_numMixedChart].appendChild(mixedchart_id_button[_numMixedChart]);
  mixedChart_buff_div[_numMixedChart].appendChild(spawnMixedChartCanvas[_numMixedChart]);
  mixedChart_buff_div[_numMixedChart].appendChild(mixedChart_pos_label[_numMixedChart]);
  target_spawn_div.appendChild(mixedChart_buff_div[_numMixedChart]);

  // Get initial position of widget
  mixedChart_position['#ch-mixed' + _numMixedChart] = $('#ch-mixed' + _numMixedChart).position();
  console.log(mixedChart_position);

  // Set draggable
  var draggable_name = '#ch-mixed-block' + _numMixedChart;
  $(draggable_name).draggable({
    grid: [5,5],
    stop: function(){
      console.log('dragged stop ! ' + draggable_name);
      mixedChart_position[draggable_name] = $(draggable_name).position();
      console.log(mixedChart_position);

      var mixedchartwidgetInfo = 'L:' + mixedChart_position[draggable_name].left + ',T:' + mixedChart_position[draggable_name].top;
          mixedchartwidgetInfo += ', w:' + setChartWidth + ', h:' + setChartHeight;

      $(draggable_name + '-pos').text(mixedchartwidgetInfo);
    },
    drag: function(){
      // do something
    }
  });

  // 0.1 Set theme of chart
  var _fontcolor, _gridlinecolor;
  switch (_theme) {
    case 'light':
        _fontcolor = '#5e5e5e';
        _gridlinecolor = '#ededed';
        spawnMixedChartCanvas[_numMixedChart].style.backgroundColor = 'white';
      break;
    case 'dark':
        _fontcolor = '#727272';
        _gridlinecolor = '#232323';
        spawnMixedChartCanvas[_numMixedChart].style.backgroundColor = 'black';
      break;
    default:
        _fontcolor = '#5e5e5e';
        _gridlinecolor = '#ededed';
        spawnMixedChartCanvas[_numMixedChart].style.backgroundColor = 'white';
  }

  mixedChart[_numMixedChart] = new Chart(spawnMixedChartCanvas[_numMixedChart], {
  type: _type,
  data: {
      labels: _xData,
      datasets: [{
          label: _chartTitle_1,
          fill: true,
          lineTension: 0.5,
          backgroundColor: _fillColor_1,
          borderColor: _lineColor_1,
          data: _yData_1
      },
      {
          label: _chartTitle_2,
          fill: true,
          lineTension: 0.5,
          backgroundColor: _fillColor_2,
          borderColor: _lineColor_2,
          data: _yData_2
      }]
  },
  options: {
    legend:{
      labels:{
        fontColor: _fontcolor
      }
    },
      animation: false,
      scales: {
        xAxes: [{
          ticks:{
            fontSize : 9,
            fontColor: _fontcolor
          },
          gridLines:{
            display: _gridXdisplay,
            borderDash: [20,10],
            color: _gridlinecolor
          }
        }],
        yAxes: [{
          ticks:{
            fontSize: 10,
            fontColor: _fontcolor,
            min: _yMin,
            max: _yMax /*,
            suggestedMin: 100,
            suggestedMax: 500
            stepSize: 10
            */
          },
          gridLines:{
            display: _gridYdisplay,
            borderDash: [5,15],
            color: _gridlinecolor
          },
          scaleLabel: {
            display: true,
            labelString: _yaxisLabel,
            fontColor: _fontcolor
          }
        }]
      }
    }
  });

  // Initial hide widget
  $('#ch-mixed-block' + _numMixedChart).hide();

  if(_spawnAnimate){
    switch (_spawnPoint) {
      case 'center':
          var midBrowserWidth = ($(window).width() - _chartWidth)/2;
          var midBrowserHeight = ($(window).height() - _chartHeight)/2;
          $('#ch-mixed-block' + _numMixedChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
          $('#ch-mixed-block' + _numMixedChart).fadeIn('400');
        break;
      case 'top center':
          var midBrowserWidth = ($(window).width() - _chartWidth)/2;
          var midBrowserHeight = 0;
          $('#ch-mixed-block' + _numMixedChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
          $('#ch-mixed-block' + _numMixedChart).fadeIn('400');
        break;
      case 'bottom center':
          var midBrowserWidth = ($(window).width() - _chartWidth)/2;
          var midBrowserHeight = $(window).height() - _chartHeight;
          $('#ch-mixed-block' + _numMixedChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
          $('#ch-mixed-block' + _numMixedChart).fadeIn('400');
        break;
      default:
          var midBrowserWidth = ($(window).width() - _chartWidth)/2;
          var midBrowserHeight = ($(window).height() - _chartHeight)/2;
          $('#ch-mixed-block' + _numMixedChart).animate({left: midBrowserWidth, top: midBrowserHeight}, 100);
          $('#ch-mixed-block' + _numMixedChart).fadeIn('400');
    }
  }else {
    // .. Do nothing
  }

  _numMixedChart++;

}

function updateMixedChart(_jsonmixedChartUpdate){

  var mixedchartUpdateStr = JSON.stringify(_jsonmixedChartUpdate);
  var mixedchartUpdateParsed = JSON.parse(mixedchartUpdateStr);

  var mixedchart_widget_id = mixedchartUpdateParsed.mixed_chart_widget_id;
  var mixedchart_yData_1 = mixedchartUpdateParsed.yData_1;
  var mixedchart_yData_2 = mixedchartUpdateParsed.yData_2;
  var mixedchart_xData = mixedchartUpdateParsed.xData;

  console.log('mixed chart id : ' + mixedchart_widget_id);
  console.log(mixedchart_yData_1);
  console.log(mixedchart_yData_2);
  console.log(mixedchart_xData);

  var dataset_arr = [];
  var push_index = 0;
  dataset_arr.push(mixedchart_yData_1);
  dataset_arr.push(mixedchart_yData_2);

  console.log(dataset_arr);

  var mixedChartData_obj = mixedChart[mixedchart_widget_id].data;
  for(var i in mixedChartData_obj){
    mixedChartData_obj.datasets[0].data = dataset_arr[push_index];
    push_index++;
  }

  mixedChart[mixedchart_widget_id].data.labels = mixedchart_xData;
  mixedChart[mixedchart_widget_id].update();

}

function setPosition(_widgetType, _widgetId, _left, _top){
  switch (_widgetType) {
    case 'chart':
        var chartEffName = '#ch-block' + String(_widgetId);
        $(chartEffName).animate({
          left: _left,
          top: _top
        }, 500);
        $(chartEffName).fadeIn('400');
      break;
    case 'gauge':
        var gaugeEffName = '#g' + String(_widgetId);
        $(gaugeEffName).animate({
          left: _left,
          top: _top
        }, 500);
        $(gaugeEffName).fadeIn('400');
      break;
    case 'label value':
        var labelValueEffName = '#lbv' + String(_widgetId);
        $(labelValueEffName).animate({
          left: _left,
          top: _top
        }, 500);
        $(labelValueEffName).fadeIn('400');
      break;
    case 'mixed chart':
        var mixedChartEffName = '#ch-mixed-block' + String(_widgetId);
        $(mixedChartEffName).animate({
          left: _left,
          top: _top
        }, 500);
        $(mixedChartEffName).fadeIn('400');
      break;
    default:
  }
}

function lockWidget(){

  var chkChartObjLen = chart.length;
  var chkGaugeObjLen = gauge.length;
  var chkLBVObjLen = spawnLabelValue.length;
  var chkMixedChartLen = mixedChart.length;

  if(chkChartObjLen > 0){
    for(var i=0; i<=chkChartObjLen; i++){

      var chartFetchName_btn = '#chart-id-btn' + i;
      $(chartFetchName_btn).hide();

      var chartFetchName_pos = '#ch-block' + i + '-pos';
      $(chartFetchName_pos).hide();

      var chartFetchName = '#ch-block' + i;
      $(chartFetchName).draggable({disabled: true});
    }
  }else {
    //.. do nothing
  }

  if(chkGaugeObjLen > 0){
    for(var j=0; j<=chkGaugeObjLen; j++){

      var gaugeFetchName_btn = '#gauge-id-btn' + j;
      $(gaugeFetchName_btn).hide();

      var gaugeFetchName_pos = '#g' + j + '-pos';
      $(gaugeFetchName_pos).hide();

      var gaugeFetchName = '#g' + j;
      $(gaugeFetchName).draggable({disabled: true});

    }
  }else {
    //.. do nothing
  }

  if(chkLBVObjLen > 0){
    for(var k=0; k<=chkLBVObjLen; k++){

      var lbvFetchName_btn = '#lbv-id-btn' + k;
      $(lbvFetchName_btn).hide();

      var lbvFetchName_pos = '#lbv' + k + '-pos';
      $(lbvFetchName_pos).hide();

      var lbvFetchName = '#lbv' + k;
      $(lbvFetchName).draggable({disabled: true});

    }
  }else {
    //.. do nothing
  }

  if(chkMixedChartLen > 0){
    for(var l=0; l<=chkMixedChartLen; l++){

      var mixedchartFetchName_btn = '#chart-mixed-id-btn' + l;
      $(mixedchartFetchName_btn).hide();

      var mixedchartFetchName_pos = '#ch-mixed-block' + l + '-pos';
      $(mixedchartFetchName_pos).hide();

      var mixedchartFetchName = '#ch-mixed-block' + l;
      $(mixedchartFetchName).draggable({disabled: true});

    }
  }else {
    //.. do nothing
  }

}

function unlockWidget(){

  var chkChartObjLen = chart.length;
  var chkGaugeObjLen = gauge.length;
  var chkLBVObjLen = spawnLabelValue.length;
  var chkMixedChartLen = mixedChart.length;

  if(chkChartObjLen > 0){
    for(var i=0; i<=chkChartObjLen; i++){

      var chartFetchName_btn = '#chart-id-btn' + i;
      $(chartFetchName_btn).fadeIn(400);

      var chartFetchName_pos = '#ch-block' + i + '-pos';
      $(chartFetchName_pos).fadeIn('400');

      var chartFetchName = '#ch-block' + i;
      $(chartFetchName).draggable({disabled: false});
    }
  }else {
    //.. do nothing
  }

  if(chkGaugeObjLen > 0){
    for(var j=0; j<=chkGaugeObjLen; j++){

      var gaugeFetchName_btn = '#gauge-id-btn' + j;
      $(gaugeFetchName_btn).fadeIn(400);

      var gaugeFetchName_pos = '#g' + j + '-pos';
      $(gaugeFetchName_pos).fadeIn('400');

      var gaugeFetchName = '#g' + j;
      $(gaugeFetchName).draggable({disabled: false});

    }
  }else {
    //.. do nothing
  }

  if(chkLBVObjLen > 0){
    for(var k=0; k<=chkLBVObjLen; k++){

      var lbvFetchName_btn = '#lbv-id-btn' + k;
      $(lbvFetchName_btn).fadeIn('400');

      var lbvFetchName_pos = '#lbv' + k + '-pos';
      $(lbvFetchName_pos).fadeIn('400');

      var lbvFetchName = '#lbv' + k;
      $(lbvFetchName).draggable({disabled: false});

    }
  }else {
    //.. do nothing
  }

  if(chkMixedChartLen > 0){
    for(var l=0; l<=chkMixedChartLen; l++){

      var mixedchartFetchName_btn = '#chart-mixed-id-btn' + l;
      $(mixedchartFetchName_btn).fadeIn('400');

      var mixedchartFetchName_pos = '#ch-mixed-block' + l + '-pos';
      $(mixedchartFetchName_pos).fadeIn('400');

      var mixedchartFetchName = '#ch-mixed-block' + l;
      $(mixedchartFetchName).draggable({disabled: false});

    }
  }else {
    //.. do nothing
  }

}
