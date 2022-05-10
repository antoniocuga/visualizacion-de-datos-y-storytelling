
Highcharts.chart('container', {
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
    categories: [
      'Alianza - Blanquiazul',
      'Alianza Lima - Azul',
      'Alianza Lima - Blanca',
      'Bear',
      'Black',
      'Blue',
      'Camo',
      'Condor',
      'Escudo',
      'Forest',
      'LightBlue',
      'Pack 1',
      'Pack 2',
      'Pack 3',
      'Tie Dye',
    ],
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
series: [{
    name: 'Cantidad',
    data: [5572,
      4480,
      1701,
      568,
      1743,
      1228,
      121,
      78,
      882,
      652,
      767,
      3164,
      1221,
      535,
      797]

  }, {
    name: 'Total S/.',
    data: [
      237443.2744,
      178838.8825,
      60482.3734,
      21428.0084,
      80232.8173,
      57597.1977,
      5096.81,
      3718.0232,
      31587.5235,
      22332.0251,
      30623.4815,
      220949.3393,
      76378.1861,
      32113.4571,
      26862.6496
    ]
  }]
})