(function () {
  var map, loadingArguments, $loading, $mapContainer

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
    $mapContainer = $('<section class="erozea-map-outer"><div class="eorzea-map-glass"></div><div class="eorzea-map-inner"></div>')
    $mapContainer.appendTo('body');
    eorzeaMap.create($mapContainer.find('.eorzea-map-inner')[0])
    .then(function (mapInstance) {
      $mapContainer.css({
        display: 'none',
        visibility: 'visible'
      })
      map = mapInstance
      if (loadingArguments) {
        loadMap.apply(this, loadingArguments)
        closeLoding()
      }
    })
  }

  function loadMap(mapId, x, y) {
    map.loadMapKey(mapId)
    $mapContainer.show()
  }

})()
