(function () {
  var map, loadingArguments, $loading, $mapContainer

  window.YZWF = {
    debug: function () {
      loadModules(initMap)
    },
    loadMap: loadMap
  }

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
    $loading = $('<div><div class="ff14-loading"></div><div class="eorzea-loading-text"></div></div>')
    $loading.find('.eorzea-loading-text').css({
      flex: 1,
      margin: '10px',
      textAlign: 'center'
    })
    $loading.find('.ff14-loading').css({
      margin: '10px'
    })
    $loading.css({
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: '300px',
      height: '80px',
      marginLeft: '-150px',
      marginTop: '-40px',
      background: '#262626',
      color: '#ccc',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      border: '1px solid #b9a465',
      borderRadius: '5px',
      boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)'
    })
    
    $loading.click(function () {
      closeLoding()
    })
  }
  
  function closeLoding() {
    $loading.remove()
    loadingArguments = null
  }
  
  function initMap(eorzeaMap) {
    $mapContainer = $('<section class="map"><div>')
    $mapContainer.css({
      visibility: 'hidden',
      position: 'fixed',
      height: '500px',
      width: '500px',
      position: 'absolute'
    })
    $mapContainer.hide().appendTo('body');
    eorzeaMap.create($mapContainer.find('div')[0])
    .then(function (mapInstance) {
      map = mapInstance
      if (loadingArguments) {
        loadMap.apply(this, loadingArguments)
        closeLoding()
      }
    });
  }
  
  function loadMap(mapId, x, y) {
    map.loadMapKey(92)
    $mapContainer.show()
  }
  
})()
