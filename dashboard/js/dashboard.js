let markers = L.layerGroup()
let mbAttr = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
let map = {}
let layerControl = {}
let allData = {}
const zoom = 5
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
  showProvinciaInfo(f,l) {
    l.on({
      click: () => {
        console.log(_.groupBy(allData, 'PROVINCENAME'))
      }
    })
  },
  createProductList() {
    return _.groupBy(allData, 'PROVINCENAME')
  }
}

