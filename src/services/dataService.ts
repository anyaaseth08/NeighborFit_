// Data service for external API integration and data processing
export interface RealEstateData {
  averageRent: number;
  pricePerSqFt: number;
  marketTrend: 'rising' | 'stable' | 'falling';
  availability: number;
}

export interface CrimeData {
  crimeRate: number;
  safetyScore: number;
  recentIncidents: number;
}

export interface TransitData {
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  nearbyStations: string[];
}

export interface SchoolData {
  averageRating: number;
  topSchools: string[];
  studentTeacherRatio: number;
}

export interface ExternalNeighborhoodData {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  realEstate: RealEstateData;
  crime: CrimeData;
  transit: TransitData;
  schools: SchoolData;
  demographics: {
    population: number;
    medianAge: number;
    medianIncome: number;
    diversityIndex: number;
  };
  amenities: {
    restaurants: number;
    shopping: number;
    healthcare: number;
    recreation: number;
  };
  lastUpdated: string;
}

class DataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Simulate real estate API (in production, use actual APIs like RentSpree, RentBerry, etc.)
  async fetchRealEstateData(location: string): Promise<RealEstateData> {
    const cacheKey = `realestate_${location}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Simulate API call with realistic data variations
      await this.simulateNetworkDelay();
      
      const data: RealEstateData = {
        averageRent: this.generateRealisticRent(location),
        pricePerSqFt: this.generatePricePerSqFt(location),
        marketTrend: this.generateMarketTrend(),
        availability: Math.floor(Math.random() * 100) + 50
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Real estate data fetch failed:', error);
      return this.getFallbackRealEstateData(location);
    }
  }

  // Simulate crime data API (in production, use government crime APIs)
  async fetchCrimeData(location: string): Promise<CrimeData> {
    const cacheKey = `crime_${location}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      await this.simulateNetworkDelay();
      
      const data: CrimeData = {
        crimeRate: this.generateCrimeRate(location),
        safetyScore: this.generateSafetyScore(location),
        recentIncidents: Math.floor(Math.random() * 20)
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Crime data fetch failed:', error);
      return this.getFallbackCrimeData();
    }
  }

  // Simulate transit API (in production, use Google Maps, Mapbox, or local transit APIs)
  async fetchTransitData(coordinates: { lat: number; lng: number }): Promise<TransitData> {
    const cacheKey = `transit_${coordinates.lat}_${coordinates.lng}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      await this.simulateNetworkDelay();
      
      const data: TransitData = {
        walkScore: Math.floor(Math.random() * 40) + 60,
        transitScore: Math.floor(Math.random() * 50) + 50,
        bikeScore: Math.floor(Math.random() * 60) + 40,
        nearbyStations: this.generateNearbyStations(coordinates)
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Transit data fetch failed:', error);
      return this.getFallbackTransitData();
    }
  }

  // Simulate school data API (in production, use GreatSchools API or local education APIs)
  async fetchSchoolData(location: string): Promise<SchoolData> {
    const cacheKey = `schools_${location}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      await this.simulateNetworkDelay();
      
      const data: SchoolData = {
        averageRating: this.generateSchoolRating(location),
        topSchools: this.generateTopSchools(location),
        studentTeacherRatio: Math.floor(Math.random() * 10) + 15
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('School data fetch failed:', error);
      return this.getFallbackSchoolData();
    }
  }

  // Comprehensive data fetching with error handling
  async fetchNeighborhoodData(neighborhood: any): Promise<ExternalNeighborhoodData> {
    const location = `${neighborhood.city}, ${neighborhood.state}`;
    
    try {
      const [realEstate, crime, transit, schools] = await Promise.allSettled([
        this.fetchRealEstateData(location),
        this.fetchCrimeData(location),
        this.fetchTransitData(neighborhood.coordinates),
        this.fetchSchoolData(location)
      ]);

      return {
        id: neighborhood.id,
        name: neighborhood.name,
        city: neighborhood.city,
        state: neighborhood.state,
        coordinates: neighborhood.coordinates,
        realEstate: realEstate.status === 'fulfilled' ? realEstate.value : this.getFallbackRealEstateData(location),
        crime: crime.status === 'fulfilled' ? crime.value : this.getFallbackCrimeData(),
        transit: transit.status === 'fulfilled' ? transit.value : this.getFallbackTransitData(),
        schools: schools.status === 'fulfilled' ? schools.value : this.getFallbackSchoolData(),
        demographics: this.enhanceDemographics(neighborhood.demographics),
        amenities: this.calculateAmenityScores(location),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch neighborhood data:', error);
      throw new Error(`Data collection failed for ${neighborhood.name}`);
    }
  }

  // Data validation and cleaning
  validateAndCleanData(data: ExternalNeighborhoodData): ExternalNeighborhoodData {
    return {
      ...data,
      realEstate: {
        ...data.realEstate,
        averageRent: Math.max(0, data.realEstate.averageRent),
        pricePerSqFt: Math.max(0, data.realEstate.pricePerSqFt),
        availability: Math.min(100, Math.max(0, data.realEstate.availability))
      },
      crime: {
        ...data.crime,
        crimeRate: Math.max(0, data.crime.crimeRate),
        safetyScore: Math.min(5, Math.max(0, data.crime.safetyScore)),
        recentIncidents: Math.max(0, data.crime.recentIncidents)
      },
      transit: {
        ...data.transit,
        walkScore: Math.min(100, Math.max(0, data.transit.walkScore)),
        transitScore: Math.min(100, Math.max(0, data.transit.transitScore)),
        bikeScore: Math.min(100, Math.max(0, data.transit.bikeScore))
      }
    };
  }

  // Cache management
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Realistic data generators
  private generateRealisticRent(location: string): number {
    const basePrices: Record<string, number> = {
      'Mumbai': 45000,
      'Bangalore': 35000,
      'Delhi': 40000,
      'Gurgaon': 38000,
      'Noida': 30000,
      'Hyderabad': 32000,
      'Kolkata': 25000
    };
    
    const city = location.split(',')[0];
    const basePrice = basePrices[city] || 30000;
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    return Math.floor(basePrice * (1 + variation));
  }

  private generatePricePerSqFt(location: string): number {
    const city = location.split(',')[0];
    const basePrices: Record<string, number> = {
      'Mumbai': 25000,
      'Bangalore': 8000,
      'Delhi': 15000,
      'Gurgaon': 12000,
      'Noida': 7000,
      'Hyderabad': 6000,
      'Kolkata': 5000
    };
    
    const basePrice = basePrices[city] || 8000;
    const variation = (Math.random() - 0.5) * 0.3;
    return Math.floor(basePrice * (1 + variation));
  }

  private generateMarketTrend(): 'rising' | 'stable' | 'falling' {
    const trends = ['rising', 'stable', 'falling'];
    const weights = [0.4, 0.5, 0.1]; // More likely to be rising or stable
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < trends.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return trends[i] as any;
      }
    }
    return 'stable';
  }

  private generateCrimeRate(location: string): number {
    const city = location.split(',')[0];
    const baseCrimeRates: Record<string, number> = {
      'Mumbai': 2.1,
      'Bangalore': 1.8,
      'Delhi': 3.2,
      'Gurgaon': 2.5,
      'Noida': 2.0,
      'Hyderabad': 1.9,
      'Kolkata': 2.8
    };
    
    const baseRate = baseCrimeRates[city] || 2.0;
    const variation = (Math.random() - 0.5) * 0.5;
    return Math.max(0.5, baseRate + variation);
  }

  private generateSafetyScore(location: string): number {
    const crimeRate = this.generateCrimeRate(location);
    // Inverse relationship: lower crime rate = higher safety score
    return Math.min(5, Math.max(1, 5 - (crimeRate - 1)));
  }

  private generateNearbyStations(coordinates: { lat: number; lng: number }): string[] {
    const stationTypes = ['Metro', 'Bus', 'Railway'];
    const stationNames = ['Central', 'Junction', 'Park', 'Market', 'City', 'East', 'West', 'North', 'South'];
    const stations: string[] = [];
    
    const numStations = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < numStations; i++) {
      const type = stationTypes[Math.floor(Math.random() * stationTypes.length)];
      const name = stationNames[Math.floor(Math.random() * stationNames.length)];
      stations.push(`${name} ${type} Station`);
    }
    
    return stations;
  }

  private generateSchoolRating(location: string): number {
    const city = location.split(',')[0];
    const baseRatings: Record<string, number> = {
      'Mumbai': 4.2,
      'Bangalore': 4.3,
      'Delhi': 4.0,
      'Gurgaon': 4.1,
      'Noida': 3.9,
      'Hyderabad': 4.0,
      'Kolkata': 3.8
    };
    
    const baseRating = baseRatings[city] || 4.0;
    const variation = (Math.random() - 0.5) * 0.6;
    return Math.min(5, Math.max(2, baseRating + variation));
  }

  private generateTopSchools(location: string): string[] {
    const schoolTypes = ['Public School', 'International School', 'Convent School', 'Academy'];
    const schoolNames = ['St. Mary\'s', 'Delhi Public', 'Ryan International', 'Kendriya Vidyalaya', 'Modern'];
    const schools: string[] = [];
    
    const numSchools = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numSchools; i++) {
      const name = schoolNames[Math.floor(Math.random() * schoolNames.length)];
      const type = schoolTypes[Math.floor(Math.random() * schoolTypes.length)];
      schools.push(`${name} ${type}`);
    }
    
    return schools;
  }

  private enhanceDemographics(demographics: any) {
    return {
      ...demographics,
      diversityIndex: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    };
  }

  private calculateAmenityScores(location: string): any {
    return {
      restaurants: Math.floor(Math.random() * 50) + 20,
      shopping: Math.floor(Math.random() * 30) + 10,
      healthcare: Math.floor(Math.random() * 20) + 5,
      recreation: Math.floor(Math.random() * 25) + 10
    };
  }

  // Fallback data for when APIs fail
  private getFallbackRealEstateData(location: string): RealEstateData {
    return {
      averageRent: this.generateRealisticRent(location),
      pricePerSqFt: this.generatePricePerSqFt(location),
      marketTrend: 'stable',
      availability: 75
    };
  }

  private getFallbackCrimeData(): CrimeData {
    return {
      crimeRate: 2.0,
      safetyScore: 3.5,
      recentIncidents: 5
    };
  }

  private getFallbackTransitData(): TransitData {
    return {
      walkScore: 70,
      transitScore: 65,
      bikeScore: 60,
      nearbyStations: ['Metro Station', 'Bus Stop']
    };
  }

  private getFallbackSchoolData(): SchoolData {
    return {
      averageRating: 3.8,
      topSchools: ['Local Public School', 'Community School'],
      studentTeacherRatio: 20
    };
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const dataService = new DataService();