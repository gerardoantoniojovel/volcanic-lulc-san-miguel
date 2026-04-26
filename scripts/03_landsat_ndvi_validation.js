// ============================================================
// ANÁLISIS NDVI LANDSAT 8/9 - VOLCÁN SAN MIGUEL 2015-2025
// Validación cruzada con Dynamic World
// ============================================================
// INSTRUCCIÓN: Renombra tu geometry dibujada a mano como
// "aoi" en el panel de imports de GEE antes de correr esto.
// ============================================================

var years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// ------------------------------------------------------------
// FUNCIONES BASE
// ------------------------------------------------------------

// Máscara de nubes para Landsat Collection 2 Surface Reflectance
function maskL8clouds(image) {
  var qa = image.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)  // nube
               .and(qa.bitwiseAnd(1 << 4).eq(0));  // sombra de nube
  return image.updateMask(mask)
              .multiply(0.0000275).add(-0.2)  // factor de escala C2
              .copyProperties(image, ['system:time_start']);
}

// Calcular NDVI
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// Compuesto anual temporada seca (Nov año-1 a Abr año)
// Justificación: minimiza cobertura nubosa en El Salvador volcánico
function getAnnualComposite(year) {
  var start = (year - 1) + '-11-01';
  var end   = year       + '-04-30';

  // Landsat 8 (operativo desde 2013)
  var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(aoi)
    .filterDate(start, end)
    .map(maskL8clouds)
    .map(addNDVI);

  // Landsat 9 (operativo desde Oct 2021, mismos parámetros)
  var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
    .filterBounds(aoi)
    .filterDate(start, end)
    .map(maskL8clouds)
    .map(addNDVI);

  // Fusionar L8 y L9, mediana como reductor (más robusto que media ante outliers)
  var composite = l8.merge(l9)
    .select('NDVI')
    .median()
    .clip(aoi);

  return composite.set('year', year).set('system:time_start', ee.Date(year + '-03-01').millis());
}

// ------------------------------------------------------------
// GENERAR COMPUESTOS NDVI POR AÑO
// ------------------------------------------------------------

var composites = ee.ImageCollection(years.map(function(y) {
  return getAnnualComposite(y);
}));

// ------------------------------------------------------------
// OUTPUT 1: ESTADÍSTICAS NUMÉRICAS (mean NDVI por año)
// ------------------------------------------------------------

var ndviStats = years.map(function(y) {
  var img = getAnnualComposite(y);
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean()
              .combine(ee.Reducer.stdDev(), null, true)
              .combine(ee.Reducer.percentile([25, 75]), null, true),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e10,
    bestEffort: true
  });
  return ee.Feature(null, {
    'year': y,
    'NDVI_mean':   stats.get('NDVI_mean'),
    'NDVI_stdDev': stats.get('NDVI_stdDev'),
    'NDVI_p25':    stats.get('NDVI_p25'),
    'NDVI_p75':    stats.get('NDVI_p75')
  });
});

var ndviTable = ee.FeatureCollection(ndviStats);

// Exportar tabla a Drive (CSV listo para tu paper)
Export.table.toDrive({
  collection: ndviTable,
  description: 'NDVI_SanMiguel_2015_2025_stats',
  fileFormat: 'CSV'
});

print('Estadísticas NDVI por año:', ndviTable);

// ------------------------------------------------------------
// OUTPUT 2: GRÁFICA NDVI TEMPORAL EN GEE
// ------------------------------------------------------------

var chart = ui.Chart.feature.byFeature({
  features: ndviTable,
  xProperty: 'year',
  yProperties: ['NDVI_mean']
})
.setChartType('LineChart')
.setOptions({
  title: 'Mean NDVI - San Miguel Volcano (2015-2025)\nLandsat 8/9 Dry Season Composites',
  hAxis: {
    title: 'Year',
    ticks: years.map(function(y){ return {v: y, f: String(y)}; })
  },
  vAxis: {
    title: 'Mean NDVI',
    minValue: 0.2,
    maxValue: 0.8
  },
  series: {
    0: {color: '#2d6a4f', lineWidth: 2, pointSize: 5}
  },
  // Línea de referencia visual para el período El Niño
  annotations: {
    domain: {style: 'line', color: '#d62728'}
  },
  backgroundColor: '#ffffff',
  legend: {position: 'bottom'}
});

print(chart);

// ------------------------------------------------------------
// EXPORTAR MAPAS NDVI A DRIVE (años clave)
// ------------------------------------------------------------

keyYears.forEach(function(y) {
  var ndviImg = getAnnualComposite(y);
  Export.image.toDrive({
    image: ndviImg.visualize({
      min: 0.1, max: 0.8,
      palette: ndviPalette
    }),
    description: 'NDVI_SanMiguel_' + y,
    folder: 'GEE_SanMiguel',
    scale: 30,
    region: aoi,
    maxPixels: 1e10,
    fileFormat: 'GeoTIFF'
  });
});

print('✓ Exports encolados. Ve a Tasks > Run para ejecutarlos.');
print('✓ Capas en el mapa: actívalas por año en el panel de capas.');
