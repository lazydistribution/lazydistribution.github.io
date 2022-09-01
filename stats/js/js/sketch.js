
let stats = [];
const w = 600; // canvas width
const h = 400; // canvas height
const mx = 20; // horizontal margin
const my = 20; // wertical margin
const tz = 20; // text size in pixels
const dz = 10; // dot size
const td = 10; // touch distance size
let isNewStats = false;
const colorPaletteName = 'purple';//'dark jungle';
const data_url = './data/stats/'
let contents = '';
const hor_opt = [];
const ver_opt = [];

async function preload() {
  let response = await fetch('./data/info/contents.json');
  contents = await response.json();
}



function setup() {
  createCanvas(w, h);
  showStatsListLayout(createStatsListLayout());
  loadStatsIfAny();
}

function draw() {
  background(255);
  
  if(stats.title) {
    fillColorPaletteIfNew(stats);
    showDataPointInfoOnHover(updateAndShowStats(updateAndShowChart(stats)));
  }
}

function showStatsListLayout(html) {
  $('#nav').html(html);

  selectExistingFileSelectorsIfAny('.stats-selector-left', '.stats-selector-right');

  $('button[data-type="stats-button"]').on('click', function(e) {
    toggleButton(this, $(this).parent());
    resolveButtonConflict($(this).parent(), getParentSibling(this));
    changeURL(getFileName());
  });
}

function changeURL(filename) {
  if(filename) {
    const url = new URL(window.location);
    url.searchParams.set('file', filename);
    url.searchParams.set('timestamp', timestamp());

    const nextURL = url.href;
    const nextTitle = 'Stats';
    const nextState = { additionalInformation: 'Showing file ' . filename };

    history.pushState(nextState, nextTitle, nextURL);
    loadStatsIfAny();
  }
}

function getFileName() {
  const xaxis = getSelectedButtonValue('.stats-selector-left');
  const yaxis = getSelectedButtonValue('.stats-selector-right');
  return xaxis && yaxis ? fileNameEncode(xaxis, yaxis) : undefined;
}

function fileNameEncode(a, b) {
  let str = a + ' / ' + b;
  return btoa(str) + '.json';
}

function getParentSibling(self) {
  const prev = $(self).parent().prev();
  const next = $(self).parent().next();
  return ($(prev).length > 0 ? prev : next);
}

function toggleButton(selector, parent_selector) {
  if($(selector).hasClass('selected')) {
    $(selector).removeClass('selected')
  } else {
    if(parent_selector) {
      $(parent_selector).find('button[data-type="stats-button"]').each(function(a) {
        $(this).removeClass('selected');
      });
    }
    $(selector).addClass('selected');
  }
}

function resolveButtonConflict(tis, tat) {
  let tis_index_1 = getSelectedButtonIndex(tis);
  let tat_index_1 = getSelectedButtonIndex(tat);
  if(tis_index_1 > -1 && tat_index_1 > -1) {
    let tis_index_2 = childrenCount(tis)-1;
    if(tis_index_1 === tat_index_1) {
      let tat_index;
      if(tis_index_1 === tis_index_2) {
        tat_index = 0;
      } else {
        tat_index = tat_index_1 + 1;
      }
      $(tat).children().eq(tat_index).trigger('click');
    }
  }
}

function getSelectedButtonValue(selector) {
  return $(selector).find('.selected').data('value');
}

function getSelectedButtonIndex(selector) {
  return $(selector).find('.selected').index();
}

function childrenCount(selector) {
  return $(selector).children().length;
}

function selectExistingFileSelectorsIfAny(tis, tat) {
  const decoded_titles = decodeTitlePairIfAny();
  if(decoded_titles.length === 2) {
    const tis_index = getIndexByValue(tis, decoded_titles[0]);
    const tat_index = getIndexByValue(tat, decoded_titles[1]);
    if(tis_index > -1) $(tis).children().eq(tis_index).addClass('selected');
    if(tat_index > -1) $(tat).children().eq(tat_index).addClass('selected');
  }
}

function getIndexByValue(selector, value) {
  return $(selector).find('button[data-value="' + value + '"]').index();
}

function decodeTitlePairIfAny() {
  const filename = getFileFromUrlIfAny();
  if(filename && filename.length > 0) {
    const title = fileNameDecode(filename);
    return title.split(' / ');
  }
  return [];
}

function fileNameDecode(str) {
  str = str_replace('.json', '', str);
  return atob(str);
}

function getFileFromUrlIfAny() {
  const params = new URLSearchParams(document.location.search);
  const file = params.get('file');
  if(typeof file === 'string' && file.length > 0) {
    return file;
  }
}

function loadStatsIfAny() {
  const params = new URLSearchParams(document.location.search);
  const file = params.get('file');
  if(typeof file === 'string' && file.length > 0) {
    isNewStats = true;
    processStats();
  }
}

function createStatsListLayout() {
  const json = getLayout('template-list');
  
  for(const list_layoyt of json) {
    let i = 0;
    for(const list_column_layout of list_layoyt.children) {
      for(const title of contents) {
        let button = getLayout('template-button');
        button.label = button['data-value'] = title;
        button['class-name-button'] += ' ' + (i++ % 2 === 0 ? 'row-odd' : 'row-even');
        list_column_layout.children.push(button);
      }
    }
  }

  return json2html(json);
}

