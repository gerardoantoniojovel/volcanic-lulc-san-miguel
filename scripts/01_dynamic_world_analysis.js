/************************************************
 * USO DE SUELO – DYNAMIC WORLD
 * Volcán de San Miguel, El Salvador
 * Periodo: 2015–2025
 ************************************************/

// ======================================
// 1. Área de estudio
// ======================================
var aoi = geometry;
Map.centerObject(aoi, 11);
Map.addLayer(aoi, {color: 'red'}, 'Área de estudio');

// ======================================
// 2. Colección Dynamic World
// ======================================
var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
  .filterBounds(aoi)
  .filterDate('2015-01-01', '2025-12-31');

// ======================================
// 3. Función para crear mapa anual (MODA)
// ======================================
function yearlyDW(year) {
  year = ee.Number(year);
  var start = ee.Date.fromYMD(year, 1, 1);
  var end = start.advance(1, 'year');

  var image = dw
    .filterDate(start, end)
    .select('label')
    .mode()
    .clip(aoi)
    .set('year', year);

  return image;
}

// ======================================
// 4. Crear colección anual
// ======================================
var years = ee.List.sequence(2015, 2025);
var annualDW = ee.ImageCollection(years.map(yearlyDW));

// ======================================
// 5. Visualización
// ======================================
// Clases Dynamic World:
// 0 Agua
// 1 Árboles
// 2 Pasto
// 3 Vegetación inundada
// 4 Cultivos
// 5 Arbustos
// 6 Construido
// 7 Suelo desnudo
// 8 Nieve/hielo (no aplica)

var palette = [
  '#419BDF', // Agua
  '#397D49', // Árboles
  '#88B053', // Pasto
  '#7A87C6', // Veg. inundada
  '#E49635', // Cultivos
  '#DFC35A', // Arbustos
  '#C4281B', // Construido
  '#A59B8F', // Suelo desnudo
  '#B39FE1'  // Nieve
];

// Mapas clave
var map2015 = annualDW.filter(ee.Filter.eq('year', 2015)).first();
var map2025 = annualDW.filter(ee.Filter.eq('year', 2025)).first();

Map.addLayer(map2015, {min: 0, max: 8, palette: palette}, 'Uso de suelo 2015');
Map.addLayer(map2025, {min: 0, max: 8, palette: palette}, 'Uso de suelo 2025');

// Exportar mapa, cambiar fecha
// ======================================
Export.image.toDrive({
  image: map2025,
  description: 'Uso_Suelo_SanMiguel_2025_DynamicWorld',
  region: aoi,
  scale: 10,
  maxPixels: 1e13
});
