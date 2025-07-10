import { ExternalNeighborhoodData } from './dataService';

export interface UserPreferences {
  budget: number;
  commute?: string;
  lifestyle: string[];
  priorities: string[];
  familySize?: number;
  ageGroup?: 'young-professional' | 'family' | 'senior';
  workLocation?: { lat: number; lng: number };
}

export interface WeightedMatchScore {
  neighborhoodId: string;
  totalScore: number;
  weightedScores: {
    affordability: { score: number; weight: number; weighted: number };
    safety: { score: number; weight: number; weighted: number };
    convenience: { score: number; weight: number; weighted: number };
    lifestyle: { score: number; weight: number; weighted: number };
    commute: { score: number; weight: number; weighted: number };
  };
  reasoning: string[];
  confidence: number;
  dataQuality: number;
}

class EnhancedMatchingAlgorithm {
  private userInteractions: Map<string, number> = new Map();
  
  // Dynamic weight calculation with fallbacks
  private calculateDynamicWeights(preferences: UserPreferences): Record<string, number> {
    const baseWeights = {
      affordability: 0.25,
      safety: 0.20,
      convenience: 0.20,
      lifestyle: 0.20,
      commute: 0.15
    };

    try {
      // Safely handle priorities
      const priorities = Array.isArray(preferences.priorities) ? preferences.priorities : [];
      
      const priorityBoosts: Record<string, Record<string, number>> = {
        'cost': { affordability: 0.15 },
        'safety': { safety: 0.15 },
        'schools': { convenience: 0.10, safety: 0.05 },
        'transit': { commute: 0.10, convenience: 0.05 },
        'nightlife': { lifestyle: 0.10 },
        'commute': { commute: 0.15 }
      };

      // Apply priority boosts safely
      priorities.forEach(priority => {
        const boosts = priorityBoosts[priority];
        if (boosts) {
          Object.entries(boosts).forEach(([category, boost]) => {
            if (baseWeights[category as keyof typeof baseWeights] !== undefined) {
              baseWeights[category as keyof typeof baseWeights] += boost;
            }
          });
        }
      });

      // Age group adjustments with fallbacks
      const ageGroup = preferences.ageGroup || 'young-professional';
      if (ageGroup === 'family') {
        baseWeights.safety += 0.05;
        baseWeights.convenience += 0.05;
        baseWeights.lifestyle -= 0.05;
        baseWeights.commute -= 0.05;
      } else if (ageGroup === 'young-professional') {
        baseWeights.lifestyle += 0.08;
        baseWeights.commute += 0.07;
        baseWeights.safety -= 0.08;
        baseWeights.convenience -= 0.07;
      }

      // Normalize weights safely
      const total = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0);
      if (total > 0) {
        Object.keys(baseWeights).forEach(key => {
          baseWeights[key as keyof typeof baseWeights] /= total;
        });
      }
    } catch (error) {
      console.warn('Error calculating dynamic weights, using defaults:', error);
    }

