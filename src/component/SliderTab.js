import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import mapboxglCompare from 'mapbox-gl-compare'; // Importing the compare plugin

import 'mapbox-gl/dist/mapbox-gl.css'; // Ensure Mapbox GL CSS is imported
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css'; // Import the Compare plugin CSS

// Extending mapboxgl to add Compare class
mapboxgl.Compare = mapboxglCompare;

const MapboxExample = () => {
  const [selectedLayers, setSelectedLayers] = useState([ // Keep track of selected layers
    'mapbox://styles/sagar2501/cmbafzhf7009101si0gwfcxhu', // Default layers
    'mapbox://styles/sagar2501/cmbalx3bl000101s74xqe6tmm'
  ]);
  const [leftLayerName, setLeftLayerName] = useState('LowDens: 1 HighDens: 5'); // Left layer name
  const [rightLayerName, setRightLayerName] = useState('LowDens: 1 HighDens: 6'); // Right layer name

  const beforeMapContainerRef = useRef(null); // Ref for 'before' map container
  const afterMapContainerRef = useRef(null);  // Ref for 'after' map container
  const comparisonContainerRef = useRef(null); // Ref for the comparison container
  const beforeMapRef = useRef(null); // Ref to store the before map instance
  const afterMapRef = useRef(null);  // Ref to store the after map instance

  const mapStyle = { position: 'absolute', top: 0, bottom: 0, width: '100%' };

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Check if the map containers are initialized
    if (!beforeMapContainerRef.current || !afterMapContainerRef.current) return;

    // Initialize the before and after maps
    const beforeMap = new mapboxgl.Map({
      container: beforeMapContainerRef.current,
      style: selectedLayers[0],
      center: [-88.0805422, 41.9320578],
      zoom: 7,
    });

    const afterMap = new mapboxgl.Map({
      container: afterMapContainerRef.current,
      style: selectedLayers[1],
      center: [-88.0805422, 41.9320578],
      zoom: 7,
    });

    // Store map instances for future updates
    beforeMapRef.current = beforeMap;
    afterMapRef.current = afterMap;

    // Initialize the comparison functionality
    new mapboxgl.Compare(beforeMap, afterMap, comparisonContainerRef.current);

    // Cleanup function to remove maps when component unmounts
    // return () => {
    //   beforeMap.remove();
    //   afterMap.remove();
    // };
  }, []); // Empty dependency array ensures this effect runs only once

  // const handleCheckboxChange = (event) => {
  //   const { value, checked } = event.target;

  //   let updatedSelectedLayers = [...selectedLayers];

  //   if (checked) {
  //     if (updatedSelectedLayers.length < 2) {
  //       updatedSelectedLayers.push(value);
  //     }
  //   } else {
  //     updatedSelectedLayers = updatedSelectedLayers.filter((layer) => layer !== value);
  //   }

  //   if (updatedSelectedLayers.length <= 2) {
  //     setSelectedLayers(updatedSelectedLayers);

  //     if (updatedSelectedLayers.length === 2) {
  //       // Update the layers dynamically without re-rendering the whole map
  //       const [styleA, styleB] = updatedSelectedLayers;

  //       const layerNames = {
  //         [styleA]: 'LowDens: 1 HighDens: 5',
  //         [styleB]: 'LowDens: 1 HighDens: 6',
  //         'mapbox://styles/sagar2501/cmbanx5p5000801r0hozw2h1h': 'LowDens: 2 HighDens: 5',
  //         'mapbox://styles/sagar2501/cmbapqt30000e01sc8pks858e': 'LowDens: 2 HighDens: 6',
  //         'mapbox://styles/sagar2501/cmbar8ais000i01s5828od69m': 'LowDens: 3 HighDens: 5',
  //         'mapbox://styles/sagar2501/cmbas8p7v000p01sdbhj83yqc': 'LowDens: 3 HighDens: 6',
  //       };

  //       setLeftLayerName(layerNames[styleA] || '');
  //       setRightLayerName(layerNames[styleB] || '');

  //       // Update the map layers without reinitializing the map
  //       const beforeMap = beforeMapRef.current;
  //       const afterMap = afterMapRef.current;
  //       if (beforeMap && afterMap) {
  //         beforeMap.setStyle(styleA); // Set style dynamically for the 'before' map
  //         afterMap.setStyle(styleB); // Set style dynamically for the 'after' map
  //       }
  //     }
  //   }
  // };

const handleCheckboxChange = (event) => {
  const { value, checked } = event.target;

  let updatedSelectedLayers = [...selectedLayers];

  if (checked) {
    // If fewer than two layers are selected, just add the new one
    if (updatedSelectedLayers.length < 2) {
      updatedSelectedLayers.push(value);
    }
    // If two layers are already selected, replace the **first selected layer** with the new one
    else if (updatedSelectedLayers.length === 2) {
      updatedSelectedLayers[0] = value; // Replace the first selected layer (not the second)
    }
  } else {
    // If the checkbox is unchecked, remove the layer from the selected layers
    updatedSelectedLayers = updatedSelectedLayers.filter((layer) => layer !== value);
  }

  // Update the state with the new selected layers
  setSelectedLayers(updatedSelectedLayers);

  // Update the map layers if there are exactly 2 selected layers
  if (updatedSelectedLayers.length === 2) {
    const [styleA, styleB] = updatedSelectedLayers;

    // Update the layer names based on the selected styles
    const layerNames = {
      [styleA]: 'LowDens: 1 HighDens: 5',
      [styleB]: 'LowDens: 1 HighDens: 6',
      'mapbox://styles/sagar2501/cmbanx5p5000801r0hozw2h1h': 'LowDens: 2 HighDens: 5',
      'mapbox://styles/sagar2501/cmbapqt30000e01sc8pks858e': 'LowDens: 2 HighDens: 6',
      'mapbox://styles/sagar2501/cmbar8ais000i01s5828od69m': 'LowDens: 3 HighDens: 5',
      'mapbox://styles/sagar2501/cmbas8p7v000p01sdbhj83yqc': 'LowDens: 3 HighDens: 6',
    };

    setLeftLayerName(layerNames[styleA] || '');
    setRightLayerName(layerNames[styleB] || '');

    // Update the map layers dynamically without reinitializing the map
    const beforeMap = beforeMapRef.current;
    const afterMap = afterMapRef.current;
    if (beforeMap && afterMap) {
      beforeMap.setStyle(styleA); // Set style dynamically for the 'before' map
      afterMap.setStyle(styleB); // Set style dynamically for the 'after' map
    }
  }
};



  return (
    <div>
      {/* Comparison maps */}
      <div
        id="comparison-container"
        ref={comparisonContainerRef}
        style={{ height: '100vh', position: 'relative' }}
      >
        {/* 'Before' map container */}
        <div
          id="before"
          ref={beforeMapContainerRef}
          style={{ ...mapStyle }}
        ></div>

        {/* 'After' map container */}
        <div
          id="after"
          ref={afterMapContainerRef}
          style={{ ...mapStyle }}
        ></div>
      </div>

      {/* Selected layer names below the navbar */}
      <div
        style={{
          position: 'absolute',
          top: '70px',  // Space below the navbar
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '5px',
          borderRadius: '5px',
        }}
      >
        <h3>{leftLayerName} vs {rightLayerName}</h3>
      </div>

      {/* Multi-select checkbox in the bottom right corner */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          zIndex: '999',
        }}
      >
        <h3>Select Two Sub-blocks Layers</h3>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 1 HighDens: 5"
            value="mapbox://styles/sagar2501/cmbafzhf7009101si0gwfcxhu"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbafzhf7009101si0gwfcxhu')}
            onChange={handleCheckboxChange}
          />
          LowDens: 1 HighDens: 5
        </label>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 1 HighDens: 6"
            value="mapbox://styles/sagar2501/cmbalx3bl000101s74xqe6tmm"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbalx3bl000101s74xqe6tmm')}
            onChange={handleCheckboxChange}
          />
          LowDens: 1 HighDens: 6
        </label>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 2 HighDens: 5"
            value="mapbox://styles/sagar2501/cmbanx5p5000801r0hozw2h1h"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbanx5p5000801r0hozw2h1h')}
            onChange={handleCheckboxChange}
          />
          LowDens: 2 HighDens: 5
        </label>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 2 HighDens: 6"
            value="mapbox://styles/sagar2501/cmbapqt30000e01sc8pks858e"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbapqt30000e01sc8pks858e')}
            onChange={handleCheckboxChange}
          />
          LowDens: 2 HighDens: 6
        </label>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 3 HighDens: 5"
            value="mapbox://styles/sagar2501/cmbar8ais000i01s5828od69m"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbar8ais000i01s5828od69m')}
            onChange={handleCheckboxChange}
          />
          LowDens: 3 HighDens: 5
        </label>
        <label>
          <input
            type="checkbox"
            className="style-checkbox"
            data-name="LowDens: 3 HighDens: 6"
            value="mapbox://styles/sagar2501/cmbas8p7v000p01sdbhj83yqc"
            checked={selectedLayers.includes('mapbox://styles/sagar2501/cmbas8p7v000p01sdbhj83yqc')}
            onChange={handleCheckboxChange}
          />
          LowDens: 3 HighDens: 6
        </label>
      </div>
    </div>
  );
};

export default MapboxExample;
