const spots = [
  {
    id: 'zhuyun', no: '01', name: '竹韵斋陕西曲艺传承中心',
    place: '曲艺创作 · 演出 · 传承', address: '西安市雁塔区',
    lng: 108.955, lat: 34.205, x: 183, y: 465,
    image: 'assets/竹韵斋曲艺传承中心简介_image1.jpeg',
    intro: '竹韵斋陕西曲艺传承中心是一所以曲艺文化传播为基础及创作、编导、演出、传承、交流、创新融合发展的艺术空间平台。中心自 2013 年成立至今，培养曲艺专业演员、爱好者数千名。2018 年至 2022 年，杨锦龙老师、张珲老师分别获得中国曲艺最高奖牡丹奖表演奖和文学奖。代表作有《武松打虎》《三打白骨精》《鲁达除霸》《猴子告状》《燃烧的音符》《长安十二茶坊》等。',
    highlights: ['2013 年成立', '牡丹奖获奖团队', '代表作 8 部'],
    people: [
      ['杨锦龙', '现任陕西省曲艺家协会副主席、西安市说唱艺术团副团长，也是中国曲协快板艺术委员会委员、陕西快板艺术委员会副会长。2018 年获第十届中国曲艺牡丹奖表演奖，2023 年入选“艺苑撷英”全国优秀青年曲艺人才展演（陕西唯一入选）。代表作品有快板书《武松打虎》《三打白骨精》《鲁达除霸》，陕西快板《猴子告状》《燃烧的音符》，实景剧《长安十二茶坊》等。'],
      ['张珲', '中国曲艺最高奖牡丹奖文学奖获得者。2022 年凭陕西快板《猴子告状》摘得第十二届中国曲艺牡丹奖文学奖，这也是陕西曲艺工作者首次拿到该奖项。她与丈夫杨锦龙分别获得牡丹奖文学奖和表演奖，被称为中国曲艺“牡丹伉俪”。']
    ]
  },
  { id: 'culture', no: '02', name: '陕西省文化馆（曲江馆区）', place: '国家一级文化馆 · 曲江馆区', address: '西安市雁塔区小寨东路 91 号附近', lng: 108.972, lat: 34.212, x: 504, y: 354, image: 'assets/陕西省文化馆简介docx_image1.jpeg', intro: '陕西省文化馆是陕西省文化和旅游厅直属公益性事业单位，前身为 1956 年 2 月 18 日成立的陕西省群众艺术馆，2019 年更为现名。2021 年 11 月被命名为国家一级文化馆。曲江馆区于 2013 年立项，2023 年 6 月建成开放，建筑面积 4.19 万平方米，日接待能力 1 万人次。', highlights: ['1956 年前身成立', '国家一级文化馆', '2023 年曲江馆区开放'] },
  { id: 'yisu', no: '03', name: '易俗社', place: '秦腔剧社 · 西安 1912', address: '西安市新城区西一路 282 号附近', lng: 108.952, lat: 34.263, x: 680, y: 260, image: 'assets/易俗社图文介绍_image1.webp', intro: '易俗社是 1912 年在西安创办的中国最古老的秦腔剧社之一，以“移风易俗，启迪民智”为宗旨，集戏曲创作、演出与教育于一体。易俗社由 160 余名社会贤达于 1912 年在西安创立，是中国第一个将戏曲教育、创作和演出结合的新型艺术团体。其创办宗旨为“移风易俗、启迪民智、辅助社会教育”，旨在通过戏曲革新推动社会思想启蒙和道德风尚引领。', highlights: ['1912 年创立', '移风易俗 · 启迪民智', '戏曲教育与创作'] },
  { id: 'theatre', no: '04', name: '人民剧院', place: '演出现场 · 城市剧场', address: '西安市北大街 41 号（钟楼以北 200 米）', lng: 108.947, lat: 34.270, x: 809, y: 178, image: 'assets/人民剧院简介_image1.jpeg', intro: '西安人民剧院位于西安市北大街 41 号（钟楼以北 200 米处），1954 年建成，是陕西省文物保护单位、中国 20 世纪建筑遗产，被收录于英国《世界建筑史》。', highlights: ['1954 年建成', '陕西省文物保护单位', '中国 20 世纪建筑遗产'] }
];

const $ = selector => document.querySelector(selector);
let currentId = spots[0].id;
let onlineMap = null;
let routeLine = null;
let routeVisible = false;
let markerClicking = false;
const onlineMarkers = {};
const inheritors = spots[0].people;

function markerTemplate(spot) {
  return `<g class="local-marker" data-id="${spot.id}" transform="translate(${spot.x} ${spot.y})" tabindex="0" role="button" aria-label="${spot.name}"><circle class="local-marker-halo" r="24"/><circle class="local-marker-dot" r="10"/><text class="local-marker-name" x="0" y="-31" text-anchor="middle">${spot.name}</text></g>`;
}

function renderMarkers() {
  $('#markers').innerHTML = spots.map(markerTemplate).join('');
  document.querySelectorAll('.local-marker').forEach(marker => {
    marker.addEventListener('click', event => { event.stopPropagation(); selectSpot(marker.dataset.id, true); });
    marker.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectSpot(marker.dataset.id, true); }
    });
  });
}

