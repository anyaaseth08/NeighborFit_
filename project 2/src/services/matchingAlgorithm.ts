// Advanced matching algorithm with weighted scoring and machine learning concepts
import { ExternalNeighborhoodData } from './dataService';
import { enhancedMatchingAlgorithm, WeightedMatchScore } from './enhancedMatchingAlgorithm';

export interface UserPreferences {
  budget: number;
  commute?: string;
  lifestyle: string[];
  priorities: string[];
  familySize?: number;
  ageGroup?: 'young-professional' | 'family' | 'senior';
  workLocation?: { lat: number; lng: number };
}

export interface MatchScore {
  neighborhoodId: string;
  totalScore: number;
  categoryScores: {
    affordability: number;
    safety: number;
    convenience: number;
    lifestyle: number;
    commute: number;
  };
  reasoning: string[];
  confidence: number;
}

export interface WeightConfig {
  affordability: number;
  safety: number;
  convenience: number;
  lifestyle: number;
  commute: number;
}

class MatchingAlgorithm {
  private userInteractions: Map<string, number> = new Map();
  private globalWeights: WeightConfig = {
    affordability: 0.25,
    safety: 0.20,
    convenience: 0.20,
    lifestyle: 0.20,
    commute: 0.15
  };

  // Main matching function
  calculateMatches(
    neighborhoods: ExternalNeighborhoodData[],
    preferences: UserPreferences
  ): MatchScore[] {
    const weights = this.calculatePersonalizedWeights(preferences);
    const scores: MatchScore[] = [];

    for (const neighborhood of neighborhoods) {
      try {
        const score = this.calculateNeighborhoodScore(neighborhood, preferences, weights);
        scores.push(score);
      } catch (error) {
        console.error(`Error calculating score for ${neighborhood.name}:`, error);
        // Continue with other neighborhoods
      }
    }

    return scores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10); // Return top 10 matches
  }

  // Calculate personalized weights based on user preferences
  private calculatePersonalizedWeights(preferences: UserPreferences): WeightConfig {
    const weights = { ...this.globalWeights };
    
    // Adjust weights based on priorities
    if (preferences.priorities.includes('safety')) {
      weights.safety += 0.1;
      weights.lifestyle -= 0.05;
      weights.convenience -= 0.05;
    }
    
    if (preferences.priorities.includes('cost')) {
      weights.affordability += 0.15;
      weights.lifestyle -= 0.075;
      weights.convenience -= 0.075;
    }
    
    if (preferences.priorities.includes('commute')) {
      weights.commute += 0.1;
      weights.lifestyle -= 0.05;
      weights.convenience -= 0.05;
    }
    
    if (preferences.priorities.includes('schools')) {
      weights.convenience += 0.1;
      weights.lifestyle -= 0.05;
      weights.commute -= 0.05;
    }

    // Adjust based on age group
    if (preferences.ageGroup === 'family') {
      weights.safety += 0.05;
      weights.convenience += 0.05;
      weights.lifestyle -= 0.1;
    } else if (preferences.ageGroup === 'young-professional') {
      weights.lifestyle += 0.1;
      weights.commute += 0.05;
      weights.safety -= 0.075;
      weights.convenience -= 0.075;
    }

    // Normalize weights to sum to 1
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(weights).forEach(key => {
      weights[key as keyof WeightConfig] /= total;
    });

    return weights;
  }

  // Calculate comprehensive neighborhood score
  private calculateNeighborhoodScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences,
    weights: WeightConfig
  ): MatchScore {
    const categoryScores = {
      affordability: this.calculateAffordabilityScore(neighborhood, preferences),
      safety: this.calculateSafetyScore(neighborhood, preferences),
      convenience: this.calculateConvenienceScore(neighborhood, preferences),
      lifestyle: this.calculateLifestyleScore(neighborhood, preferences),
      commute: this.calculateCommuteScore(neighborhood, preferences)
    };

    const totalScore = Object.entries(categoryScores).reduce(
      (total, [category, score]) => total + score * weights[category as keyof WeightConfig],
      0
    );

    const reasoning = this.generateReasoning(neighborhood, categoryScores, preferences);
    const confidence = this.calculateConfidence(categoryScores, neighborhood);

    return {
      neighborhoodId: neighborhood.id,
      totalScore: Math.round(totalScore * 100) / 100,
      categoryScores,
      reasoning,
      confidence
    };
  }

  // Affordability scoring with market trends
  private calculateAffordabilityScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences
  ): number {
    const { averageRent, marketTrend } = neighborhood.realEstate;
    const budget = preferences.budget;

    // Base affordability score
    let score = 0;
    if (averageRent <= budget * 0.7) {
      score = 1.0; // Very affordable
    } else if (averageRent <= budget * 0.85) {
      score = 0.8; // Affordable
    } else if (averageRent <= budget) {
      score = 0.6; // Within budget
    } else if (averageRent <= budget * 1.15) {
      score = 0.3; // Slightly over budget
    } else {
      score = 0.1; // Over budget
    }

    // Adjust for market trends
    if (marketTrend === 'falling') {
      score += 0.1; // Good time to move
    } else if (marketTrend === 'rising') {
      score -= 0.05; // Prices going up
    }

    return Math.min(1, Math.max(0, score));
  }

  // Safety scoring with multiple factors
  private calculateSafetyScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences
  ): number {
    const { safetyScore, crimeRate, recentIncidents } = neighborhood.crime;
    
    // Normalize safety score (0-5 to 0-1)
    let score = safetyScore / 5;
    
    // Adjust for crime rate (lower is better)
    if (crimeRate < 1.5) {
      score += 0.1;
    } else if (crimeRate > 3.0) {
      score -= 0.1;
    }
    
    // Adjust for recent incidents
    if (recentIncidents < 5) {
      score += 0.05;
    } else if (recentIncidents > 15) {
      score -= 0.05;
    }

    // Family preference adjustment
    if (preferences.ageGroup === 'family' && score > 0.8) {
      score += 0.05; // Bonus for families in safe areas
    }

    return Math.min(1, Math.max(0, score));
  }

  // Convenience scoring based on amenities and transit
  private calculateConvenienceScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences
  ): number {
    const { walkScore, transitScore, nearbyStations } = neighborhood.transit;
    const { restaurants, shopping, healthcare } = neighborhood.amenities;
    
    // Transit score (0-100 to 0-1)
    const transitComponent = (walkScore * 0.4 + transitScore * 0.6) / 100;
    
    // Amenities score
    const maxAmenities = 100; // Assumed max for normalization
    const amenitiesComponent = (
      (restaurants + shopping + healthcare) / (maxAmenities * 3)
    );
    
    // Station accessibility
    const stationComponent = Math.min(1, nearbyStations.length / 5);
    
    let score = transitComponent * 0.5 + amenitiesComponent * 0.3 + stationComponent * 0.2;

    // Adjust for lifestyle preferences
    if (preferences.lifestyle.includes('walkable')) {
      score += (walkScore / 100) * 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  // Lifestyle scoring based on user preferences
  private calculateLifestyleScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences
  ): number {
    let score = 0.5; // Base score
    const lifestyle = preferences.lifestyle;
    
    // Age-based lifestyle matching
    if (preferences.ageGroup === 'young-professional') {
      if (neighborhood.amenities.restaurants > 30) score += 0.2;
      if (neighborhood.demographics.medianAge < 35) score += 0.1;
    } else if (preferences.ageGroup === 'family') {
      if (neighborhood.schools.averageRating > 4.0) score += 0.2;
      if (neighborhood.demographics.medianAge > 30) score += 0.1;
    }

    // Lifestyle preference matching
    if (lifestyle.includes('modern') && neighborhood.realEstate.pricePerSqFt > 10000) {
      score += 0.1;
    }
    
    if (lifestyle.includes('affordable') && neighborhood.realEstate.averageRent < preferences.budget * 0.8) {
      score += 0.15;
    }
    
    if (lifestyle.includes('nightlife') && neighborhood.amenities.restaurants > 25) {
      score += 0.1;
    }
    
    if (lifestyle.includes('family-friendly') && neighborhood.schools.averageRating > 3.8) {
      score += 0.15;
    }

    // Diversity bonus
    if (neighborhood.demographics.diversityIndex > 0.8) {
      score += 0.05;
    }

    return Math.min(1, Math.max(0, score));
  }

  // Commute scoring with distance calculation
  private calculateCommuteScore(
    neighborhood: ExternalNeighborhoodData,
    preferences: UserPreferences
  ): number {
    if (!preferences.workLocation) {
      return 0.7; // Neutral score if no work location
    }

    const distance = this.calculateDistance(
      neighborhood.coordinates,
      preferences.workLocation
    );

    let score = 1.0;
    
    // Distance-based scoring (assuming km)
    if (distance <= 5) {
      score = 1.0; // Excellent
    } else if (distance <= 10) {
      score = 0.8; // Good
    } else if (distance <= 20) {
      score = 0.6; // Acceptable
    } else if (distance <= 30) {
      score = 0.4; // Long commute
    } else {
      score = 0.2; // Very long commute
    }

    // Transit bonus
    if (neighborhood.transit.transitScore > 70) {
      score += 0.1; // Good public transport
    }

    return Math.min(1, Math.max(0, score));
  }

  // Generate human-readable reasoning
  private generateReasoning(
    neighborhood: ExternalNeighborhoodData,
    scores: any,
    preferences: UserPreferences
  ): string[] {
    const reasoning: string[] = [];
    
    if (scores.affordability > 0.8) {
      reasoning.push(`Excellent value - rent is ${Math.round((1 - neighborhood.realEstate.averageRent / preferences.budget) * 100)}% below your budget`);
    } else if (scores.affordability < 0.4) {
      reasoning.push(`Above budget - consider increasing budget or looking at nearby areas`);
    }
    
    if (scores.safety > 0.8) {
      reasoning.push(`Very safe area with low crime rate (${neighborhood.crime.crimeRate.toFixed(1)} incidents per 1000)`);
    }
    
    if (scores.convenience > 0.8) {
      reasoning.push(`Highly convenient with walk score of ${neighborhood.transit.walkScore} and excellent amenities`);
    }
    
    if (scores.commute > 0.8 && preferences.workLocation) {
      reasoning.push(`Short commute to your work location with good transit options`);
    }
    
    if (scores.lifestyle > 0.8) {
      reasoning.push(`Great lifestyle match based on your preferences for ${preferences.lifestyle.join(', ')}`);
    }

    // Add specific highlights
    if (neighborhood.schools.averageRating > 4.2) {
      reasoning.push(`Excellent schools with average rating of ${neighborhood.schools.averageRating.toFixed(1)}/5`);
    }
    
    if (neighborhood.realEstate.marketTrend === 'falling') {
      reasoning.push(`Good timing - property prices are currently falling in this area`);
    }

    return reasoning.slice(0, 4); // Limit to top 4 reasons
  }

  // Calculate confidence based on data quality and score distribution
  private calculateConfidence(scores: any, neighborhood: ExternalNeighborhoodData): number {
    const scoreValues = Object.values(scores) as number[];
    const avgScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    
    // Calculate variance
    const variance = scoreValues.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scoreValues.length;
    
    // Lower variance = higher confidence
    let confidence = 1 - variance;
    
    // Adjust for data freshness
    const dataAge = Date.now() - new Date(neighborhood.lastUpdated).getTime();
    const daysSinceUpdate = dataAge / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate > 7) {
      confidence -= 0.1; // Reduce confidence for old data
    }
    
    return Math.min(1, Math.max(0.3, confidence));
  }

  // Haversine distance calculation
  private calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Machine learning component - learn from user interactions
  recordUserInteraction(neighborhoodId: string, interactionType: 'view' | 'save' | 'contact' | 'reject'): void {
    const weights = { view: 1, save: 3, contact: 5, reject: -2 };
    const currentScore = this.userInteractions.get(neighborhoodId) || 0;
    this.userInteractions.set(neighborhoodId, currentScore + weights[interactionType]);
  }

  // Get personalized recommendations based on learning
  getPersonalizedRecommendations(
    neighborhoods: ExternalNeighborhoodData[],
    preferences: UserPreferences
  ): WeightedMatchScore[] {
    const matches = enhancedMatchingAlgorithm.calculateWeightedMatches(neighborhoods, preferences);
    
    // Adjust scores based on user interactions
    return matches.map(match => {
      const interactionScore = this.userInteractions.get(match.neighborhoodId) || 0;
      const adjustmentFactor = Math.min(0.2, Math.max(-0.2, interactionScore * 0.02));
      
      return {
        ...match,
        totalScore: Math.min(1, Math.max(0, match.totalScore + adjustmentFactor))
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }
}

export const matchingAlgorithm = new MatchingAlgorithm();