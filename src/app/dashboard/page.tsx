'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Fort interface
interface Fort {
  _id: string;
  name: string;
  description: string;
  location: string;
  district: string;
  history: string;
  imageUrl: string;
}

export default function Dashboard() {
  const [forts, setForts] = useState<Fort[]>([]);
  const [filteredForts, setFilteredForts] = useState<Fort[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [selectedFort, setSelectedFort] = useState<Fort | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const authCookie = Cookies.get('auth_token');
        
        if (!token && !authCookie) {
          router.push('/login');
          return;
        }
        
        // If there's an auth cookie but no token in localStorage, sync them
        if (authCookie && !token) {
          localStorage.setItem('token', authCookie);
        }
        
        setAuthChecked(true);
      } catch (err) {
        console.error('Error checking authentication:', err);
        router.push('/login');
      }
    };
    
    checkAuth();
    
    // Fetch forts data when component mounts
    const fetchForts = async () => {
      try {
        setLoading(true);
        console.log('Fetching forts data...');
        let data = [];
        
        try {
          const response = await fetch('/api/forts');
          console.log('Forts API response status:', response.status);
          
          if (response.ok) {
            data = await response.json();
            console.log(`Fetched ${data.length} forts successfully from API`);
          } else {
            console.warn(`API returned status ${response.status}. Using fallback data.`);
            throw new Error('API request failed');
          }
        } catch (apiError) {
          console.error('Error fetching from API, using fallback data:', apiError);
          throw new Error('API request failed, using fallback data');
        }
        
        if (data && data.length > 0) {
          setForts(data);
          setFilteredForts(data);
        } else {
          throw new Error('No forts returned from API');
        }
      } catch (err: any) {
        console.error('Using fallback fort data:', err);
        setError('Using locally stored fort data');
        
        // For development - create dummy data when API fails
        const dummyForts = initialForts.map((fort, index) => ({
          _id: `dummy-${index}`,
          ...fort,
          imageUrl: getImageForFort(fort.name)
        }));
        
        console.log('Using dummy data for development');
        setForts(dummyForts);
        setFilteredForts(dummyForts);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchForts();

    // Populate the database with sample data if needed (first visit)
    const seedDatabase = async () => {
      try {
        console.log('Seeding database...');
        const response = await fetch('/api/forts/seed', {
          method: 'POST',
        });
        
        console.log('Seed API response status:', response.status);
        
        if (response.status === 401) {
          console.log('Auth issue detected in seeding, but continuing for development');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error seeding database:', errorData.error);
        } else {
          console.log('Database seeded successfully');
        }
      } catch (err) {
        console.error('Error seeding database:', err);
      }
    };
    
    // Seed the database
    seedDatabase();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredForts(forts);
    } else {
      const filtered = forts.filter(fort => 
        fort.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredForts(filtered);
    }
  }, [searchTerm, forts]);

  // Handle fort selection
  const handleFortSelect = (fort: Fort) => {
    setSelectedFort(fort);
  };

  // Close fort details modal
  const closeModal = () => {
    setSelectedFort(null);
  };
  
  // Helper function to get image URL for a fort name
  const getImageForFort = (fortName: string): string => {
    const imageMap: Record<string, string> = {
      'Raigad Fort': 'data:image/jpeg;base64,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',
      'Pratapgad Fort': 'https://www.holidify.com/images/cmsuploads/compressed/Pratapgad_Fort_20181008171849.jpg',
      'Sinhagad Fort': 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1307889884_20191024175636.jpg',
      'Shivneri Fort': 'https://www.holidify.com/images/cmsuploads/compressed/800px-Shivneri_Fort_0_0_20180402132205.jpg',
      'Torna Fort': 'https://www.holidify.com/images/cmsuploads/compressed/5877_20210306213100.jpg',
      'Lohagad Fort': 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1453349067_20191024180410.jpg',
      'Harishchandragad Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Harishchandragad_Konkan_Kada.jpg/1200px-Harishchandragad_Konkan_Kada.jpg',
      'Murud Janjira Fort': 'https://www.holidify.com/images/cmsuploads/compressed/800px-Murud_janjira_2_20180406131222.jpg',
      'Rajmachi Fort': 'https://www.holidify.com/images/cmsuploads/compressed/800px-Rajmachi_Fort_20180406110304.jpg',
      'Vijaydurg Fort': 'https://www.holidify.com/images/cmsuploads/compressed/34137882_20180511162743.jpg',
      'Daulatabad Fort': 'https://www.maharashtratourism.gov.in/documents/10180/14438941/Daulatabad+Fort.jpg',
      'Panhala Fort': 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_559239738_20200123130757.jpg',
      'Kolaba Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Alibaug_Fort.JPG/1200px-Alibaug_Fort.JPG',
      'Korlai Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Korlai_fort_chaul.jpg/800px-Korlai_fort_chaul.jpg',
      'Ajinkyatara Fort': 'https://www.tourismofmaharashtra.com/wp-content/uploads/2023/09/Ajinkyatara-Fort-2.jpg',
      'Ghangad Fort': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ghangad_Fort_from_Tail_Bailee.jpg',
      'Visapur Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Visapur_Fort_entrance_view.jpg/1200px-Visapur_Fort_entrance_view.jpg',
      'Tikona Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Tikona_fort.jpg/1200px-Tikona_fort.jpg',
      'Mandangad Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mandangad_Fort_Maharashtra.jpg/800px-Mandangad_Fort_Maharashtra.jpg',
      'Sindhudurg Fort': 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_665365453_20190822172015.jpg',
    };
    
    for (const [fort, url] of Object.entries(imageMap)) {
      if (fortName.toLowerCase().includes(fort.toLowerCase())) {
        return url;
      }
    }
    
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';
  };

  // Initial fort data (used as fallback if API fails)
  const initialForts = [
    {
      name: 'Raigad Fort',
      description: 'The capital fort of the Maratha Empire, where Chhatrapati Shivaji Maharaj was coronated.',
      location: 'Raigad, Maharashtra',
      district: 'Raigad',
      history: 'Raigad was the capital of Chhatrapati Shivaji Maharaj, the founder of the Maratha Empire. In 1674, Shivaji Maharaj was coronated at Raigad Fort, which became the center of the Maratha kingdom.',
    },
    {
      name: 'Shivneri Fort',
      description: 'The birthplace of Chhatrapati Shivaji Maharaj, the founder of the Maratha Empire.',
      location: 'Junnar, Maharashtra',
      district: 'Pune',
      history: 'Shivneri Fort is where Chhatrapati Shivaji Maharaj was born on February 19, 1630. His mother, Jijabai, lived at this fort during his birth. The fort has great historical significance to the Maratha heritage.',
    },
    {
      name: 'Sinhagad Fort',
      description: 'Previously known as Kondhana, this fort has witnessed many battles including the Battle of Sinhagad.',
      location: 'Pune, Maharashtra',
      district: 'Pune',
      history: 'The fort has a strategic location, being at the center of a string of other forts such as Rajgad, Purandar, and Torna. It witnessed the famous Battle of Sinhagad in 1670 where Tanaji Malusare, a Maratha warrior, lost his life while capturing the fort from the Mughals.',
    },
    {
      name: 'Torna Fort',
      description: 'Also known as Prachandagad, this was the first fort captured by Shivaji Maharaj.',
      location: 'Pune, Maharashtra',
      district: 'Pune',
      history: 'Torna was the first fort captured by Shivaji Maharaj at the age of 16, marking the beginning of the Maratha Empire. The fort is situated at an elevation of 4,603 feet and is one of the highest forts in Maharashtra.',
    },
    {
      name: 'Pratapgad Fort',
      description: 'A mountain fort where the famous battle between Shivaji Maharaj and Afzal Khan took place.',
      location: 'Satara, Maharashtra',
      district: 'Satara',
      history: 'Built in 1656, Pratapgad Fort is where the historic battle between Shivaji Maharaj and Afzal Khan took place in 1659. This battle is considered one of the defining moments in Maratha history.',
    },
    {
      name: 'Harishchandragad Fort',
      description: 'An ancient hill fort known for its Konkan Kada, a concave rock cliff offering spectacular views.',
      location: 'Ahmednagar, Maharashtra',
      district: 'Ahmednagar',
      history: 'Dating back to the 6th century, Harishchandragad has religious and historical significance. The fort features ancient rock-cut caves, a Kedareshwar temple with a massive Shivling, and the famous Konkan Kada cliff.',
    },
    {
      name: 'Lohagad Fort',
      description: 'A fort that provides a panoramic view of Pawna Dam and the surrounding countryside.',
      location: 'Pune, Maharashtra',
      district: 'Pune',
      history: 'Lohagad ("Iron Fort") was used by many dynasties including the Satavahanas, Chalukyas, Rashtrakutas, Yadavas, Bahamanis, Nizamshahis, Mughals, and Marathas. It changed hands multiple times during the Maratha-Mughal conflicts.',
    },
    {
      name: 'Daulatabad Fort',
      description: 'Also known as Devagiri Fort, it is a 12th-century fortress situated on a conical hill.',
      location: 'Aurangabad, Maharashtra',
      district: 'Aurangabad',
      history: 'Originally built by the Yadava dynasty, Daulatabad Fort was briefly made the capital of India during Muhammad bin Tughlaq\'s reign. It features multiple layers of defense, a moat, and a complex arrangement of spiraling passages.',
    },
    {
      name: 'Panhala Fort',
      description: 'One of the largest forts in the Deccan, known for its strategic location and imposing structure.',
      location: 'Kolhapur, Maharashtra',
      district: 'Kolhapur',
      history: 'Built between 1178 and 1209 CE, Panhala Fort served as the capital of the Maratha state from 1782 to 1827. It is associated with legendary Maratha ruler Tarabai and witnessed the famous escape of Shivaji Maharaj to Vishalgad.',
    },
    {
      name: 'Murud Janjira Fort',
      description: 'An island fort surrounded by water on all sides, known for its impenetrable defenses.',
      location: 'Murud, Maharashtra',
      district: 'Raigad',
      history: 'Murud-Janjira is one of the strongest marine forts in India. It remained unconquered despite numerous attempts by the Portuguese, the British, and even the Marathas under Shivaji Maharaj to capture it.',
    },
    {
      name: 'Vijaydurg Fort',
      description: 'One of the oldest coastal forts in Maharashtra, known as the "Victory Fort".',
      location: 'Sindhudurg, Maharashtra',
      district: 'Sindhudurg',
      history: 'Vijaydurg was built by Raja Bhoja II of the Shilahar dynasty and was later expanded by Shivaji Maharaj. It was an important naval base for the Maratha navy under Kanhoji Angre, the famous Maratha admiral.',
    },
    {
      name: 'Kolaba Fort',
      description: 'A sea fort at the entrance of Alibag harbor, accessible by foot during low tide.',
      location: 'Alibag, Maharashtra',
      district: 'Raigad',
      history: 'Kolaba Fort was built by Chhatrapati Shivaji Maharaj in 1680. It was one of the key naval forts of the Maratha Empire and was used to control the sea route to Mumbai (then Bombay).',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">All forts list</h1>
          <p className="mt-2">Explore the rich heritage of historic forts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-slate-600">Loading forts...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <p>{error}</p>
            <p className="mt-2">Using locally stored data for display.</p>
          </div>
        ) : null}

        {(!loading || forts.length > 0) && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">All forts list</h2>
              <p className="text-slate-600 mb-6">
                Maharashtra is home to over 350 forts, each with its own unique history and architecture. 
                These forts were built by various dynasties including the Marathas, who under the leadership 
                of Chhatrapati Shivaji Maharaj, established a powerful empire in the 17th century.
              </p>

              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Search for forts by name..." 
                />
              </div>

              {filteredForts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No forts found</h3>
                  <p className="text-gray-500">Try adjusting your search term or browsing all forts.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Show all forts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredForts.map((fort) => (
                    <div 
                      key={fort._id} 
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer aspect-square flex flex-col"
                      onClick={() => handleFortSelect(fort)}
                    >
                      <div className="relative flex-grow">
                        <Image 
                          src={fort.imageUrl || '/placeholder-fort.jpg'} 
                          alt={fort.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <h3 className="text-xl font-bold p-4 text-white">{fort.name}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fort Details Modal */}
      {selectedFort && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Main Fort Image */}
            <div className="relative h-80 w-full">
              <Image 
                src={selectedFort.imageUrl || '/placeholder-fort.jpg'} 
                alt={selectedFort.name}
                fill
                style={{ objectFit: 'cover' }}
              />
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Fort Information */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-slate-800">{selectedFort.name}</h2>
              <p className="text-sm text-slate-500 mb-4">{selectedFort.location} • {selectedFort.district} District</p>
              
              {/* Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-700">About</h3>
                <p className="text-slate-600">{selectedFort.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-700">History</h3>
                <p className="text-slate-600">{selectedFort.history}</p>
              </div>
              
              {/* Map Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-700">Map</h3>
                <div className="rounded-lg overflow-hidden border border-slate-200 h-64 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-slate-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFort.name + ' ' + selectedFort.location)}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-amber-600 hover:text-amber-700"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Image Gallery Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-700">Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden relative">
                    <Image 
                      src={selectedFort.imageUrl || '/placeholder-fort.jpg'} 
                      alt={`${selectedFort.name} - View 1`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Offline Map Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-700">Offline Map</h3>
                <div className="bg-amber-500 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center">
                    <div className="mr-4 text-amber-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Download an offline map of this fort for your visit</p>
                      <p className="text-xs text-amber-600 mt-1">Available for trekking and navigation</p>
                    </div>
                    <button className="ml-auto bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm">
                      Download
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closeModal}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-5 py-2 rounded-md mr-2"
                >
                  Close
                </button>
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(selectedFort.name)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 