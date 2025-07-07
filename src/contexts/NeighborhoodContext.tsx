import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  image: string;
  gallery: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: {
    overall: number;
    safety: number;
    schools: number;
    transit: number;
    nightlife: number;
    cost: number;
  };
  features: string[];
  demographics: {
    population: number;
    medianAge: number;
    medianIncome: number;
  };
  reviews: Review[];
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  nearbyPlaces: {
    hospitals: string[];
    schools: string[];
    malls: string[];
    restaurants: string[];
  };
  movingServices: {
    packers: string[];
    localAgents: string[];
    utilities: string[];
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  helpfulBy: string[];
  pros: string[];
  cons: string[];
}

interface NeighborhoodContextType {
  neighborhoods: Neighborhood[];
  filteredNeighborhoods: Neighborhood[];
  compareList: string[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  addReview: (neighborhoodId: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => void;
  updateReview: (reviewId: string, review: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  markReviewHelpful: (reviewId: string, userId: string) => void;
  getRecommendations: (preferences: any) => Neighborhood[];
  searchNeighborhoods: (query: string) => Neighborhood[];
  contactLocalAgent: (neighborhoodId: string, userInfo: any) => Promise<boolean>;
}

export interface FilterState {
  priceRange: [number, number];
  minSafety: number;
  minSchools: number;
  minTransit: number;
  features: string[];
  city: string;
  sortBy: 'name' | 'price' | 'rating' | 'popularity';
}

const NeighborhoodContext = createContext<NeighborhoodContextType | undefined>(undefined);

// Enhanced Indian neighborhood data with North India focus
const mockNeighborhoods: Neighborhood[] = [
  // South India (existing)
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
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    reviews: [
      {
        id: '1',
        userId: '2',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Great for tech professionals',
        content: 'Amazing connectivity and vibrant startup culture. Lots of good restaurants and cafes. The area is well-connected with metro and has a young, energetic vibe.',
        date: '2024-01-15',
        helpful: 15,
        helpfulBy: ['3'],
        pros: ['Great connectivity', 'Vibrant nightlife', 'Tech ecosystem'],
        cons: ['Expensive', 'Traffic congestion']
      }
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    amenities: ['Metro Station', 'Shopping Malls', 'Hospitals', 'Parks', 'Gyms'],
    nearbyPlaces: {
      hospitals: ['Manipal Hospital', 'Apollo Hospital'],
      schools: ['Delhi Public School', 'Inventure Academy'],
      malls: ['Forum Mall', 'Central Mall'],
      restaurants: ['Toit', 'Arbor Brewing Company', 'Smoke House Deli']
    },
    movingServices: {
      packers: ['Agarwal Packers & Movers', 'Leo Packers & Movers', 'Gati Packers'],
      localAgents: ['Koramangala Properties', 'Tech Hub Realty', 'Bangalore Living'],
      utilities: ['BESCOM', 'BWSSB', 'Airtel Fiber', 'ACT Broadband']
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
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    reviews: [
      {
        id: '2',
        userId: '3',
        userName: 'Arjun Mehta',
        userAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 5,
        title: 'Premium lifestyle destination',
        content: 'Love the energy and premium feel. Great restaurants and close to the sea. Perfect for those who want luxury living.',
        date: '2024-01-20',
        helpful: 22,
        helpfulBy: ['2'],
        pros: ['Premium location', 'Great restaurants', 'Celebrity spotting'],
        cons: ['Very expensive', 'Crowded']
      }
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    amenities: ['Beach Access', 'High-end Restaurants', 'Boutiques', 'Gyms', 'Spas'],
    nearbyPlaces: {
      hospitals: ['Lilavati Hospital', 'Holy Family Hospital'],
      schools: ['Jamnabai Narsee School', 'St. Stanislaus High School'],
      malls: ['Palladium Mall', 'Infiniti Mall'],
      restaurants: ['Trishna', 'Pali Village Cafe', 'Bastian']
    },
    movingServices: {
      packers: ['Mumbai Movers', 'Reliable Packers', 'Express Moving'],
      localAgents: ['Bandra Properties', 'West Side Realty', 'Mumbai Homes'],
      utilities: ['BEST', 'Mumbai Water', 'Jio Fiber', 'Hathway']
    }
  },
  {
    id: '9',
    name: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    description: 'Planned suburb with beautiful lake views, IT companies, and family-friendly environment.',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 32000, max: 65000 },
    ratings: {
      overall: 4.2,
      safety: 4.3,
      schools: 4.5,
      transit: 3.8,
      nightlife: 3.5,
      cost: 3.4
    },
    features: ['planned', 'lake-view', 'family-friendly', 'it-companies', 'educational'],
    demographics: {
      population: 110000,
      medianAge: 33,
      medianIncome: 980000
    },
    reviews: [],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    amenities: ['Lake Access', 'IT Parks', 'Schools', 'Hospitals', 'Shopping Centers'],
    nearbyPlaces: {
      hospitals: ['Hiranandani Hospital', 'Powai Hospital'],
      schools: ['IIT Bombay', 'Hiranandani Foundation School'],
      malls: ['R City Mall', 'Galleria Mall'],
      restaurants: ['Mainland China', 'Cafe Coffee Day', 'Pizza Hut']
    },
    movingServices: {
      packers: ['Powai Packers', 'Lake View Movers', 'Hiranandani Relocations'],
      localAgents: ['Powai Properties', 'Lake Side Realty', 'Hiranandani Homes'],
      utilities: ['BEST', 'Mumbai Water', 'Jio Fiber', 'Hathway']
    }
  },

  // North India Neighborhoods
  {
    id: '3',
    name: 'Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    description: 'The heart of Delhi with colonial architecture, shopping, dining, and excellent connectivity to all parts of the city.',
    image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    reviews: [
      {
        id: '3',
        userId: '1',
        userName: 'Rajesh Kumar',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Central location with great connectivity',
        content: 'Perfect location in the heart of Delhi. Great for business and social life. Metro connectivity is excellent.',
        date: '2024-02-01',
        helpful: 18,
        helpfulBy: ['2', '3'],
        pros: ['Central location', 'Metro connectivity', 'Shopping and dining'],
        cons: ['Expensive', 'Crowded', 'Parking issues']
      }
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    amenities: ['Metro Stations', 'Shopping Centers', 'Restaurants', 'Banks', 'Government Offices'],
    nearbyPlaces: {
      hospitals: ['All India Institute of Medical Sciences', 'Ram Manohar Lohia Hospital'],
      schools: ['Modern School', 'St. Columba\'s School'],
      malls: ['Palika Bazaar', 'Central Park', 'Khan Market'],
      restaurants: ['Karim\'s', 'United Coffee House', 'Wenger\'s']
    },
    movingServices: {
      packers: ['Delhi Packers', 'Capital Movers', 'Metro Relocations'],
      localAgents: ['CP Properties', 'Delhi Central Realty', 'Capital Homes'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel', 'MTNL']
    }
  },
  {
    id: '4',
    name: 'Cyber City',
    city: 'Gurgaon',
    state: 'Haryana',
    description: 'Modern business district with multinational companies, high-rise apartments, and excellent infrastructure.',
    image: 'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 35000, max: 75000 },
    ratings: {
      overall: 4.3,
      safety: 4.4,
      schools: 4.1,
      transit: 4.0,
      nightlife: 4.2,
      cost: 3.1
    },
    features: ['modern', 'it-sector', 'high-rise', 'international-companies', 'planned'],
    demographics: {
      population: 150000,
      medianAge: 29,
      medianIncome: 1300000
    },
    reviews: [
      {
        id: '4',
        userId: '2',
        userName: 'Neha Gupta',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Great for IT professionals',
        content: 'Modern infrastructure and close to major IT companies. Good amenities and safety. Metro connectivity has improved significantly.',
        date: '2024-02-10',
        helpful: 25,
        helpfulBy: ['1', '3'],
        pros: ['Modern infrastructure', 'IT hub', 'Safety', 'Metro connectivity'],
        cons: ['Expensive', 'Traffic during peak hours', 'Limited local culture']
      }
    ],
    coordinates: { lat: 28.4595, lng: 77.0266 },
    amenities: ['Metro Station', 'Shopping Malls', 'Corporate Parks', 'Hospitals', 'International Schools'],
    nearbyPlaces: {
      hospitals: ['Medanta Hospital', 'Fortis Hospital', 'Max Hospital'],
      schools: ['DPS Gurgaon', 'Shri Ram School', 'Heritage School'],
      malls: ['Ambience Mall', 'DLF Mega Mall', 'Cyber Hub'],
      restaurants: ['Social', 'Farzi Cafe', 'Cyber Hub Food Court']
    },
    movingServices: {
      packers: ['Gurgaon Packers', 'Millennium City Movers', 'DLF Relocations'],
      localAgents: ['Cyber City Properties', 'Gurgaon Realty', 'Millennium Homes'],
      utilities: ['DHBVN', 'Gurgaon Water', 'Airtel Fiber', 'Jio']
    }
  },
  {
    id: '5',
    name: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    description: 'IT and corporate hub with modern amenities, good connectivity, and planned infrastructure.',
    image: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 28000, max: 55000 },
    ratings: {
      overall: 4.1,
      safety: 4.2,
      schools: 4.0,
      transit: 4.3,
      nightlife: 3.8,
      cost: 3.8
    },
    features: ['it-sector', 'planned', 'metro', 'affordable', 'modern'],
    demographics: {
      population: 125000,
      medianAge: 30,
      medianIncome: 950000
    },
    reviews: [
      {
        id: '5',
        userId: '3',
        userName: 'Amit Singh',
        userAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Good value for money',
        content: 'Well-planned sector with good connectivity to Delhi. Affordable compared to Gurgaon with similar amenities.',
        date: '2024-02-15',
        helpful: 12,
        helpfulBy: ['1'],
        pros: ['Affordable', 'Metro connectivity', 'Planned infrastructure', 'IT companies nearby'],
        cons: ['Limited nightlife', 'Distance from Delhi center', 'Air quality issues']
      }
    ],
    coordinates: { lat: 28.6139, lng: 77.3910 },
    amenities: ['Metro Station', 'IT Parks', 'Shopping Centers', 'Hospitals', 'Schools'],
    nearbyPlaces: {
      hospitals: ['Fortis Hospital', 'Max Hospital', 'Kailash Hospital'],
      schools: ['DPS Noida', 'Amity International School', 'Genesis Global School'],
      malls: ['The Great India Place', 'DLF Mall of India', 'Sector 18 Market'],
      restaurants: ['Barbeque Nation', 'Haldiram\'s', 'Cafe Coffee Day']
    },
    movingServices: {
      packers: ['Noida Packers', 'UP Movers', 'Sector Relocations'],
      localAgents: ['Noida Properties', 'Sector 62 Realty', 'UP Homes'],
      utilities: ['PVVNL', 'Noida Water', 'Airtel', 'BSNL']
    }
  },
  {
    id: '6',
    name: 'Saket',
    city: 'Delhi',
    state: 'Delhi',
    description: 'Upscale South Delhi neighborhood known for shopping, dining, and residential complexes.',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 45000, max: 90000 },
    ratings: {
      overall: 4.5,
      safety: 4.6,
      schools: 4.3,
      transit: 4.1,
      nightlife: 4.4,
      cost: 2.9
    },
    features: ['upscale', 'shopping', 'restaurants', 'metro', 'residential', 'premium'],
    demographics: {
      population: 80000,
      medianAge: 34,
      medianIncome: 1400000
    },
    reviews: [
      {
        id: '6',
        userId: '1',
        userName: 'Kavya Sharma',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 5,
        title: 'Premium South Delhi living',
        content: 'Excellent neighborhood with great shopping and dining options. Very safe and well-maintained. Perfect for families.',
        date: '2024-02-20',
        helpful: 30,
        helpfulBy: ['2', '3'],
        pros: ['Very safe', 'Great shopping', 'Premium location', 'Metro connectivity'],
        cons: ['Very expensive', 'Traffic congestion', 'Limited parking']
      }
    ],
    coordinates: { lat: 28.5245, lng: 77.2066 },
    amenities: ['Metro Station', 'Shopping Malls', 'Restaurants', 'Hospitals', 'Parks'],
    nearbyPlaces: {
      hospitals: ['Max Hospital', 'Batra Hospital', 'Apollo Hospital'],
      schools: ['DPS Saket', 'Modern School', 'Vasant Valley School'],
      malls: ['Select City Walk', 'DLF Place', 'Saket City Centre'],
      restaurants: ['Hauz Khas Social', 'Cafe Delhi Heights', 'Punjabi By Nature']
    },
    movingServices: {
      packers: ['South Delhi Packers', 'Saket Movers', 'Premium Relocations'],
      localAgents: ['Saket Properties', 'South Delhi Realty', 'Premium Homes'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel Fiber', 'Jio']
    }
  },
  {
    id: '7',
    name: 'Rajouri Garden',
    city: 'Delhi',
    state: 'Delhi',
    description: 'Popular West Delhi area known for shopping, food, and excellent metro connectivity.',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 25000, max: 50000 },
    ratings: {
      overall: 4.0,
      safety: 3.9,
      schools: 3.8,
      transit: 4.5,
      nightlife: 4.1,
      cost: 4.2
    },
    features: ['affordable', 'shopping', 'metro', 'food', 'commercial', 'family-friendly'],
    demographics: {
      population: 200000,
      medianAge: 32,
      medianIncome: 750000
    },
    reviews: [
      {
        id: '7',
        userId: '2',
        userName: 'Rohit Verma',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Great connectivity and shopping',
        content: 'Excellent metro connectivity and great shopping options. Food scene is amazing. Good value for money in Delhi.',
        date: '2024-02-25',
        helpful: 16,
        helpfulBy: ['1', '3'],
        pros: ['Metro connectivity', 'Shopping', 'Food options', 'Affordable'],
        cons: ['Crowded', 'Traffic', 'Noise levels']
      }
    ],
    coordinates: { lat: 28.6496, lng: 77.1174 },
    amenities: ['Metro Stations', 'Shopping Markets', 'Restaurants', 'Hospitals', 'Schools'],
    nearbyPlaces: {
      hospitals: ['Jaipur Golden Hospital', 'Mata Chanan Devi Hospital'],
      schools: ['DAV Public School', 'Kendriya Vidyalaya', 'Ryan International'],
      malls: ['TDI Mall', 'West Gate Mall', 'Rajouri Garden Market'],
      restaurants: ['Haldiram\'s', 'Bikanervala', 'Punjabi Dhaba']
    },
    movingServices: {
      packers: ['West Delhi Packers', 'Rajouri Movers', 'Delhi West Relocations'],
      localAgents: ['Rajouri Properties', 'West Delhi Realty', 'Garden Homes'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel', 'MTNL']
    }
  },
  {
    id: '8',
    name: 'Golf Course Road',
    city: 'Gurgaon',
    state: 'Haryana',
    description: 'Premium residential area with luxury apartments, golf courses, and high-end amenities.',
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 50000, max: 120000 },
    ratings: {
      overall: 4.6,
      safety: 4.7,
      schools: 4.4,
      transit: 3.9,
      nightlife: 4.3,
      cost: 2.5
    },
    features: ['premium', 'golf-course', 'luxury', 'high-rise', 'upscale', 'gated-community'],
    demographics: {
      population: 75000,
      medianAge: 36,
      medianIncome: 1800000
    },
    reviews: [
      {
        id: '8',
        userId: '3',
        userName: 'Sanjay Malhotra',
        userAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 5,
        title: 'Luxury living at its best',
        content: 'Premium location with excellent amenities. Golf course views and high-end facilities. Perfect for luxury living.',
        date: '2024-03-01',
        helpful: 28,
        helpfulBy: ['1', '2'],
        pros: ['Luxury amenities', 'Golf course', 'Safety', 'Premium location'],
        cons: ['Very expensive', 'Limited public transport', 'Traffic during peak hours']
      }
    ],
    coordinates: { lat: 28.4089, lng: 77.0507 },
    amenities: ['Golf Course', 'Luxury Malls', 'Fine Dining', 'Spas', 'Private Clubs'],
    nearbyPlaces: {
      hospitals: ['Artemis Hospital', 'Park Hospital', 'Columbia Asia'],
      schools: ['The Shri Ram School', 'Pathways School', 'Heritage Xperiential School'],
      malls: ['DLF Emporio', 'Galleria Market', 'Good Earth City Centre'],
      restaurants: ['Indian Accent', 'Olive Bar & Kitchen', 'Farzi Cafe']
    },
    movingServices: {
      packers: ['Premium Packers Gurgaon', 'Golf Course Movers', 'Luxury Relocations'],
      localAgents: ['Golf Course Properties', 'Premium Gurgaon Realty', 'Luxury Homes'],
      utilities: ['DHBVN', 'Gurgaon Water', 'Airtel Fiber', 'Jio Fiber']
    }
  },
  {
    id: '10',
    name: 'Lajpat Nagar',
    city: 'Delhi',
    state: 'Delhi',
    description: 'Vibrant South Delhi market area known for shopping, street food, and cultural diversity.',
    image: 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 30000, max: 60000 },
    ratings: {
      overall: 3.9,
      safety: 3.8,
      schools: 3.7,
      transit: 4.2,
      nightlife: 4.0,
      cost: 4.0
    },
    features: ['market', 'cultural', 'affordable', 'metro', 'food', 'shopping'],
    demographics: {
      population: 180000,
      medianAge: 33,
      medianIncome: 680000
    },
    reviews: [
      {
        id: '10',
        userId: '1',
        userName: 'Meera Jain',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Cultural hub with great shopping',
        content: 'Love the vibrant market culture and amazing street food. Great shopping options and very affordable. Metro connectivity is good.',
        date: '2024-03-05',
        helpful: 14,
        helpfulBy: ['2'],
        pros: ['Great shopping', 'Street food', 'Cultural diversity', 'Metro connectivity'],
        cons: ['Crowded', 'Parking issues', 'Noise levels']
      }
    ],
    coordinates: { lat: 28.5677, lng: 77.2431 },
    amenities: ['Metro Station', 'Markets', 'Restaurants', 'Hospitals', 'Cultural Centers'],
    nearbyPlaces: {
      hospitals: ['All India Institute of Medical Sciences', 'Safdarjung Hospital'],
      schools: ['Kendriya Vidyalaya', 'Sarvodaya Vidyalaya', 'DPS Lajpat Nagar'],
      malls: ['Lajpat Nagar Central Market', 'South Extension Market'],
      restaurants: ['Karim\'s', 'Al Jawahar', 'Paranthe Wali Gali']
    },
    movingServices: {
      packers: ['Lajpat Packers', 'South Delhi Movers', 'Market Relocations'],
      localAgents: ['Lajpat Properties', 'South Delhi Homes', 'Market Realty'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel', 'MTNL']
    }
  },
  {
    id: '11',
    name: 'Sector 50',
    city: 'Noida',
    state: 'Uttar Pradesh',
    description: 'Well-developed residential sector with good amenities, parks, and connectivity.',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 26000, max: 48000 },
    ratings: {
      overall: 4.0,
      safety: 4.1,
      schools: 3.9,
      transit: 4.0,
      nightlife: 3.6,
      cost: 4.1
    },
    features: ['residential', 'family-friendly', 'parks', 'affordable', 'planned', 'metro'],
    demographics: {
      population: 90000,
      medianAge: 31,
      medianIncome: 820000
    },
    reviews: [
      {
        id: '11',
        userId: '2',
        userName: 'Anita Gupta',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Great for families',
        content: 'Peaceful residential area with good parks and schools. Very family-friendly environment. Good value for money.',
        date: '2024-03-10',
        helpful: 11,
        helpfulBy: ['1', '3'],
        pros: ['Family-friendly', 'Parks', 'Affordable', 'Peaceful'],
        cons: ['Limited nightlife', 'Distance from Delhi', 'Public transport']
      }
    ],
    coordinates: { lat: 28.5706, lng: 77.3272 },
    amenities: ['Parks', 'Community Centers', 'Schools', 'Hospitals', 'Shopping Areas'],
    nearbyPlaces: {
      hospitals: ['Yatharth Hospital', 'Sharda Hospital', 'Kailash Hospital'],
      schools: ['Lotus Valley School', 'Amity International', 'Delhi Public School'],
      malls: ['Sector 18 Market', 'The Great India Place', 'Gardens Galleria'],
      restaurants: ['Barbeque Nation', 'Pizza Hut', 'McDonald\'s']
    },
    movingServices: {
      packers: ['Sector 50 Packers', 'Noida Family Movers', 'Residential Relocations'],
      localAgents: ['Sector 50 Properties', 'Noida Family Homes', 'Residential Realty'],
      utilities: ['PVVNL', 'Noida Authority', 'Airtel', 'BSNL']
    }
  },
  {
    id: '12',
    name: 'Vasant Kunj',
    city: 'Delhi',
    state: 'Delhi',
    description: 'Upscale South Delhi area with modern apartments, malls, and proximity to the airport.',
    image: 'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1438844/pexels-photo-1438844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    priceRange: { min: 42000, max: 85000 },
    ratings: {
      overall: 4.4,
      safety: 4.5,
      schools: 4.2,
      transit: 4.0,
      nightlife: 4.1,
      cost: 3.2
    },
    features: ['upscale', 'modern', 'airport-proximity', 'malls', 'metro', 'residential'],
    demographics: {
      population: 85000,
      medianAge: 35,
      medianIncome: 1250000
    },
    reviews: [
      {
        id: '12',
        userId: '3',
        userName: 'Vikram Sethi',
        userAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4,
        title: 'Modern living with great amenities',
        content: 'Excellent location with modern amenities. Close to airport which is convenient for travel. Good shopping and dining options.',
        date: '2024-03-15',
        helpful: 19,
        helpfulBy: ['1', '2'],
        pros: ['Modern amenities', 'Airport proximity', 'Shopping malls', 'Safety'],
        cons: ['Expensive', 'Traffic', 'Limited metro connectivity']
      }
    ],
    coordinates: { lat: 28.5355, lng: 77.1580 },
    amenities: ['Shopping Malls', 'Restaurants', 'Hospitals', 'Schools', 'Parks'],
    nearbyPlaces: {
      hospitals: ['Fortis Hospital', 'Max Hospital', 'Indraprastha Apollo'],
      schools: ['Vasant Valley School', 'The Shri Ram School', 'Modern School'],
      malls: ['Ambience Mall', 'DLF Promenade', 'Vasant Square Mall'],
      restaurants: ['Social', 'Hard Rock Cafe', 'TGI Friday\'s']
    },
    movingServices: {
      packers: ['Vasant Kunj Packers', 'South Delhi Premium Movers', 'Airport Relocations'],
      localAgents: ['Vasant Kunj Properties', 'South Delhi Premium Homes', 'Modern Realty'],
      utilities: ['BSES', 'Delhi Jal Board', 'Airtel Fiber', 'Jio Fiber']
    }
  }
];

// Simulate review storage
let reviewStorage: Review[] = [];
mockNeighborhoods.forEach(n => {
  reviewStorage.push(...n.reviews);
});

export const NeighborhoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [neighborhoods] = useState<Neighborhood[]>(mockNeighborhoods);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [15000, 150000],
    minSafety: 0,
    minSchools: 0,
    minTransit: 0,
    features: [],
    city: '',
    sortBy: 'name'
  });

