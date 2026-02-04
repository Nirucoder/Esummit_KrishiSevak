// Service for interacting with Agromonitoring API (OpenWeather)
// Docs: https://agromonitoring.com/api

const API_KEY = import.meta.env.VITE_AGROMONITORING_API_KEY || '';
const BASE_URL = 'https://api.agromonitoring.com/agro/1.0';

export interface AgroPolygon {
    id: string;
    geo_json: {
        type: string;
        properties: any;
        geometry: {
            type: string;
            coordinates: number[][][];
        };
    };
    name: string;
    center: number[];
    area: number;
}

export interface NDVIStats {
    dt: number;
    type: string;
    dc: number;
    cl: number;
    data: {
        std: number;
        p25: number;
        num: number;
        p75: number;
        max: number;
        mean: number; // This is the average NDVI
        p50: number;
        min: number;
    };
}

export const agroService = {
    /**
     * Create a polygon (field) in Agromonitoring
     * @param name Name of the field
     * @param coordinates Array of [lng, lat] coordinates. First and last must be same.
     */
    async createPolygon(name: string, coordinates: number[][]): Promise<AgroPolygon> {
        try {
            // Ensure the polygon is closed (first point = last point)
            // formatting to 6 decimal places to avoid floating point errors causing 422
            const formattedCoords = coordinates.map(coord => [
                parseFloat(coord[0].toFixed(6)),
                parseFloat(coord[1].toFixed(6))
            ]);

            const closedCoordinates = [...formattedCoords];
            if (
                formattedCoords[0][0] !== formattedCoords[formattedCoords.length - 1][0] ||
                formattedCoords[0][1] !== formattedCoords[formattedCoords.length - 1][1]
            ) {
                closedCoordinates.push(formattedCoords[0]);
            }

            console.log('Creating polygon with coords:', JSON.stringify(closedCoordinates));

            const response = await fetch(`${BASE_URL}/polygons?appid=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    geo_json: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Polygon",
                            coordinates: [closedCoordinates]
                        }
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();

                // Handle Duplicate Polygon Error gracefully
                if (response.status === 422 && errorText.includes('already existed polygon')) {
                    const match = errorText.match(/'([a-f0-9]{24})'/);
                    if (match && match[1]) {
                        console.log('Recovered existing polygon ID:', match[1]);
                        return {
                            id: match[1],
                            name: name,
                            geo_json: {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [closedCoordinates]
                                }
                            },
                            center: [0, 0], // approximation
                            area: 0
                        };
                    }
                }

                console.error('Agro Creation Error Details:', errorText);
                throw new Error(`Failed to create polygon: ${response.statusText} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('AgroService Error:', error);
            throw error;
        }
    },


    /**
     * Get available satellite imagery for a polygon
     */
    async getSatelliteImages(polyId: string, startDate: Date, endDate: Date) {
        const start = Math.floor(startDate.getTime() / 1000);
        const end = Math.floor(endDate.getTime() / 1000);

        const url = `${BASE_URL}/image/search?polyid=${polyId}&start=${start}&end=${end}&appid=${API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const txt = await response.text();
                console.error('Agro Image Search Error:', txt);
                throw new Error('Failed to fetch images');
            }
            return await response.json();
        } catch (error) {
            console.error('AgroService Image Error:', error);
            return [];
        }
    },

    /**
     * Get NDVI stats for a polygon
     */
    async getNDVIStats(polyId: string, startDate: Date, endDate: Date): Promise<NDVIStats[]> {
        const start = Math.floor(startDate.getTime() / 1000);
        const end = Math.floor(endDate.getTime() / 1000);

        // Historical NDVI endpoint
        const url = `${BASE_URL}/ndvi/history?polyid=${polyId}&start=${start}&end=${end}&appid=${API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const txt = await response.text();
                console.error('Agro NDVI Error:', txt);
                throw new Error('Failed to fetch NDVI stats');
            }
            return await response.json();
        } catch (error) {
            console.error('AgroService NDVI Error:', error);
            return [];
        }
    },

    /**
     * Get current weather for a polygon center
     */
    async getCurrentWeather(lat: number, lon: number) {
        // Use Agromonitoring weather endpoint which is included in the plan
        const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const txt = await response.text();
                console.error('Agro Weather Error:', txt);
                throw new Error('Failed to fetch weather');
            }
            return await response.json();
        } catch (error) {
            console.error('AgroService Weather Error:', error);
            return null;
        }
    },

    /**
     * Get the Tile URL for a specific image (for mapping)
     * This returns a URL template that can be used in Leaflet/Mapbox
     */
    getTileUrl(imageUrl: string, layer: 'truecolor' | 'ndvi' | 'falsecolor' = 'truecolor') {
        // Basic helper provided by their docs pattern
        // Usually the image search returns a 'tile' property with the URL.
        // This allows constructing it manually if needed, but it's best to use the API response.
        return `${imageUrl}&layer=${layer}`;
    }
};
