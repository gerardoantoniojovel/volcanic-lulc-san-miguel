# LULC Change Detection at Volcán San Miguel using Google Dynamic World

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-4285F4)](https://earthengine.google.com)
[![Conference](https://img.shields.io/badge/IGARSS-2026-blue)](https://www.igarss2026.org)

Code repository for the paper:

> **[Gerardo Jovel]**. "Land Use/Land Cover Change Detection at Volcán San 
> Miguel Using Google Dynamic World.", [El Salvador], 2026.

---

## Overview

This repository contains Google Earth Engine (GEE) scripts for analyzing 
land use/land cover (LULC) change at Volcán San Miguel, El Salvador, 
for the period 2015–2025. The analysis uses Google Dynamic World as the 
primary classification source, validated against Landsat 8/9 NDVI time series.

**Study area:** Volcán San Miguel, El Salvador (13.43°N, 88.27°W)  
**Period:** 2015–2025  
**Platform:** Google Earth Engine (JavaScript API)

---

## Repository Structure

├── scripts/
│   ├── 01_dynamic_world_analysis.js   # Main LULC change detection
│   └── 02_landsat_ndvi_validation.js  # Cross-validation with Landsat 8/9 NDVI
├── LICENSE
└── README.md

---

## How to Use

1. Create a free [Google Earth Engine account](https://earthengine.google.com/signup/)
2. Open the [GEE Code Editor](https://code.earthengine.google.com)
3. Copy the content of the desired script from the `scripts/` folder
4. Paste it into the Code Editor
5. Click **Run**

> **Note:** No additional dependencies are required. All datasets 
> (Dynamic World, Landsat 8/9) are available natively in GEE.

---

## Scripts Description

### `01_dynamic_world_analysis.js`
Performs LULC change detection using the 
[Google Dynamic World](https://dynamicworld.app) near-real-time dataset. 
Generates land cover maps and quantifies class-level changes across the 
study period.

### `02_landsat_ndvi_validation.js`
Cross-validates Dynamic World tree cover outputs against Landsat 8/9 
surface reflectance NDVI time series. Computes seasonal NDVI composites 
and correlates them with Dynamic World vegetation probability layers.

---

## Datasets Used

| Dataset | Source | Resolution | Period |
|---|---|---|---|
| Dynamic World V1 | Google / World Resources Institute | 10 m | 2016–2024 |
| Landsat 8/9 SR | USGS / NASA | 30 m | 2016–2024 |

---

## Citation

If you use this code, please cite:
[Gerardo Jovel]. "Land Use/Land Cover Change Detection at Volcán San Miguel
Using Google Dynamic World." 

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
