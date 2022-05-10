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
    this.renderMap()
    this.loadProvincias()
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
  createProductList() {
    return _.groupBy(allData, 'PROVINCENAME')
  },

  showProvinciaInfo(provincia,layer) {
    const $this = this
    layer.on({
      click: () => {

        const dataProvincia = _.filter(allData, ['PROVINCENAME', provincia.properties.NOMBPROV])

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



      }
    })
  }
}

