import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './HomeTab.css'; // In HomeTab.js

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FnYXIyNTAxIiwiYSI6ImNtN25jeTNvczBveWUyanNkYnNmYXA3ZHIifQ.rP7zcXwAMsBwTJbp9biAow';

const HomeTab = () => {
    // Initialize the selectedLayer with the first subblock by default
    const [selectedLayer, setSelectedLayer] = useState('map1'); // Default state is map1 (first subblock)
    const homeMapRef = useRef(null); // To keep reference of the map instance

    // Subblocks data (different map layers)
    const subblocks = [
        { id: 'map1', label: 'LowDens: 1 HighDens: 5', styleId: 'cmbafzhf7009101si0gwfcxhu' },
        { id: 'map2', label: 'LowDens: 1 HighDens: 6', styleId: 'cmbalx3bl000101s74xqe6tmm' },
        { id: 'map3', label: 'LowDens: 2 HighDens: 5', styleId: 'cmbanx5p5000801r0hozw2h1h' },
        { id: 'map4', label: 'LowDens: 2 HighDens: 6', styleId: 'cmbapqt30000e01sc8pks858e' },
        { id: 'map5', label: 'LowDens: 3 HighDens: 5', styleId: 'cmbar8ais000i01s5828od69m' },
        { id: 'map6', label: 'LowDens: 3 HighDens: 6', styleId: 'cmbas8p7v000p01sdbhj83yqc' },
    ];

    const subblocks_map = {
        'map1': { label: 'LowDens: 1 HighDens: 5', styleId: 'cmbafzhf7009101si0gwfcxhu' },
        'map2': { label: 'LowDens: 1 HighDens: 6', styleId: 'cmbalx3bl000101s74xqe6tmm' },
        'map3': { label: 'LowDens: 2 HighDens: 5', styleId: 'cmbanx5p5000801r0hozw2h1h' },
        'map4': { label: 'LowDens: 2 HighDens: 6', styleId: 'cmbapqt30000e01sc8pks858e' },
        'map5': { label: 'LowDens: 3 HighDens: 5', styleId: 'cmbar8ais000i01s5828od69m' },
        'map6': { label: 'LowDens: 3 HighDens: 6', styleId: 'cmbas8p7v000p01sdbhj83yqc' },
    }


    useEffect(() => {
        // Initialize the homeMap instance only once
        const homeMap = new mapboxgl.Map({
            container: 'map', // Ensure only one map container is used here
            style: 'mapbox://styles/sagar2501/cmbq6g56s00wi01sdhiapgi2a',
            center: [-88.0805422, 41.9320578],
            zoom: 7,
        });

        homeMapRef.current = homeMap; // Assign map instance to the ref

        // Add sources and layers to the map once it's fully loaded
        homeMap.on('load', () => {
            subblocks.forEach((sb) => {
                homeMap.addSource(sb.id, {
                    type: 'raster',
                    tiles: [
                        `https://api.mapbox.com/styles/v1/sagar2501/${sb.styleId}/tiles/256/{z}/{x}/{y}?access_token=${mapboxgl.accessToken}`,
                    ],
                    tileSize: 256,
                });

                // Add layers to the map, initially set to 'none' visibility
                homeMap.addLayer({
                    id: sb.id,
                    type: 'raster',
                    source: sb.id,
                    layout: { visibility: 'none' }, // All layers are initially hidden
                });
            });

            // Initially show the default layer (map1)
            homeMap.setLayoutProperty(subblocks[0].id, 'visibility', 'visible'); // Show default layer
        });

        return () => {
            // Clean up map on component unmount
            homeMap.remove();
        };
    }, []); // Only run this effect once

    // Handle checkbox changes
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedLayer(value); // Set the selected layer
        } else {
            setSelectedLayer(''); // Unselect if the checkbox is unchecked
        }
    };

    useEffect(() => {
        // Whenever selectedLayer changes, we update the visibility of the layers
        if (homeMapRef.current && selectedLayer) {
            const homeMap = homeMapRef.current;

            // Hide all layers first
            subblocks.forEach((sb) => {
                if (homeMap.getLayer(sb.id)) {
                    homeMap.setLayoutProperty(sb.id, 'visibility', 'none'); // Hide the layer
                }
            });

            // Hide the default layer (if it's not selected)
            // if (homeMap.getLayer('map1') && selectedLayer !== 'map1') {
            //     homeMap.setLayoutProperty('map1', 'visibility', 'none'); // Hide default layer
            // }

            // Show the selected layer
            if (homeMap.getLayer(selectedLayer)) {
                homeMap.setLayoutProperty(selectedLayer, 'visibility', 'visible'); // Show the selected layer
            }

            setTimeout(() => {
                const all_layers = homeMapRef.current.getStyle().layers;
                console.log(all_layers)
            }, 1000)

        }
    }, [selectedLayer]); // This runs when the selectedLayer changes

    return (
        <div>
            {/* Fullscreen map */}
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>

            {/* Multi-select checkbox in the bottom right corner */}
            <div

                style={{
                    position: 'absolute', // Absolute positioning
                    bottom: '20px', // Distance from the bottom of the container
                    right: '20px', // Distance from the right of the container
                    background: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    zIndex: 999, // Ensure it's above the map
                }}
            >
                <h3>Select a Sub-block Layer</h3>
                {subblocks.map((sb) => (
                    <label key={sb.id}>
                        <input
                            type="checkbox"
                            className="style-checkbox"
                            data-name={sb.label}
                            value={sb.id}
                            checked={selectedLayer === sb.id}
                            onChange={handleCheckboxChange}
                        />
                        {sb.label}
                    </label>
                ))}
            </div>

        </div>
    );
};

export default HomeTab;
