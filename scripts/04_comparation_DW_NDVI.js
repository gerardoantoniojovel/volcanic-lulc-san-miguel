// ------------------------------------------------------------
// OUTPUT 3: COMPARACIÓN VISUAL NDVI vs DYNAMIC WORLD
// Años clave: 2015, 2018, 2020, 2025
// ------------------------------------------------------------

var keyYears = [2015, 2018, 2020, 2025];

// Paleta NDVI
var ndviPalette = ['#d73027','#f46d43','#fdae61','#fee08b',
                   '#d9ef8b','#a6d96a','#66bd63','#1a9850'];

// Paleta Dynamic World (orden oficial de clases)
var dwPalette = ['#419bdf','#397d49','#88b053','#7a87c6',
                 '#e49635','#dfc35a','#c4281b','#a59b8f','#b39fe1'];

keyYears.forEach(function(y) {
  // --- NDVI ---
  var ndviImg = getAnnualComposite(y);
  Map.addLayer(ndviImg, {
    min: 0.1, max: 0.8,
    palette: ndviPalette
  }, 'NDVI ' + y, false);  // false = capa oculta por defecto, actívalas manualmente

  // --- Dynamic World: modo anual temporada seca ---
  var dwStart = (y - 1) + '-11-01';
  var dwEnd   = y       + '-04-30';

  var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
    .filterBounds(aoi)
    .filterDate(dwStart, dwEnd)
    .select('label')
    .reduce(ee.Reducer.mode())
    .clip(aoi);

  Map.addLayer(dw, {
    min: 0, max: 8,
    palette: dwPalette
  }, 'DW_mode ' + y, false);
});

// Centrar mapa en el área de estudio
Map.centerObject(aoi, 12);
Map.setOptions('SATELLITE');
