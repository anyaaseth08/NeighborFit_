interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  countryName: string;
  adminName1: string;
  population: number;
}

interface GeoNamesResponse {
  geonames: Array<{
    lat: string;
    lng: string;
    name: string;
    countryName: string;
    adminName1: string;
    population: number;
  }>;
}

class GeoService {
  private readonly baseUrl = import.meta.env.VITE_GEONAMES_API_URL || 'http://api.geonames.org';
  private readonly username = import.meta.env.VITE_GEONAMES_USERNAME || 'demo';
  private readonly useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  private readonly timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '5000');
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  async searchPlaces(query: string, country = 'IN'): Promise<GeoLocation[]> {
    const cacheKey = `search_${query}_${country}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Use mock data if configured or as fallback
    if (this.useMockData) {
      return this.getFallbackLocations(query);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}/searchJSON?q=${encodeURIComponent(query)}&country=${country}&maxRows=10&username=${this.username}`;
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status} ${response.statusText}`);
      }

      const data: GeoNamesResponse = await response.json();
      
      if (!data.geonames || !Array.isArray(data.geonames)) {
        throw new Error('Invalid response format from GeoNames API');
      }

      const locations: GeoLocation[] = data.geonames.map(item => ({
        lat: parseFloat(item.lat) || 0,
        lng: parseFloat(item.lng) || 0,
        name: item.name || 'Unknown',
        countryName: item.countryName || 'Unknown',
        adminName1: item.adminName1 || 'Unknown',
        population: item.population || 0
      })).filter(location => location.lat !== 0 && location.lng !== 0);

      this.setCachedData(cacheKey, locations);
      return locations;
    } catch (error) {
      console.warn('GeoNames API error, using fallback data:', error);
      return this.getFallbackLocations(query);
    }
  }

  async getNearbyPlaces(lat: number, lng: number, radius = 10): Promise<GeoLocation[]> {
    const cacheKey = `nearby_${lat}_${lng}_${radius}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.useMockData) {
      return this.getFallbackNearbyPlaces(lat, lng);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&radius=${radius}&maxRows=20&username=${this.username}`;
      const response = await fetch(url, { signal: controller.signal });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GeoNames API error: ${response.status}`);
      }

      const data: GeoNamesResponse = await response.json();
      
      if (!data.geonames || !Array.isArray(data.geonames)) {
        return this.getFallbackNearbyPlaces(lat, lng);
      }

      const locations: GeoLocation[] = data.geonames.map(item => ({
        lat: parseFloat(item.lat) || 0,
        lng: parseFloat(item.lng) || 0,
        name: item.name || 'Unknown',
        countryName: item.countryName || 'Unknown',
        adminName1: item.adminName1 || 'Unknown',
        population: item.population || 0
      })).filter(location => location.lat !== 0 && location.lng !== 0);

      this.setCachedData(cacheKey, locations);
      return locations;
    } catch (error) {
      console.warn('GeoNames nearby API error, using fallback:', error);
      return this.getFallbackNearbyPlaces(lat, lng);
    }
  }

  private getCachedData(key: string): any | null {
    try {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    } catch (error) {
      console.warn('Cache retrieval error:', error);
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    try {
      this.cache.set(key, { data, timestamp: Date.now() });
    } catch (error) {
      console.warn('Cache storage error:', error);
    }
  }

  private getFallbackLocations(query: string): GeoLocation[] {
    const fallbackData: Record<string, GeoLocation[]> = {
      'koramangala': [{
        lat: 12.9352, lng: 77.6245, name: 'Koramangala', countryName: 'India', 
        adminName1: 'Karnataka', population: 85000
      }],
      'bandra': [{
        lat: 19.0596, lng: 72.8295, name: 'Bandra West', countryName: 'India', 
        adminName1: 'Maharashtra', population: 120000
      }],
      'powai': [{
        lat: 19.1176, lng: 72.9060, name: 'Powai', countryName: 'India', 
        adminName1: 'Maharashtra', population: 110000
      }],
      'connaught place': [{
        lat: 28.6315, lng: 77.2167, name: 'Connaught Place', countryName: 'India', 
        adminName1: 'Delhi', population: 95000
      }],
      'cyber city': [{
        lat: 28.4595, lng: 77.0266, name: 'Cyber City', countryName: 'India', 
        adminName1: 'Haryana', population: 150000
      }],
      'sector 62': [{
        lat: 28.6139, lng: 77.3910, name: 'Sector 62', countryName: 'India', 
        adminName1: 'Uttar Pradesh', population: 125000
      }],
      'bangalore': [{
        lat: 12.9716, lng: 77.5946, name: 'Bangalore', countryName: 'India', 
        adminName1: 'Karnataka', population: 8443675
      }],
      'mumbai': [{
        lat: 19.0760, lng: 72.8777, name: 'Mumbai', countryName: 'India', 
        adminName1: 'Maharashtra', population: 12442373
      }],
      'delhi': [{
        lat: 28.6139, lng: 77.2090, name: 'Delhi', countryName: 'India', 
        adminName1: 'Delhi', population: 16787941
      }],
      'gurgaon': [{
        lat: 28.4595, lng: 77.0266, name: 'Gurgaon', countryName: 'India', 
        adminName1: 'Haryana', population: 876969
      }],
      'noida': [{
        lat: 28.5355, lng: 77.3910, name: 'Noida', countryName: 'India', 
        adminName1: 'Uttar Pradesh', population: 642381
      }]
    };

    const searchKey = query.toLowerCase();
    return fallbackData[searchKey] || fallbackData[Object.keys(fallbackData).find(key => key.includes(searchKey)) || ''] || [];
  }

  private getFallbackNearbyPlaces(lat: number, lng: number): GeoLocation[] {
    // Generate mock nearby places based on coordinates
    const nearbyPlaces: GeoLocation[] = [
      {
        lat: lat + 0.01, lng: lng + 0.01, name: 'Local Market', 
        countryName: 'India', adminName1: 'Local State', population: 5000
      },
      {
        lat: lat - 0.01, lng: lng - 0.01, name: 'Community Center', 
        countryName: 'India', adminName1: 'Local State', population: 2000
      },
      {
        lat: lat + 0.005, lng: lng - 0.005, name: 'Shopping Complex', 
        countryName: 'India', adminName1: 'Local State', population: 8000
      }
    ];

    return nearbyPlaces;
  }
}

export const geoService = new GeoService();