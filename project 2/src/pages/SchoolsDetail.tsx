import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Star, MapPin, Phone, Globe, Users, Award, Clock, BookOpen } from 'lucide-react';

const SchoolsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock school data based on neighborhood
  const getSchoolsForNeighborhood = (neighborhoodId: string) => {
    const schoolsData: Record<string, any[]> = {
      '1': [ // Koramangala
        {
          id: '1',
          name: 'Delhi Public School Koramangala',
          type: 'Private',
          board: 'CBSE',
          rating: 4.5,
          fees: '₹2,50,000/year',
          grades: 'Pre-K to 12',
          students: 2500,
          established: 1985,
          image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'One of the premier educational institutions in Koramangala known for academic excellence.',
          facilities: ['Smart Classrooms', 'Science Labs', 'Computer Lab', 'Library', 'Sports Complex'],
          achievements: ['Top 10 Schools in Bangalore', 'Best Infrastructure Award', '100% Board Results'],
          timings: '8:00 AM - 3:00 PM',
          contact: {
            phone: '+91-80-2345-6789',
            website: 'www.dpskoramangala.edu.in'
          },
          address: 'Koramangala, Bangalore'
        }
      ],
      '2': [ // Bandra West
        {
          id: '2',
          name: 'Jamnabai Narsee School',
          type: 'Private',
          board: 'ICSE',
          rating: 4.6,
          fees: '₹3,50,000/year',
          grades: 'Pre-K to 12',
          students: 1800,
          established: 1967,
          image: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Premium educational institution in Bandra West with excellent academic standards.',
          facilities: ['Digital Classrooms', 'Science Labs', 'Arts Studio', 'Swimming Pool', 'Auditorium'],
          achievements: ['Top School in Mumbai', 'Excellence in Arts', '98% University Admissions'],
          timings: '7:45 AM - 2:30 PM',
          contact: {
            phone: '+91-22-2640-0621',
            website: 'www.jamnabainarsee.edu.in'
          },
          address: 'Bandra West, Mumbai'
        }
      ],
      '9': [ // Powai
        {
          id: '9',
          name: 'Hiranandani Foundation School',
          type: 'Private',
          board: 'IGCSE/IB',
          rating: 4.4,
          fees: '₹4,00,000/year',
          grades: 'Pre-K to 12',
          students: 1500,
          established: 1995,
          image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'International curriculum school in Powai with modern facilities and global outlook.',
          facilities: ['International Curriculum', 'Modern Labs', 'Sports Academy', 'Arts Center', 'Library'],
          achievements: ['IB World School', 'Cambridge Certified', 'International Recognition'],
          timings: '8:00 AM - 3:30 PM',
          contact: {
            phone: '+91-22-2570-4000',
            website: 'www.hfs.edu.in'
          },
          address: 'Powai, Mumbai'
        }
      ]
    };

    return schoolsData[neighborhoodId] || schoolsData['1'];
  };

  const schools = getSchoolsForNeighborhood(id || '1');
  const school = schools[0];

  const handleScheduleVisit = () => {
    alert('Visit scheduled! The school will contact you within 24 hours to confirm the appointment.');
  };

  const handleDownloadBrochure = () => {
    // In a real app, this would trigger a download
    alert('Brochure download started! Check your downloads folder.');
  };

  const handleContactSchool = () => {
    setShowContactModal(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('Your message has been sent to the school. They will contact you soon!');
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to={`/neighborhood/${id}`}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Neighborhood
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 transition-colors">
          <div className="relative h-64 md:h-80">
            <img
              src={school.image}
              alt={school.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-8 w-8 mr-3" />
                  <h1 className="text-3xl md:text-4xl font-bold">{school.name}</h1>
                </div>
                <div className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  {school.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">School Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{school.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white ml-1">{school.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{school.students}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{school.established}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Established</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{school.board}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Board</div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {school.facilities.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h2>
              <div className="space-y-3">
                {school.achievements.map((achievement: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-3" />
                    <span className="text-gray-900 dark:text-white">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">{school.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Grades</span>
                  <span className="font-medium text-gray-900 dark:text-white">{school.grades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Annual Fees</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{school.fees}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{school.timings}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-900 dark:text-white">{school.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-900 dark:text-white">{school.contact.website}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleScheduleVisit}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Schedule Visit
                </button>
                <button 
                  onClick={handleDownloadBrochure}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Brochure
                </button>
                <button 
                  onClick={handleContactSchool}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Contact School
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact {school.name}</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsDetail;