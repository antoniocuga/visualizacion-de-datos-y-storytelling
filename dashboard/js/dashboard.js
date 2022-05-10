let markers = L.layerGroup()
let mbAttr = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
let map = {}
let layerControl = {}
let allData = {}
const zoom = 8
const center = [-12.002221182006943, -77.00519605326208]

const visualizacionMapa = {
  init() {
    this.loadData()
    // this.renderMap()
    // this.loadProvincias()

    setTimeout(() => {
      visualizacionMapa.createListProductos()
    }, 1500)
  },
  renderMap() {
    let streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr})

    map = L.map('map', {
      center: center,
      zoom: zoom,
      layers: [streets, markers]
    })
  },
  loadData() {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', 'data/ventas.json', true)
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          allData = JSON.parse(xmlhttp.responseText)
        }
      }
    }
    xmlhttp.send(null)
  },
  loadProvincias() {
    var jsonTest = new L.GeoJSON.AJAX(["data/provincias.geojson"],{onEachFeature:this.showProvinciaInfo}).addTo(map)
  },
  createListProductos() {

    let list  = document.querySelector('.product-list')

    let listContent = ``

    _.map(_.groupBy(allData, 'PROVINCENAME'), (producto, provincia) => {
      const productoItem = {
        "provincia": provincia,
        "cantidad": provincia.length
      }

      listContent += `<li><a class="dropdown-item" href="#" onclick="visualizacionMapa.cargarGrafico('${productoItem.provincia}')">${productoItem.provincia} (${productoItem.cantidad})</a></li>`
    })

    list.innerHTML = listContent

  },
  showProvinciaInfo(provincia,layer) {
    const $this = this
    layer.on({
      click: () => {

        visualizacionMapa.cargarBarras(provincia.properties.NOMBPROV)
        visualizacionMapa.cargarPie(provincia.properties.NOMBPROV)

      }
    })
  },
  cargarGrafico(provincia) {
    visualizacionMapa.cargarBarras(provincia)
    visualizacionMapa.cargarPie(provincia)
    visualizacionMapa.cargarHistogram(provincia)
  },
  cargarBarras(nombreProvincia) {

    const dataProvincia = _.filter(allData, ['PROVINCENAME', nombreProvincia])

    const cantidadProductos = _.map(_.groupBy(dataProvincia, 'SKU_NAME'), provincia => {
      return provincia.length
    })

    const totalProductos = _.map(_.groupBy(dataProvincia, 'SKU_NAME'), provincia => {
      return _.sumBy(provincia, 'TOTALPAID')
    })

    Highcharts.chart('totalProductos', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Reporte de ventas'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
        categories: _.uniq(_.map(dataProvincia, 'SKU_NAME')),
        crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cantidad / Total S/.'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
      },
      series: [
        {
          name: 'Cantidad',
          data: cantidadProductos
        },
        {
          name: 'Total S/.',
          data: totalProductos
      }]
    })

  },
  cargarPie(nombreProvincia) {

    const dataProvincia = _.filter(allData, ['PROVINCENAME', nombreProvincia])

    const cantidadProductos = _.map(_.groupBy(dataProvincia, 'SKU_NAME'), (items, producto) => {
      return {
        name: producto,
        y: _.sumBy(items, 'TOTALPAID'),
        sliced: true,
        selected: true
      }
    })

    Highcharts.chart('totalProductosPie', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Total de ventas por productoist'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
        name: 'Productos vendidos',
        colorByPoint: true,
        data: cantidadProductos
      }]
  });

  },
  cargarHistogram(nombreProvincia) {

    const dataProvincia = _.filter(allData, ['PROVINCENAME', nombreProvincia])

    const meses = _.uniq(_.map(dataProvincia, 'MONTHNUM'))
    
    const productosMes = _.map(_.groupBy(dataProvincia, 'MONTHNUM'), (items) => {
      return items.length
    })


    Highcharts.chart('histogramProductos', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Ventas de productos por mes'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: (meses).sort(),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} productos vendidos</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false
        }
      },
      series: [{
        name: 'Data',
        data: productosMes
    
      }]
    });
    
  }
}

