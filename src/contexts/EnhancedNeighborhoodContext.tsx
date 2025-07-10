import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Neighborhood, Review, FilterState } from './NeighborhoodContext';
import { dataProcessor, ProcessedNeighborhood } from '../services/dataProcessor';
import { matchingAlgorithm, UserPreferences } from '../services/matchingAlgorithm';
import { WeightedMatchScore, enhancedMatchingAlgorithm } from '../services/enhancedMatchingAlgorithm';
import { dataService } from '../services/dataService';
import { geoService } from '../services/geoService';
import { errorHandler } from '../services/errorHandler';

interface EnhancedNeighborhoodContextType {
  neighborhoods: ProcessedNeighborhood[];
  filteredNeighborhoods: ProcessedNeighborhood[];
  compareList: string[];
  filters: FilterState;
  isLoading: boolean;
  dataQuality: number;
  lastUpdated: string;
  matchScores: WeightedMatchScore[];
  setFilters: (filters: FilterState) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  addReview: (neighborhoodId: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => void;
  updateReview: (reviewId: string, review: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  markReviewHelpful: (reviewId: string, userId: string) => void;
  getRecommendations: (preferences: UserPreferences) => WeightedMatchScore[];
  searchNeighborhoods: (query: string) => ProcessedNeighborhood[];
  contactLocalAgent: (neighborhoodId: string, userInfo: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
  recordUserInteraction: (neighborhoodId: string, type: 'view' | 'save' | 'contact' | 'reject') => void;
}

const EnhancedNeighborhoodContext = createContext<EnhancedNeighborhoodContextType | undefined>(undefined);

// Enhanced mock neighborhoods with fallback data
const enhancedMockNeighborhoods: Neighborhood[] = [
  {
    id: '1',
    name: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    description: 'A vibrant tech hub with excellent cafes, restaurants, and startup ecosystem. Popular among young professionals and entrepreneurs.',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 25000, max: 45000 },
    ratings: {
      overall: 4.3,
      safety: 4.1,
      schools: 4.2,
      transit: 4.5,
      nightlife: 4.6,
      cost: 3.2
    },
    features: ['tech-hub', 'nightlife', 'restaurants', 'metro', 'shopping', 'startups'],
    demographics: {
      population: 85000,
      medianAge: 28,
      medianIncome: 850000
    },
    reviews: [],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    amenities: ['Metro Station', 'Shopping Malls', 'Hospitals', 'Parks', 'Gyms'],
    nearbyPlaces: {
      hospitals: ['Manipal Hospital', 'Apollo Hospital'],
      schools: ['Delhi Public School', 'Inventure Academy'],
      malls: ['Forum Mall', 'Central Mall'],
      restaurants: ['Toit', 'Arbor Brewing Company', 'Smoke House Deli']
    },
    movingServices: {
      packers: ['Agarwal Packers & Movers', 'Leo Packers & Movers'],
      localAgents: ['Koramangala Properties', 'Tech Hub Realty'],
      utilities: ['BESCOM', 'BWSSB', 'Airtel Fiber']
    }
  },
  {
    id: '2',
    name: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    description: 'Upscale neighborhood known for its Bollywood connections, trendy restaurants, and vibrant nightlife scene.',
    image: 'https://images.pexels.com/photos/1192671/pexels-photo-1192671.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1192671/pexels-photo-1192671.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 35000, max: 80000 },
    ratings: {
      overall: 4.5,
      safety: 4.3,
      schools: 4.4,
      transit: 4.2,
      nightlife: 4.8,
      cost: 2.8
    },
    features: ['upscale', 'bollywood', 'nightlife', 'restaurants', 'shopping', 'coastal'],
    demographics: {
      population: 120000,
      medianAge: 32,
      medianIncome: 1200000
    },
    reviews: [],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    amenities: ['Beach Access', 'High-end Restaurants', 'Boutiques', 'Gyms', 'Spas'],
    nearbyPlaces: {
      hospitals: ['Lilavati Hospital', 'Holy Family Hospital'],
      schools: ['Jamnabai Narsee School', 'St. Stanislaus High School'],
      malls: ['Palladium Mall', 'Infiniti Mall'],
      restaurants: ['Trishna', 'Pali Village Cafe', 'Bastian']
    },
    movingServices: {
      packers: ['Mumbai Movers', 'Reliable Packers'],
      localAgents: ['Bandra Properties', 'West Side Realty'],
      utilities: ['BEST', 'Mumbai Water', 'Jio Fiber']
    }
  },
  {
    id: '3',
    name: 'Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    description: 'The heart of Delhi with colonial architecture, shopping, dining, and excellent connectivity.',
    image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 40000, max: 85000 },
    ratings: {
      overall: 4.4,
      safety: 4.2,
      schools: 4.0,
      transit: 4.8,
      nightlife: 4.5,
      cost: 3.0
    },
    features: ['historic', 'commercial', 'metro', 'shopping', 'restaurants', 'central'],
    demographics: {
      population: 95000,
      medianAge: 35,
      medianIncome: 1100000
    },
    reviews: [],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    amenities: ['Metro Stations', 'Shopping Centers', 'Restaurants', 'Banks'],
    nearbyPlaces: {
      hospitals: ['AIIMS', 'Ram Manohar Lohia Hospital'],
      schools: ['Modern School', 'St. Columba\'s School'],
      malls: ['Palika Bazaar', 'Central Park'],
      restaurants: ['Karim\'s', 'United Coffee House', 'Wenger\'s']
    },
    movingServices: {
      packers: ['Delhi Packers', 'Capital Movers'],
      localAgents: ['CP Properties', 'Delhi Central Realty'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel']
    }
  }
];

export const EnhancedNeighborhoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [neighborhoods, setNeighborhoods] = useState<ProcessedNeighborhood[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [matchScores, setMatchScores] = useState<WeightedMatchScore[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [15000, 150000],
    minSafety: 0,
    minSchools: 0,
    minTransit: 0,
    features: [],
    city: '',
    sortBy: 'name'
  });

  // Initialize data processing on component mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Initializing enhanced neighborhood data...');
      
      // Enhance neighborhoods with real geographic data (with fallbacks)
      const enhancedNeighborhoods = await Promise.all(
        enhancedMockNeighborhoods.map(async (neighborhood) => {
          try {
            const geoData = await geoService.searchPlaces(neighborhood.name);
            if (geoData && geoData.length > 0) {
              return {
                ...neighborhood,
                coordinates: { lat: geoData[0].lat, lng: geoData[0].lng },
                demographics: {
                  ...neighborhood.demographics,
                  population: geoData[0].population || neighborhood.demographics.population
                }
              };
            }
            return neighborhood;
          } catch (error) {
            console.warn(`Failed to enhance ${neighborhood.name} with geo data:`, error);
            return neighborhood;
          }
        })
      );
      
      // Process neighborhoods with external data (with fallbacks)
      let processedNeighborhoods: ProcessedNeighborhood[];
      try {
        processedNeighborhoods = await dataProcessor.processNeighborhoodData(enhancedNeighborhoods);
      } catch (error) {
        console.warn('Data processing failed, using fallback neighborhoods:', error);
        processedNeighborhoods = enhancedNeighborhoods.map(n => ({
          ...n,
          externalData: null,
          dataQuality: { completeness: 0.7, accuracy: 0.7, freshness: 0.7, consistency: 0.7, overall: 0.7 },
          lastProcessed: new Date().toISOString(),
          processingErrors: ['Using fallback data']
        })) as ProcessedNeighborhood[];
      }
      
      setNeighborhoods(processedNeighborhoods);
      
      // Calculate overall data quality
      const avgQuality = processedNeighborhoods.reduce((sum, n) => sum + (n.dataQuality?.overall || 0.7), 0) / processedNeighborhoods.length;
      setDataQuality(avgQuality);
      setLastUpdated(new Date().toISOString());
      
      console.log(`Data initialization complete. ${processedNeighborhoods.length} neighborhoods processed with ${(avgQuality * 100).toFixed(1)}% average data quality.`);
      
    } catch (error) {
      console.error('Failed to initialize neighborhood data:', error);
      errorHandler.logError(new Error(`Failed to initialize neighborhood data: ${error}`));
      
      // Ultimate fallback to basic neighborhoods
      const fallbackNeighborhoods = enhancedMockNeighborhoods.map(n => ({
        ...n,
        externalData: null,
        dataQuality: { completeness: 0.5, accuracy: 0.5, freshness: 0.5, consistency: 0.5, overall: 0.5 },
        lastProcessed: new Date().toISOString(),
        processingErrors: ['Failed to fetch external data']
      })) as ProcessedNeighborhood[];
      
      setNeighborhoods(fallbackNeighborhoods);
      setDataQuality(0.5);
      setLastUpdated(new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  };

  // Filter neighborhoods based on current filters
  const filteredNeighborhoods = React.useMemo(() => {
    try {
      if (!Array.isArray(neighborhoods)) return [];
      
      return neighborhoods
        .filter(neighborhood => {
          try {
            const priceInRange = (neighborhood.priceRange?.min || 0) >= (filters.priceRange?.[0] || 0) && 
                                (neighborhood.priceRange?.max || 0) <= (filters.priceRange?.[1] || 150000);
            const safetyMet = (neighborhood.ratings?.safety || 0) >= (filters.minSafety || 0);
            const schoolsMet = (neighborhood.ratings?.schools || 0) >= (filters.minSchools || 0);
            const transitMet = (neighborhood.ratings?.transit || 0) >= (filters.minTransit || 0);
            const cityMatch = !filters.city || (neighborhood.city || '').toLowerCase().includes((filters.city || '').toLowerCase());
            const featuresMatch = !Array.isArray(filters.features) || filters.features.length === 0 || 
                                 (Array.isArray(neighborhood.features) && filters.features.some(feature => neighborhood.features.includes(feature)));

            return priceInRange && safetyMet && schoolsMet && transitMet && cityMatch && featuresMatch;
          } catch (error) {
            console.warn('Error filtering neighborhood:', error);
            return true; // Include neighborhood if filtering fails
          }
        })
        .sort((a, b) => {
          try {
            switch (filters.sortBy) {
              case 'price':
                return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
              case 'rating':
                return (b.ratings?.overall || 0) - (a.ratings?.overall || 0);
              case 'popularity':
                return (b.reviews?.length || 0) - (a.reviews?.length || 0);
              default:
                return (a.name || '').localeCompare(b.name || '');
            }
          } catch (error) {
            console.warn('Error sorting neighborhoods:', error);
            return 0;
          }
        });
    } catch (error) {
      console.warn('Error in filteredNeighborhoods:', error);
      return neighborhoods || [];
    }
  }, [neighborhoods, filters]);

  const addToCompare = (id: string) => {
    try {
      if (compareList.length < 3 && !compareList.includes(id)) {
        setCompareList([...compareList, id]);
        recordUserInteraction(id, 'view');
      }
    } catch (error) {
      console.warn('Error adding to compare:', error);
    }
  };

  const removeFromCompare = (id: string) => {
    try {
      setCompareList(compareList.filter(item => item !== id));
    } catch (error) {
      console.warn('Error removing from compare:', error);
    }
  };

  const clearCompare = () => {
    try {
      setCompareList([]);
    } catch (error) {
      console.warn('Error clearing compare:', error);
    }
  };

  const addReview = (neighborhoodId: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => {
    try {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        helpfulBy: []
      };
      
      setNeighborhoods(prev => prev.map(n => 
        n.id === neighborhoodId 
          ? { ...n, reviews: [...(n.reviews || []), newReview] }
          : n
      ));
    } catch (error) {
      console.warn('Error adding review:', error);
    }
  };

  const updateReview = (reviewId: string, updatedReview: Partial<Review>) => {
    try {
      setNeighborhoods(prev => prev.map(neighborhood => ({
        ...neighborhood,
        reviews: (neighborhood.reviews || []).map(review => 
          review.id === reviewId ? { ...review, ...updatedReview } : review
        )
      })));
    } catch (error) {
      console.warn('Error updating review:', error);
    }
  };

  const deleteReview = (reviewId: string) => {
    try {
      setNeighborhoods(prev => prev.map(neighborhood => ({
        ...neighborhood,
        reviews: (neighborhood.reviews || []).filter(review => review.id !== reviewId)
      })));
    } catch (error) {
      console.warn('Error deleting review:', error);
    }
  };

  const markReviewHelpful = (reviewId: string, userId: string) => {
    try {
      setNeighborhoods(prev => prev.map(neighborhood => ({
        ...neighborhood,
        reviews: (neighborhood.reviews || []).map(review => {
          if (review.id === reviewId) {
            const isAlreadyHelpful = (review.helpfulBy || []).includes(userId);
            return {
              ...review,
              helpful: isAlreadyHelpful ? Math.max(0, (review.helpful || 0) - 1) : (review.helpful || 0) + 1,
              helpfulBy: isAlreadyHelpful 
                ? (review.helpfulBy || []).filter(id => id !== userId)
                : [...(review.helpfulBy || []), userId]
            };
          }
          return review;
        })
      })));
    } catch (error) {
      console.warn('Error marking review helpful:', error);
    }
  };

  const getRecommendations = (preferences: UserPreferences): WeightedMatchScore[] => {
    try {
      if (!Array.isArray(neighborhoods) || neighborhoods.length === 0) return [];
      
      const externalData = neighborhoods
        .filter(n => n.externalData)
        .map(n => n.externalData!);
      
      if (externalData.length === 0) {
        // Fallback to basic matching if no external data
        return neighborhoods.slice(0, 3).map(n => ({
          neighborhoodId: n.id,
          totalScore: 0.7,
          weightedScores: {
            affordability: { score: 0.7, weight: 0.25, weighted: 0.175 },
            safety: { score: 0.7, weight: 0.2, weighted: 0.14 },
            convenience: { score: 0.7, weight: 0.2, weighted: 0.14 },
            lifestyle: { score: 0.7, weight: 0.2, weighted: 0.14 },
            commute: { score: 0.7, weight: 0.15, weighted: 0.105 }
          },
          reasoning: ['Good overall match based on available data'],
          confidence: 0.6,
          dataQuality: 0.5
        }));
      }
      
      const recommendations = enhancedMatchingAlgorithm.calculateWeightedMatches(externalData, preferences);
      setMatchScores(recommendations);
      return recommendations;
    } catch (error) {
      console.warn('Error generating recommendations:', error);
      return [];
    }
  };

  const searchNeighborhoods = (query: string): ProcessedNeighborhood[] => {
    try {
      if (!query || !query.trim()) return neighborhoods || [];
      
      const lowercaseQuery = query.toLowerCase();
      return (neighborhoods || []).filter(neighborhood => {
        try {
          return (neighborhood.name || '').toLowerCase().includes(lowercaseQuery) ||
                 (neighborhood.city || '').toLowerCase().includes(lowercaseQuery) ||
                 (neighborhood.state || '').toLowerCase().includes(lowercaseQuery) ||
                 (neighborhood.description || '').toLowerCase().includes(lowercaseQuery) ||
                 (Array.isArray(neighborhood.features) && neighborhood.features.some(feature => feature.toLowerCase().includes(lowercaseQuery)));
        } catch (error) {
          console.warn('Error searching neighborhood:', error);
          return false;
        }
      });
    } catch (error) {
      console.warn('Error in searchNeighborhoods:', error);
      return neighborhoods || [];
    }
  };

  const contactLocalAgent = async (neighborhoodId: string, userInfo: any): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      recordUserInteraction(neighborhoodId, 'contact');
      console.log('Contacting local agent for neighborhood:', neighborhoodId, 'User info:', userInfo);
      return true;
    } catch (error) {
      console.error('Failed to contact local agent:', error);
      return false;
    }
  };

  const refreshData = async (): Promise<void> => {
    try {
      await initializeData();
    } catch (error) {
      console.warn('Error refreshing data:', error);
    }
  };

  const recordUserInteraction = (neighborhoodId: string, type: 'view' | 'save' | 'contact' | 'reject'): void => {
    try {
      enhancedMatchingAlgorithm.recordUserInteraction(neighborhoodId, type);
    } catch (error) {
      console.warn('Error recording user interaction:', error);
    }
  };

  const value: EnhancedNeighborhoodContextType = {
    neighborhoods: neighborhoods || [],
    filteredNeighborhoods: filteredNeighborhoods || [],
    compareList: compareList || [],
    filters: filters || {
      priceRange: [15000, 150000],
      minSafety: 0,
      minSchools: 0,
      minTransit: 0,
      features: [],
      city: '',
      sortBy: 'name'
    },
    isLoading,
    dataQuality: dataQuality || 0,
    lastUpdated: lastUpdated || '',
    matchScores: matchScores || [],
    setFilters,
    addToCompare,
    removeFromCompare,
    clearCompare,
    addReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getRecommendations,
    searchNeighborhoods,
    contactLocalAgent,
    refreshData,
    recordUserInteraction
  };

  return (
    <EnhancedNeighborhoodContext.Provider value={value}>
      {children}
    </EnhancedNeighborhoodContext.Provider>
  );
};

export const useEnhancedNeighborhoods = () => {
  const context = useContext(EnhancedNeighborhoodContext);
  if (context === undefined) {
    throw new Error('useEnhancedNeighborhoods must be used within an EnhancedNeighborhoodProvider');
  }
  return context;
};