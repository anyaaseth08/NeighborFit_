// Data processing pipeline for handling real-world data inconsistencies
import { dataService, ExternalNeighborhoodData } from './dataService';
import { Neighborhood } from '../contexts/NeighborhoodContext';

export interface DataQuality {
  completeness: number;
  accuracy: number;
  freshness: number;
  consistency: number;
  overall: number;
}

export interface ProcessedNeighborhood extends Neighborhood {
  externalData: ExternalNeighborhoodData;
  dataQuality: DataQuality;
  lastProcessed: string;
  processingErrors: string[];
}

class DataProcessor {
  private processingQueue: string[] = [];
  private isProcessing = false;
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  // Main data processing pipeline
  async processNeighborhoodData(neighborhoods: Neighborhood[]): Promise<ProcessedNeighborhood[]> {
    const processed: ProcessedNeighborhood[] = [];
    const batchSize = 5; // Process in batches to avoid overwhelming APIs
    
    console.log(`Starting data processing for ${neighborhoods.length} neighborhoods`);
    
    for (let i = 0; i < neighborhoods.length; i += batchSize) {
      const batch = neighborhoods.slice(i, i + batchSize);
      const batchResults = await this.processBatch(batch);
      processed.push(...batchResults);
      
      // Add delay between batches to respect API rate limits
      if (i + batchSize < neighborhoods.length) {
        await this.delay(1000);
      }
    }
    
    console.log(`Data processing completed. ${processed.length} neighborhoods processed successfully`);
    return processed;
  }

  // Process a batch of neighborhoods
  private async processBatch(neighborhoods: Neighborhood[]): Promise<ProcessedNeighborhood[]> {
    const promises = neighborhoods.map(neighborhood => this.processIndividualNeighborhood(neighborhood));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<ProcessedNeighborhood> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Process individual neighborhood with error handling and retries
  private async processIndividualNeighborhood(neighborhood: Neighborhood): Promise<ProcessedNeighborhood> {
    const neighborhoodId = neighborhood.id;
    const attempts = this.retryAttempts.get(neighborhoodId) || 0;
    
    try {
      console.log(`Processing ${neighborhood.name} (attempt ${attempts + 1})`);
      
      // Fetch external data
      let externalData;
      try {
        externalData = await dataService.fetchNeighborhoodData(neighborhood);
      } catch (error) {
        console.warn(`External data fetch failed for ${neighborhood.name}, using fallback:`, error);
        externalData = this.createFallbackExternalData(neighborhood);
      }
      
      // Validate and clean the data
      const cleanedData = this.validateAndCleanData(externalData);
      
      // Calculate data quality metrics
      const dataQuality = this.assessDataQuality(cleanedData, neighborhood);
      
      // Merge with existing neighborhood data
      const processedNeighborhood = this.mergeNeighborhoodData(neighborhood, cleanedData, dataQuality);
      
      // Reset retry count on success
      this.retryAttempts.delete(neighborhoodId);
      
      return processedNeighborhood;
      
    } catch (error) {
      console.error(`Error processing ${neighborhood.name}:`, error);
      
      if (attempts < this.maxRetries) {
        this.retryAttempts.set(neighborhoodId, attempts + 1);
        console.log(`Retrying ${neighborhood.name} in 2 seconds...`);
        await this.delay(2000);
        return this.processIndividualNeighborhood(neighborhood);
      } else {
        // Max retries reached, return with fallback data
        console.warn(`Max retries reached for ${neighborhood.name}, using fallback data`);
        return this.createFallbackNeighborhood(neighborhood, error as Error);
      }
    }
  }

  // Create fallback external data when API fails
  private createFallbackExternalData(neighborhood: Neighborhood): any {
    return {
      id: neighborhood.id,
      name: neighborhood.name,
      city: neighborhood.city,
      state: neighborhood.state,
      coordinates: neighborhood.coordinates,
      realEstate: {
        averageRent: (neighborhood.priceRange.min + neighborhood.priceRange.max) / 2,
        pricePerSqFt: 8000,
        marketTrend: 'stable',
        availability: 75
      },
      crime: {
        crimeRate: 2.0,
        safetyScore: neighborhood.ratings.safety || 3.5,
        recentIncidents: 10
      },
      transit: {
        walkScore: (neighborhood.ratings.transit || 3.5) * 20,
        transitScore: (neighborhood.ratings.transit || 3.5) * 20,
        bikeScore: 60,
        nearbyStations: ['Metro Station', 'Bus Stop']
      },
      schools: {
        averageRating: neighborhood.ratings.schools || 3.8,
        topSchools: ['Local School'],
        studentTeacherRatio: 20
      },
      demographics: neighborhood.demographics,
      amenities: {
        restaurants: 20,
        shopping: 15,
        healthcare: 10,
        recreation: 12
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // Validate and clean external data
  private validateAndCleanData(data: any): any {
    if (!data) return this.createFallbackExternalData({ id: 'unknown', name: 'Unknown', city: 'Unknown', state: 'Unknown', coordinates: { lat: 0, lng: 0 }, priceRange: { min: 30000, max: 50000 }, ratings: { overall: 3.5, safety: 3.5, schools: 3.5, transit: 3.5, nightlife: 3.5, cost: 3.5 }, demographics: { population: 50000, medianAge: 35, medianIncome: 800000 } } as any);
    
    const cleaned = { ...data };
    const errors: string[] = [];

    try {
      // Validate real estate data
      if (!cleaned.realEstate || cleaned.realEstate.averageRent <= 0) {
        cleaned.realEstate = cleaned.realEstate || {};
        cleaned.realEstate.averageRent = 30000; // Default fallback
        errors.push('Invalid rent data corrected');
      }
      
      if (cleaned.realEstate.pricePerSqFt <= 0) {
        cleaned.realEstate.pricePerSqFt = 8000; // Default fallback
        errors.push('Invalid price per sqft corrected');
      }

      // Validate crime data
      if (!cleaned.crime || cleaned.crime.safetyScore < 0 || cleaned.crime.safetyScore > 5) {
        cleaned.crime = cleaned.crime || {};
        cleaned.crime.safetyScore = Math.min(5, Math.max(0, cleaned.crime.safetyScore || 3.5));
        errors.push('Safety score normalized');
      }
      
      if (cleaned.crime.crimeRate < 0) {
        cleaned.crime.crimeRate = 2.0; // Default average
        errors.push('Invalid crime rate corrected');
      }

      // Validate transit data
      cleaned.transit = cleaned.transit || {};
      cleaned.transit.walkScore = Math.min(100, Math.max(0, cleaned.transit.walkScore || 70));
      cleaned.transit.transitScore = Math.min(100, Math.max(0, cleaned.transit.transitScore || 65));
      cleaned.transit.bikeScore = Math.min(100, Math.max(0, cleaned.transit.bikeScore));

      // Validate school data
      if (!cleaned.schools || cleaned.schools.averageRating < 0 || cleaned.schools.averageRating > 5) {
        cleaned.schools = cleaned.schools || {};
        cleaned.schools.averageRating = Math.min(5, Math.max(0, cleaned.schools.averageRating || 3.8));
        errors.push('School rating normalized');
      }

      // Validate demographics
      if (!cleaned.demographics || cleaned.demographics.population <= 0) {
        cleaned.demographics = cleaned.demographics || {};
        cleaned.demographics.population = 50000; // Default
        errors.push('Invalid population corrected');
      }
      
      if (cleaned.demographics.medianAge <= 0 || cleaned.demographics.medianAge > 100) {
        cleaned.demographics.medianAge = 35; // Default
        errors.push('Invalid median age corrected');
      }

    } catch (error) {
      console.warn('Error validating data, using fallback:', error);
      return this.createFallbackExternalData({ id: 'unknown', name: 'Unknown', city: 'Unknown', state: 'Unknown', coordinates: { lat: 0, lng: 0 }, priceRange: { min: 30000, max: 50000 }, ratings: { overall: 3.5, safety: 3.5, schools: 3.5, transit: 3.5, nightlife: 3.5, cost: 3.5 }, demographics: { population: 50000, medianAge: 35, medianIncome: 800000 } } as any);
    }

    if (errors.length > 0) {
      console.warn(`Data validation issues for ${data.name}:`, errors);
    }

    return cleaned;
  }

  // Assess data quality metrics
  private assessDataQuality(data: ExternalNeighborhoodData, original: Neighborhood): DataQuality {
    let completeness = 0;
    let accuracy = 0;
    let freshness = 0;
    let consistency = 0;

    // Completeness: Check if all required fields are present
    const requiredFields = [
      data.realEstate.averageRent,
      data.crime.safetyScore,
      data.transit.walkScore,
      data.schools.averageRating,
      data.demographics.population
    ];
    
    completeness = requiredFields.filter(field => field !== null && field !== undefined).length / requiredFields.length;

    // Accuracy: Compare with known data points (simplified)
    accuracy = 0.8; // Assume 80% accuracy for external data
    
    // Cross-validate with original data if available
    if (original.ratings.overall) {
      const externalOverall = (data.crime.safetyScore + data.schools.averageRating) / 2;
      const difference = Math.abs(original.ratings.overall - externalOverall);
      if (difference < 0.5) accuracy += 0.1;
    }

    // Freshness: Check how recent the data is
    const dataAge = Date.now() - new Date(data.lastUpdated).getTime();
    const daysSinceUpdate = dataAge / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate <= 1) {
      freshness = 1.0;
    } else if (daysSinceUpdate <= 7) {
      freshness = 0.8;
    } else if (daysSinceUpdate <= 30) {
      freshness = 0.6;
    } else {
      freshness = 0.4;
    }

    // Consistency: Check for logical consistency
    consistency = 0.9; // Base consistency score
    
    // Check if high rent correlates with good amenities
    if (data.realEstate.averageRent > 50000 && data.amenities.restaurants < 10) {
      consistency -= 0.1;
    }
    
    // Check if good schools correlate with family-friendly demographics
    if (data.schools.averageRating > 4.0 && data.demographics.medianAge < 25) {
      consistency -= 0.1;
    }

    const overall = (completeness + accuracy + freshness + consistency) / 4;

    return {
      completeness: Math.round(completeness * 100) / 100,
      accuracy: Math.round(accuracy * 100) / 100,
      freshness: Math.round(freshness * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      overall: Math.round(overall * 100) / 100
    };
  }

  // Merge external data with original neighborhood data
  private mergeNeighborhoodData(
    original: Neighborhood,
    external: ExternalNeighborhoodData,
    quality: DataQuality
  ): ProcessedNeighborhood {
    // Update ratings based on external data
    const updatedRatings = {
      ...original.ratings,
      safety: external.crime.safetyScore,
      schools: external.schools.averageRating,
      transit: external.transit.transitScore / 20, // Convert 0-100 to 0-5
      cost: this.calculateCostRating(external.realEstate.averageRent, original.priceRange)
    };

    // Recalculate overall rating
    updatedRatings.overall = (
      updatedRatings.safety +
      updatedRatings.schools +
      updatedRatings.transit +
      updatedRatings.nightlife +
      updatedRatings.cost
    ) / 5;

    // Update price range based on external data
    const updatedPriceRange = {
      min: Math.floor(external.realEstate.averageRent * 0.8),
      max: Math.floor(external.realEstate.averageRent * 1.2)
    };

    return {
      ...original,
      ratings: updatedRatings,
      priceRange: updatedPriceRange,
      demographics: {
        ...original.demographics,
        ...external.demographics
      },
      externalData: external,
      dataQuality: quality,
      lastProcessed: new Date().toISOString(),
      processingErrors: []
    };
  }

  // Calculate cost rating based on rent and price range
  private calculateCostRating(averageRent: number, originalPriceRange: { min: number; max: number }): number {
    const originalAverage = (originalPriceRange.min + originalPriceRange.max) / 2;
    const difference = (averageRent - originalAverage) / originalAverage;
    
    // Lower rent = higher cost rating
    if (difference < -0.2) return 5.0; // Much cheaper than expected
    if (difference < -0.1) return 4.5;
    if (difference < 0.1) return 4.0;   // About as expected
    if (difference < 0.2) return 3.5;
    if (difference < 0.3) return 3.0;
    return 2.5; // Much more expensive
  }

  // Create fallback neighborhood when processing fails
  private createFallbackNeighborhood(original: Neighborhood, error: Error): ProcessedNeighborhood {
    const fallbackExternal: ExternalNeighborhoodData = {
      id: original.id,
      name: original.name,
      city: original.city,
      state: original.state,
      coordinates: original.coordinates,
      realEstate: {
        averageRent: (original.priceRange.min + original.priceRange.max) / 2,
        pricePerSqFt: 8000,
        marketTrend: 'stable',
        availability: 75
      },
      crime: {
        crimeRate: 2.0,
        safetyScore: original.ratings.safety || 3.5,
        recentIncidents: 10
      },
      transit: {
        walkScore: (original.ratings.transit || 3.5) * 20,
        transitScore: (original.ratings.transit || 3.5) * 20,
        bikeScore: 60,
        nearbyStations: ['Metro Station', 'Bus Stop']
      },
      schools: {
        averageRating: original.ratings.schools || 3.8,
        topSchools: ['Local School'],
        studentTeacherRatio: 20
      },
      demographics: original.demographics,
      amenities: {
        restaurants: 20,
        shopping: 15,
        healthcare: 10,
        recreation: 12
      },
      lastUpdated: new Date().toISOString()
    };

    return {
      ...original,
      externalData: fallbackExternal,
      dataQuality: {
        completeness: 0.6,
        accuracy: 0.5,
        freshness: 1.0,
        consistency: 0.7,
        overall: 0.7
      },
      lastProcessed: new Date().toISOString(),
      processingErrors: [error.message]
    };
  }

  // Utility function for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get processing status
  getProcessingStatus(): { isProcessing: boolean; queueLength: number } {
    return {
      isProcessing: this.isProcessing,
      queueLength: this.processingQueue.length
    };
  }

  // Clear retry attempts (useful for testing)
  clearRetryAttempts(): void {
    this.retryAttempts.clear();
  }
}

export const dataProcessor = new DataProcessor();