  const filteredNeighborhoods = neighborhoods
    .filter(neighborhood => {
      const priceInRange = neighborhood.priceRange.min >= filters.priceRange[0] && 
                          neighborhood.priceRange.max <= filters.priceRange[1];
      const safetyMet = neighborhood.ratings.safety >= filters.minSafety;
      const schoolsMet = neighborhood.ratings.schools >= filters.minSchools;
      const transitMet = neighborhood.ratings.transit >= filters.minTransit;
      const cityMatch = !filters.city || neighborhood.city.toLowerCase().includes(filters.city.toLowerCase());
      const featuresMatch = filters.features.length === 0 || 
                           filters.features.some(feature => neighborhood.features.includes(feature));

      return priceInRange && safetyMet && schoolsMet && transitMet && cityMatch && featuresMatch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.priceRange.min - b.priceRange.min;
        case 'rating':
          return b.ratings.overall - a.ratings.overall;
        case 'popularity':
          return b.reviews.length - a.reviews.length;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCompare = (id: string) => {
    if (compareList.length < 3 && !compareList.includes(id)) {
      setCompareList([...compareList, id]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(item => item !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const addReview = (neighborhoodId: string, review: Omit<Review, 'id' | 'date' | 'helpful' | 'helpfulBy'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      helpfulBy: []
    };
    
    reviewStorage.push(newReview);
    
    // Update neighborhood reviews
    const neighborhoodIndex = neighborhoods.findIndex(n => n.id === neighborhoodId);
    if (neighborhoodIndex !== -1) {
      neighborhoods[neighborhoodIndex].reviews.push(newReview);
    }
  };

  const updateReview = (reviewId: string, updatedReview: Partial<Review>) => {
    const reviewIndex = reviewStorage.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
      reviewStorage[reviewIndex] = { ...reviewStorage[reviewIndex], ...updatedReview };
      
      // Update in neighborhoods
      neighborhoods.forEach(neighborhood => {
        const nReviewIndex = neighborhood.reviews.findIndex(r => r.id === reviewId);
        if (nReviewIndex !== -1) {
          neighborhood.reviews[nReviewIndex] = { ...neighborhood.reviews[nReviewIndex], ...updatedReview };
        }
      });
    }
  };

  const deleteReview = (reviewId: string) => {
    reviewStorage = reviewStorage.filter(r => r.id !== reviewId);
    
    // Remove from neighborhoods
    neighborhoods.forEach(neighborhood => {
      neighborhood.reviews = neighborhood.reviews.filter(r => r.id !== reviewId);
    });
  };

  const markReviewHelpful = (reviewId: string, userId: string) => {
    const review = reviewStorage.find(r => r.id === reviewId);
    if (review) {
      if (review.helpfulBy.includes(userId)) {
        review.helpfulBy = review.helpfulBy.filter(id => id !== userId);
        review.helpful = Math.max(0, review.helpful - 1);
      } else {
        review.helpfulBy.push(userId);
        review.helpful += 1;
      }
      
      updateReview(reviewId, { helpful: review.helpful, helpfulBy: review.helpfulBy });
    }
  };

  const getRecommendations = (preferences: any): Neighborhood[] => {
    if (!preferences) return neighborhoods.slice(0, 3);
    
    return neighborhoods
      .map(neighborhood => {
        let score = 0;
        
        // Budget compatibility
        if (preferences.budget) {
          const budgetMatch = neighborhood.priceRange.min <= preferences.budget && 
                             neighborhood.priceRange.max >= preferences.budget * 0.8;
          if (budgetMatch) score += 3;
        }
        
        // Priority matching
        if (preferences.priorities) {
          preferences.priorities.forEach((priority: string) => {
            switch (priority) {
              case 'safety':
                score += neighborhood.ratings.safety;
                break;
              case 'schools':
                score += neighborhood.ratings.schools;
                break;
              case 'transit':
                score += neighborhood.ratings.transit;
                break;
              case 'nightlife':
                score += neighborhood.ratings.nightlife;
                break;
              case 'cost':
                score += neighborhood.ratings.cost;
                break;
            }
          });
        }
        
        // Lifestyle matching
        if (preferences.lifestyle) {
          const lifestyleMatch = preferences.lifestyle.some((style: string) => 
            neighborhood.features.includes(style)
          );
          if (lifestyleMatch) score += 2;
        }
        
        return { ...neighborhood, score };
      })
      .sort((a, b) => (b as any).score - (a as any).score)
      .slice(0, 3);
  };

  const searchNeighborhoods = (query: string): Neighborhood[] => {
    if (!query.trim()) return neighborhoods;
    
    const lowercaseQuery = query.toLowerCase();
    return neighborhoods.filter(neighborhood =>
      neighborhood.name.toLowerCase().includes(lowercaseQuery) ||
      neighborhood.city.toLowerCase().includes(lowercaseQuery) ||
      neighborhood.state.toLowerCase().includes(lowercaseQuery) ||
      neighborhood.description.toLowerCase().includes(lowercaseQuery) ||
      neighborhood.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  };

  const contactLocalAgent = async (neighborhoodId: string, userInfo: any): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send an email or create a lead
    console.log('Contacting local agent for neighborhood:', neighborhoodId, 'User info:', userInfo);
    
    return true;
  };

  const value: NeighborhoodContextType = {
    neighborhoods,
    filteredNeighborhoods,
    compareList,
    filters,
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
    contactLocalAgent
  };

  return (
    <NeighborhoodContext.Provider value={value}>
      {children}
    </NeighborhoodContext.Provider>
  );
};

export const useNeighborhoods = () => {
  const context = useContext(NeighborhoodContext);
  if (context === undefined) {
    throw new Error('useNeighborhoods must be used within a NeighborhoodProvider');
  }
  return context;
};