function getLayout(template) {
  switch(template) {
    case 'template-list':
      return [
        {
          'template': 'template-list',
          'class-name-list': 'stats-selector',
          'children': [
            {
              'template': 'template-list-column',
              'class-name-column': 'stats-selector-left',
              'children':[]
            },
            {
              'template': 'template-list-column',
              'class-name-column': 'stats-selector-right',
              'children':[]
            }
          ]
        }
      ];
    case 'template-button':
      return {
        'template': 'template-button',
        'class-name-button': 'button',
        'data-type': 'stats-button',
        'data-value': '',
        'label': ''
      };
  }
}

function json2html(data) {
  let html = '';
  for(let i = 0; i < data.length; i++) {
    let template = String($('#' + data[i].template).html());
    for(let j in data[i]) {
      let value;
      if(Array.isArray(data[i][j])) {
        value = json2html(data[i][j]);
      } else {
        value = data[i][j];
      }
      template = str_replace('{{' + j + '}}', value, template);
    }
    html += template;
  }
  return html;
}

function str_replace(pattern, fill, str) {
  let count = 0;
  let max = 10000;
  while(str.indexOf(pattern) !== -1) {
    str = str.replace(pattern, fill);
    if(count++ >= max) break;
  }
  return str;
}

async function processStats() {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  let response = await fetch(data_url+file);
  contents = await response.json();
  stats = contents;
}

function fillColorPaletteIfNew(stats) {
  if(stats && stats.data && isNewStats) {
    isNewStats = false;
    for(let i = 0; i < stats.data.length; i++) {
      stats.data[i].color = gerRandomFromColorPalette(colorPaletteName);
    }
  }
}

function updateAndShowChart(stat) {

  /////////////////
  // LABELS
  /////////////////
  noStroke();
  fill(0);
  textSize(tz);
  let tw = textWidth(stat.title);
  let x = (w-tw)*.5;
  let y = my+tz;
  text(stat.title, x, y);
  x = mx+tz;
  let ty = textWidth(stat.yaxis);
  y = (h+ty)*.5;
  push();
  translate(x, y);
  rotate(radians(-90));
  text(stat.yaxis, 0, 0);
  pop();
  tw = textWidth(stat.xaxis);
  x = (w-tw)*.5;
  y = h-my;
  text(stat.xaxis, x, y);
  
  /////////////////
  // EDGES
  /////////////////
  stroke(0);
  fill(0);
  x = mx+tz+mx;
  y = my+tz+my;
  let ly = h-(y*2);
  line(x,y, x, y+ly);
  let lw = w-(x*2);
  y = h-y;
  line(x,y, x+lw, y);

  return stat;
}

function updateAndShowStats(stat) {
  
  /////////////////
  // DATA
  /////////////////
  noStroke();
  //fill(180);
  let x = mx+tz+mx;
  let y = h - (my+tz+my);
  let maxx = x;
  let maxy = y;
  let minx = w-x;
  let miny = my+tz+my;
  let i = 0;
  for(let d of stat.data) {
    if(typeof d.color !== 'string') d.color = gerRandomFromColorPalette(colorPaletteName);
    fill(d.color);
    let px = map(d.w,stat.minx,stat.maxx,minx,maxx);
    let py = map(d.h,stat.miny,stat.maxy,miny,maxy);
    ellipse(px, py, dz);
    stat.data[i].x = px;
    stat.data[i++].y = py;
  }
  return stat;
}

function showDataPointInfoOnHover(stat){
  /////////////////
  // INFO
  /////////////////
  for(let {c,x,y} of stat.data) {
    let dis = dist(x, y, mouseX, mouseY);
    if(dis <= td) {
      let tw = textWidth(c);
      x = x - tw *.5;
      y = y - dz;
      noStroke();
      fill(255);
      rect(x, y-dz*1.75, tw, dz*2);
      fill(0);
      text(c, x, y);
    }
  }
}

function gerRandomFromColorPalette(palette) {
  let r = 0;
  let g = 0;
  let b = 0;
  switch(palette) {
    case 'purple' :
      r = Math.floor(random(150, 200));
      g = 0;
      b = Math.floor(random(50, 100));
      break;
    case 'dark jungle' :
      b = Math.floor(random(150, 200));
      r = 0;
      g = Math.floor(random(50, 100));
      break;
  }
  return convertRGBtoHex(r, g, b);
}

function timestamp() {
  return Date.now();
} 

function colorToHex(color) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function convertRGBtoHex(red, green, blue) {
  return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
}

function urlencode(str) {
  let newStr = '';
  const len = str.length;

  for (let i = 0; i < len; i++) {
    let c = str.charAt(i);
    let code = str.charCodeAt(i);

    // Spaces
    if (c === ' ') {
      newStr += '+';
    }
    // Non-alphanumeric characters except "-", "_", and "."
    else if ((code < 48 && code !== 45 && code !== 46) ||
             (code < 65 && code > 57) ||
             (code > 90 && code < 97 && code !== 95) ||
             (code > 122)) {
      newStr += '%' + code.toString(16);
    }
    // Alphanumeric characters
    else {
      newStr += c;
    }
  }

  return newStr;
}