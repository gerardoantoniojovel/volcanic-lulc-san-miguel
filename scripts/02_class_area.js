// ======================================
// Cálculo de área por clase (km²)
// ======================================
function areaByClass(image) {
  var areaImage = ee.Image.pixelArea().divide(1e6);

  var stats = areaImage
    .addBands(image)
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'Clase'
      }),
      geometry: aoi,
      scale: 10,
      maxPixels: 1e13
    });

  return ee.Feature(null, {
    year: image.get('year'),
    areas_km2: stats.get('groups')
  });
}

var areaStats = ee.FeatureCollection(annualDW.map(areaByClass));

print('Área por clase (km²) – Dynamic World:', areaStats);

// ======================================
//  Exportar tabla CSV
// ======================================
Export.table.toDrive({
  collection: areaStats,
  description: 'Area_Uso_Suelo_SanMiguel_2015_2024_DynamicWorld',
  fileFormat: 'CSV'
});
// ======================================
// Gráfica de evolución temporal
// ======================================
var chart = ui.Chart.feature.byFeature({
  features: chartData,
  xProperty: 'year',
  yProperties: ['trees', 'crops', 'built', 'grass', 'shrubs']
})
.setChartType('LineChart')
.setOptions({
  title: 'Land Use Change – San Miguel Volcano (2015–2025)',
   hAxis: {
    title: 'Year',
    titleTextStyle: {
      fontSize: 24,      // Tamaño de fuente
      bold: false,        // Negrita (opcional)
      color: '#333'      // Color (opcional)
    }
  },
  vAxis: {
    title: 'Area (km²)',
    titleTextStyle: {
      fontSize: 24,
      bold: false,
      color: '#333'
    }
  },
  lineWidth: 3,
  pointSize: 5
});

print(chart);