    return baseWeights;
  }

  // Safe scoring functions with fallbacks
  private calculateAffordabilityScore(neighborhood: ExternalNeighborhoodData, preferences: UserPreferences): number {
    try {
      const rent = neighborhood?.realEstate?.averageRent || 30000;
      const budget = preferences?.budget || 30000;
      
      if (budget <= 0) return 0.5;
      
      const ratio = rent / budget;
      
      if (ratio <= 0.6) return 1.0;
      if (ratio <= 0.75) return 0.9;
      if (ratio <= 0.9) return 0.8;
      if (ratio <= 1.0) return 0.6;
      if (ratio <= 1.15) return 0.3;
      return 0.1;
    } catch (error) {
      console.warn('Error calculating affordability score:', error);
      return 0.5;
    }
  }

  private calculateSafetyScore(neighborhood: ExternalNeighborhoodData, preferences: UserPreferences): number {
    try {
      const safetyScore = neighborhood?.crime?.safetyScore || 3.5;
      const crimeRate = neighborhood?.crime?.crimeRate || 2.0;
      const recentIncidents = neighborhood?.crime?.recentIncidents || 10;
      
      let score = Math.max(0, Math.min(5, safetyScore)) / 5;
      
      if (crimeRate < 1.5) score += 0.1;
      else if (crimeRate > 3.0) score -= 0.15;
      
      if (recentIncidents > 15) score -= 0.1;
      else if (recentIncidents < 5) score += 0.05;

      if (preferences?.ageGroup === 'family' && score > 0.8) score += 0.05;

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      console.warn('Error calculating safety score:', error);
      return 0.5;
    }
  }

  private calculateConvenienceScore(neighborhood: ExternalNeighborhoodData, preferences: UserPreferences): number {
    try {
      const walkScore = neighborhood?.transit?.walkScore || 70;
      const transitScore = neighborhood?.transit?.transitScore || 65;
      const restaurants = neighborhood?.amenities?.restaurants || 20;
      const shopping = neighborhood?.amenities?.shopping || 15;
      const healthcare = neighborhood?.amenities?.healthcare || 10;
      const schoolRating = neighborhood?.schools?.averageRating || 3.8;
      
      const transit = (walkScore + transitScore) / 200;
      const amenities = (restaurants + shopping + healthcare) / 150;
      const schools = Math.max(0, Math.min(5, schoolRating)) / 5;
      
      let score = transit * 0.4 + amenities * 0.4 + schools * 0.2;

      const lifestyle = Array.isArray(preferences?.lifestyle) ? preferences.lifestyle : [];
      if (lifestyle.includes('walkable')) {
        score += (walkScore / 100) * 0.1;
      }

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      console.warn('Error calculating convenience score:', error);
      return 0.5;
    }
  }

  private calculateLifestyleScore(neighborhood: ExternalNeighborhoodData, preferences: UserPreferences): number {
    try {
      let score = 0.5;

      const medianAge = neighborhood?.demographics?.medianAge || 35;
      const ageGroup = preferences?.ageGroup || 'young-professional';
      const restaurants = neighborhood?.amenities?.restaurants || 20;
      const schoolRating = neighborhood?.schools?.averageRating || 3.8;
      const averageRent = neighborhood?.realEstate?.averageRent || 30000;
      const pricePerSqFt = neighborhood?.realEstate?.pricePerSqFt || 8000;
      const budget = preferences?.budget || 30000;

      if (ageGroup === 'young-professional') {
        if (medianAge >= 25 && medianAge <= 35) score += 0.2;
        if (restaurants > 25) score += 0.15;
      } else if (ageGroup === 'family') {
        if (medianAge >= 30 && medianAge <= 45) score += 0.2;
        if (schoolRating > 4.0) score += 0.15;
      }

      const lifestyle = Array.isArray(preferences?.lifestyle) ? preferences.lifestyle : [];
      lifestyle.forEach(lifestyleItem => {
        switch (lifestyleItem) {
          case 'modern':
            if (pricePerSqFt > 8000) score += 0.1;
            break;
          case 'affordable':
            if (averageRent < budget * 0.8) score += 0.15;
            break;
          case 'nightlife':
            if (restaurants > 20) score += 0.1;
            break;
          case 'family-friendly':
            if (schoolRating > 3.8) score += 0.15;
            break;
        }
      });

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      console.warn('Error calculating lifestyle score:', error);
      return 0.5;
    }
  }

  private calculateCommuteScore(neighborhood: ExternalNeighborhoodData, preferences: UserPreferences): number {
    try {
      if (!preferences?.workLocation || !neighborhood?.coordinates) return 0.7;

      const distance = this.calculateDistance(neighborhood.coordinates, preferences.workLocation);
      const transitScore = neighborhood?.transit?.transitScore || 65;
      
      let score = 1.0;
      if (distance <= 5) score = 1.0;
      else if (distance <= 10) score = 0.85;
      else if (distance <= 15) score = 0.7;
      else if (distance <= 25) score = 0.5;
      else if (distance <= 35) score = 0.3;
      else score = 0.1;

      if (transitScore > 70) score += 0.1;

      return Math.min(1, Math.max(0, score));
    } catch (error) {
      console.warn('Error calculating commute score:', error);
      return 0.7;
    }
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    try {
      const R = 6371;
      const dLat = this.toRadians(coord2.lat - coord1.lat);
      const dLng = this.toRadians(coord2.lng - coord1.lng);
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } catch (error) {
      console.warn('Error calculating distance:', error);
      return 20; // Default distance
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Main matching function with comprehensive error handling
  calculateWeightedMatches(neighborhoods: ExternalNeighborhoodData[], preferences: UserPreferences): WeightedMatchScore[] {
    try {
      if (!Array.isArray(neighborhoods) || neighborhoods.length === 0) {
        return [];
      }

      if (!preferences) {
        preferences = {
          budget: 30000,
          lifestyle: [],
          priorities: [],
          ageGroup: 'young-professional'
        };
      }

      const weights = this.calculateDynamicWeights(preferences);
      const scores: WeightedMatchScore[] = [];

      for (const neighborhood of neighborhoods) {
        try {
          if (!neighborhood || !neighborhood.id) continue;

          const categoryScores = {
            affordability: this.calculateAffordabilityScore(neighborhood, preferences),
            safety: this.calculateSafetyScore(neighborhood, preferences),
            convenience: this.calculateConvenienceScore(neighborhood, preferences),
            lifestyle: this.calculateLifestyleScore(neighborhood, preferences),
            commute: this.calculateCommuteScore(neighborhood, preferences)
          };

          const weightedScores = Object.entries(categoryScores).reduce((acc, [category, score]) => {
            const weight = weights[category] || 0.2;
            acc[category] = {
              score: Math.round(Math.max(0, Math.min(1, score)) * 100) / 100,
              weight: Math.round(weight * 100) / 100,
              weighted: Math.round(Math.max(0, Math.min(1, score)) * weight * 100) / 100
            };
            return acc;
          }, {} as any);

          const totalScore = Object.values(weightedScores).reduce((sum: number, item: any) => sum + (item.weighted || 0), 0);

          const reasoning = this.generateDetailedReasoning(neighborhood, categoryScores, preferences);
          const confidence = this.calculateConfidence(categoryScores, neighborhood);

          scores.push({
            neighborhoodId: neighborhood.id,
            totalScore: Math.round(Math.max(0, Math.min(1, totalScore)) * 100) / 100,
            weightedScores,
            reasoning,
            confidence: Math.round(Math.max(0.3, Math.min(1, confidence)) * 100) / 100,
            dataQuality: 0.85
          });
        } catch (error) {
          console.warn(`Error calculating weighted score for neighborhood ${neighborhood?.id || 'unknown'}:`, error);
        }
      }

      return scores.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    } catch (error) {
      console.error('Error in calculateWeightedMatches:', error);
      return [];
    }
  }

  private generateDetailedReasoning(neighborhood: ExternalNeighborhoodData, scores: any, preferences: UserPreferences): string[] {
    const reasoning: string[] = [];
    
    try {
      if (scores.affordability > 0.8) {
        const rent = neighborhood?.realEstate?.averageRent || 30000;
        const budget = preferences?.budget || 30000;
        const savings = Math.round((1 - rent / budget) * 100);
        reasoning.push(`Great value - ${Math.max(0, savings)}% under budget at ₹${rent.toLocaleString()}/month`);
      }
      
      if (scores.safety > 0.8) {
        const safetyScore = neighborhood?.crime?.safetyScore || 3.5;
        reasoning.push(`Excellent safety with ${safetyScore}/5 rating and low crime rate`);
      }
      
      if (scores.convenience > 0.8) {
        const walkScore = neighborhood?.transit?.walkScore || 70;
        reasoning.push(`Highly convenient with walk score ${walkScore} and great amenities`);
      }
      
      if (scores.commute > 0.8 && preferences?.workLocation && neighborhood?.coordinates) {
        const distance = this.calculateDistance(neighborhood.coordinates, preferences.workLocation);
        reasoning.push(`Short ${distance.toFixed(1)}km commute with good transit connectivity`);
      }
    } catch (error) {
      console.warn('Error generating reasoning:', error);
      reasoning.push('Good overall match based on your preferences');
    }

    return reasoning.slice(0, 3);
  }

  private calculateConfidence(scores: any, neighborhood: ExternalNeighborhoodData): number {
    try {
      const scoreValues = Object.values(scores).filter(score => typeof score === 'number') as number[];
      if (scoreValues.length === 0) return 0.5;

      const variance = scoreValues.reduce((sum, score) => sum + Math.pow(score - 0.5, 2), 0) / scoreValues.length;
      
      let confidence = 1 - variance;
      
      const lastUpdated = neighborhood?.lastUpdated;
      if (lastUpdated) {
        const dataAge = Date.now() - new Date(lastUpdated).getTime();
        const daysSinceUpdate = dataAge / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate > 7) confidence -= 0.1;
      }
      
      return Math.min(1, Math.max(0.3, confidence));
    } catch (error) {
      console.warn('Error calculating confidence:', error);
      return 0.7;
    }
  }

  recordUserInteraction(neighborhoodId: string, type: 'view' | 'save' | 'contact' | 'reject'): void {
    try {
      if (!neighborhoodId || !type) return;
      
      const weights = { view: 1, save: 3, contact: 5, reject: -2 };
      const current = this.userInteractions.get(neighborhoodId) || 0;
      this.userInteractions.set(neighborhoodId, current + (weights[type] || 0));
    } catch (error) {
      console.warn('Error recording user interaction:', error);
    }
  }
}

export const enhancedMatchingAlgorithm = new EnhancedMatchingAlgorithm();