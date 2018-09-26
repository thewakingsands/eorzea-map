(function () {
  var map, eorzea, loadingArguments, $loading, $mapContainer
  var MARKER_URL = 'https://huiji-public.huijistatic.com/ff14/uploads/e/e6/Map_mark.png'

  window.YZWF = window.YZWF || {}
  window.YZWF.debug = function () {
    loadModules(initMap)
  }
  window.YZWF.loadMap = loadMap

  if ($('#wiki-body .eorzea-map-trigger').length > 0) {
    loadModules(initMap)
    delegateEvents()
  }

  function delegateEvents() {
    $('#wiki-body').on('click', '.eorzea-map-trigger', function () {
      var mapId = $(this).data('map-id')
      var mapX = $(this).data('map-x')
      var mapY = $(this).data('map-y')
      if (map) {
        loadMap(mapId, mapX, mapY)
      } else {
        showLoading($(this), [mapId, mapX, mapY])
      }
    })
  }

  function loadModules(callback) {
    mw.loader.using([
      "ext.gadget.Dom4",
      "ext.gadget.babel-polyfill",
      "ext.gadget.EorzeaMap"
    ], function () {
      callback(window.YZWF.eorzeaMap)
    }, console.error)
  }

  function showLoading($el, mapArugments) {
    if (!$loading) {
      createLoading()
    }
    $loading.find('.eorzea-loading-text').text('正在加载 ' + $el.text() + ' 的地图')
    $loading.appendTo('body')
    loadingArguments = mapArugments
  }

  function createLoading() {
    $loading = $('<div class="eorzea-map-loading"><div class="ff14-loading"></div><div class="eorzea-map-loading-text"></div></div>')

    $loading.click(function () {
      closeLoding()
    })
  }

  function closeLoding() {
    $loading.remove()
    loadingArguments = null
  }

  function initMap(eorzeaMap) {
    eorzea = eorzeaMap
    $mapContainer = $([
      '<section class="erozea-map-outer">',
        '<div class="eorzea-map-glass"></div>',
        '<div class="eorzea-map-move-handler"></div>',
        '<div class="eorzea-map-close-button">关闭</div>',
        '<div class="eorzea-map-inner"></div>',
      '</section>'
    ].join(''))
    if (localStorage && localStorage.YZWFEorzeaMapPos) {
      var pos = localStorage.YZWFEorzeaMapPos.split(',')
      if (pos.length === 2) {
        $mapContainer.css({
          top: pos[0] + 'px',
          left: pos[1] + 'px'
        })
      }
    }
    $mapContainer.find('.eorzea-map-close-button').click(closeMap)
    $mapContainer.appendTo('body')
    mapMover($mapContainer.find('.eorzea-map-move-handler'), $mapContainer)
    eorzeaMap.create($mapContainer.find('.eorzea-map-inner')[0])
    .then(function (mapInstance) {
      $mapContainer.css({
        display: 'none',
        visibility: 'visible'
      })
      map = mapInstance
      window.YZWF.eorzeaMap.map = map
      if (loadingArguments) {
        loadMap.apply(this, loadingArguments)
        closeLoding()
      }
    })
  }

  function loadMap(mapId, x, y) {
    map.loadMapKey(mapId)
    .then(function () {
      var marker = eorzea.simpleMarker(x, y, MARKER_URL, map.mapInfo)
      marker.addTo(map)
      map.currentMarker = marker
    })
    $mapContainer.show()
  }

  function closeMap() {
    if (map.currentMarker) {
      map.currentMarker.remove()
      map.currentMarker = null
    }
    $mapContainer.hide()
  }

  function mapMover($handler, $container) {
    var isDragging = false
    var startX, startY
    $handler.on('mousedown pointerdown touchdown', function (event) {
      event.preventDefault()
      isDragging = true
      startX = event.clientX
      startY = event.clientY
    })
    $(window).on('mousemove pointermove touchmove', function (event) {
      if (!isDragging) {
        return
      }
      event.preventDefault()
      var diffX = event.clientX - startX
      var diffY = event.clientY - startY
      var translate = '(' + diffX + 'px, ' + diffY + 'px, 0)'
      $container.css({
        transform: 'translate3d' + translate
      })
    })
    $(window).on('mouseup pointerup touchup', function (event) {
      if (!isDragging) {
        return
      }
      isDragging = false
      event.preventDefault()
      var pos = $container.position()
      $container.css({
        top: pos.top,
        left: pos.left,
        transform: 'none'
      })
      if (localStorage) {
        localStorage.YZWFEorzeaMapPos = pos.top + ',' + pos.left
      }
    })
  }

})()
