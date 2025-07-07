import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Neighborhood, Review, FilterState } from './NeighborhoodContext';
import { dataProcessor, ProcessedNeighborhood } from '../services/dataProcessor';
import { matchingAlgorithm, UserPreferences, MatchScore } from '../services/matchingAlgorithm';
import { fetchGeoNamesData } from '../services/fetchNeighborhoodData'; // ✅ NEW

interface EnhancedNeighborhoodContextType {
  neighborhoods: ProcessedNeighborhood[];
  filteredNeighborhoods: ProcessedNeighborhood[];
  compareList: string[];
  filters: FilterState;
  isLoading: boolean;
  dataQuality: number;
  lastUpdated: string;
  matchScores: MatchScore[];
  setFilters: (filters: FilterState) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  addReview: (neighborhoodId: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => void;
  updateReview: (reviewId: string, review: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  markReviewHelpful: (reviewId: string, userId: string) => void;
  getRecommendations: (preferences: UserPreferences) => MatchScore[];
  searchNeighborhoods: (query: string) => ProcessedNeighborhood[];
  contactLocalAgent: (neighborhoodId: string, userInfo: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
  recordUserInteraction: (neighborhoodId: string, type: 'view' | 'save' | 'contact' | 'reject') => void;
}

const EnhancedNeighborhoodContext = createContext<EnhancedNeighborhoodContextType | undefined>(undefined);

export const EnhancedNeighborhoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [neighborhoods, setNeighborhoods] = useState<ProcessedNeighborhood[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [matchScores, setMatchScores] = useState<MatchScore[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [15000, 150000],
    minSafety: 0,
    minSchools: 0,
    minTransit: 0,
    features: [],
    city: '',
    sortBy: 'name'
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      const baseData = await import('../data/mockNeighborhoods.json');

      const enrichedData = await Promise.all(
        baseData.default.map(async (n: Neighborhood) => {
          const geo = await fetchGeoNamesData(n.city);
          if (geo) {
            n.coordinates = { lat: geo.lat, lng: geo.lng };
            n.demographics.population = geo.population || n.demographics.population;
          }
          return n;
        })
      );

      const processed = await dataProcessor.processNeighborhoodData(enrichedData);
      setNeighborhoods(processed);

      const avgQ = processed.reduce((sum, n) => sum + (n.dataQuality?.overall || 0), 0) / processed.length;
      setDataQuality(avgQ);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Data initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNeighborhoods = neighborhoods
    .filter(n =>
      n.priceRange.min >= filters.priceRange[0] &&
      n.priceRange.max <= filters.priceRange[1] &&
      n.ratings.safety >= filters.minSafety &&
      n.ratings.schools >= filters.minSchools &&
      n.ratings.transit >= filters.minTransit &&
      (!filters.city || n.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.features.length === 0 || filters.features.some(f => n.features.includes(f)))
    )
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price': return a.priceRange.min - b.priceRange.min;
        case 'rating': return b.ratings.overall - a.ratings.overall;
        case 'popularity': return b.reviews.length - a.reviews.length;
        default: return a.name.localeCompare(b.name);
      }
    });

  const addToCompare = (id: string) => !compareList.includes(id) && setCompareList([...compareList, id]);
  const removeFromCompare = (id: string) => setCompareList(compareList.filter(cid => cid !== id));
  const clearCompare = () => setCompareList([]);

  const addReview = (nid: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => {
    const fullReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      helpful: 0,
      helpfulBy: []
    };
    setNeighborhoods(prev => prev.map(n => n.id === nid ? { ...n, reviews: [...n.reviews, fullReview] } : n));
  };

  const updateReview = (rid: string, update: Partial<Review>) =>
    setNeighborhoods(prev =>
      prev.map(n => ({ ...n, reviews: n.reviews.map(r => r.id === rid ? { ...r, ...update } : r) }))
    );

  const deleteReview = (rid: string) =>
    setNeighborhoods(prev =>
      prev.map(n => ({ ...n, reviews: n.reviews.filter(r => r.id !== rid) }))
    );

  const markReviewHelpful = (rid: string, uid: string) =>
    setNeighborhoods(prev =>
      prev.map(n => ({
        ...n,
        reviews: n.reviews.map(r => {
          const isHelpful = r.helpfulBy.includes(uid);
          return r.id === rid
            ? {
                ...r,
                helpful: isHelpful ? r.helpful - 1 : r.helpful + 1,
                helpfulBy: isHelpful ? r.helpfulBy.filter(id => id !== uid) : [...r.helpfulBy, uid]
              }
            : r;
        })
      }))
    );

  const getRecommendations = (preferences: UserPreferences) => {
    try {
      const externalData = neighborhoods.map(n => n.externalData).filter(Boolean);
      const recs = matchingAlgorithm.getPersonalizedRecommendations(externalData, preferences);
      setMatchScores(recs);
      return recs;
    } catch (e) {
      console.error('Recommendation error:', e);
      return [];
    }
  };

  const searchNeighborhoods = (query: string) => {
    const q = query.toLowerCase();
    return neighborhoods.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) ||
      n.state.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.features.some(f => f.toLowerCase().includes(q))
    );
  };

  const contactLocalAgent = async (id: string, user: any) => {
    try {
      console.log(`Contacted agent for ${id}`, user);
      recordUserInteraction(id, 'contact');
      return true;
    } catch (e) {
      return false;
    }
  };

  const refreshData = async () => await initializeData();

  const recordUserInteraction = (id: string, type: 'view' | 'save' | 'contact' | 'reject') => {
    matchingAlgorithm.recordUserInteraction(id, type);
  };

  return (
    <EnhancedNeighborhoodContext.Provider
      value={{
        neighborhoods,
        filteredNeighborhoods,
        compareList,
        filters,
        isLoading,
        dataQuality,
        lastUpdated,
        matchScores,
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
      }}
    >
      {children}
    </EnhancedNeighborhoodContext.Provider>
  );
};

export const useEnhancedNeighborhoods = () => {
  const ctx = useContext(EnhancedNeighborhoodContext);
  if (!ctx) throw new Error('useEnhancedNeighborhoods must be used within EnhancedNeighborhoodProvider');
  return ctx;
};