function renderDetail(spot) {
  $('#mapCardKicker').textContent = `${spot.place} · ${spot.address}`;
  $('#mapCardTitle').textContent = spot.name;
  $('#mapCardIntro').textContent = spot.intro;
  $('#mapCardImage').style.backgroundImage = `url("${spot.image}")`;
}

function renderPeoplePanel() {
  $('#panelPeople').innerHTML = inheritors.map(person => `<div class="panel-person"><div class="panel-person-name">${person[0]}</div><div class="panel-person-role">${person[1]}</div></div>`).join('');
}

function markerHtml(spot, active) {
  return `<button class="amap-marker ${active ? 'active' : ''}" data-spot-id="${spot.id}" type="button" aria-label="${spot.name}"><i></i><span>${spot.name}</span></button>`;
}

function selectSpot(id, open = true) {
  const spot = spots.find(item => item.id === id);
  if (!spot) return;
  currentId = id;
  document.querySelectorAll('.local-marker').forEach(marker => marker.classList.toggle('active', marker.dataset.id === id));
  Object.entries(onlineMarkers).forEach(([key, marker]) => marker.setContent(markerHtml(spots.find(item => item.id === key), key === id)));
  renderDetail(spot);
  if (open) $('#mapCard').classList.remove('is-closing');
  else closeCard();
  if (open && onlineMap) onlineMap.setZoomAndCenter(15, [spot.lng, spot.lat]);
}

function closeCard() { $('#mapCard').classList.add('is-closing'); }

function initOpenMap() {
  if (!window.AMap || !$('#amapContainer')) return;
  const stage = $('.map-stage');
  $('#mapStatus').textContent = '正在加载高德地图…';
  $('#mapStatus').classList.add('visible');
  try {
    onlineMap = new AMap.Map('amapContainer', {
      zoom: 13,
      center: [108.962, 34.245],
      viewMode: '2D',
      resizeEnable: true,
      mapStyle: 'amap://styles/normal'
    });
    onlineMap.on('complete', () => {
      stage.classList.add('map-online');
      $('#mapStatus').classList.remove('visible');
      routeLine = new AMap.Polyline({
        path: spots.map(spot => [spot.lng, spot.lat]),
        strokeColor: '#c64f38', strokeWeight: 5, strokeStyle: 'dashed',
        strokeOpacity: 0.9, showDir: true, zIndex: 40
      });
      if (routeVisible) routeLine.setMap(onlineMap);
      spots.forEach(spot => {
        const marker = new AMap.Marker({
          position: [spot.lng, spot.lat],
          content: markerHtml(spot, spot.id === currentId),
          offset: new AMap.Pixel(-12, -14),
          title: spot.name
        });
        marker.setMap(onlineMap);
        onlineMarkers[spot.id] = marker;
      });
      onlineMap.on('click', () => { if (!markerClicking) closeCard(); });
    });
    onlineMap.on('error', () => { $('#mapStatus').textContent = '高德地图加载失败，请检查 Key 或网络'; });
    window.setTimeout(() => {
      if (!stage.classList.contains('map-online')) {
        $('#mapStatus').textContent = '高德地图仍在加载，请稍候';
        $('#mapStatus').classList.add('visible');
      }
    }, 7000);
  } catch (error) {
    $('#mapStatus').textContent = `高德地图初始化失败：${error.message || '未知错误'}`;
    $('#mapStatus').classList.add('visible');
    console.error(error);
  }
}

$('#routeToggle').addEventListener('click', () => {
  const path = $('#routePath');
  const hidden = path.classList.toggle('is-hidden');
  routeVisible = !hidden;
  if (routeLine && onlineMap) routeLine.setMap(routeVisible ? onlineMap : null);
  $('#routeToggle').innerHTML = hidden ? '查看完整路线 <span>↗</span>' : '隐藏完整路线 <span>↗</span>';
});
$('#focusCurrent').addEventListener('click', () => selectSpot(currentId, true));
$('#mapCardClose').addEventListener('click', event => { event.stopPropagation(); closeCard(); });
$('#mapCard').addEventListener('click', event => event.stopPropagation());
document.addEventListener('click', event => {
  const marker = event.target.closest('.amap-marker[data-spot-id]');
  if (!marker) return;
  event.stopPropagation();
  markerClicking = true;
  selectSpot(marker.dataset.spotId, true);
  window.setTimeout(() => { markerClicking = false; }, 500);
});
$('#realMap').addEventListener('click', event => {
  if (!event.target.closest('.local-marker') && !event.target.closest('.amap-marker')) closeCard();
});
$('#zoomIn').addEventListener('click', () => { if (onlineMap) onlineMap.zoomIn(); });
$('#zoomOut').addEventListener('click', () => { if (onlineMap) onlineMap.zoomOut(); });

renderMarkers();
renderPeoplePanel();
selectSpot(currentId, false);
if (window.AMap) initOpenMap();
else window.addEventListener('amap-ready', initOpenMap, { once: true });


