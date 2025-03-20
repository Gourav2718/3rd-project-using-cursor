import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fort from '@/models/Fort';
import { searchImages } from '@/lib/imageSearch';

// Initial fort data to seed the database
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
  {
    name: 'Korlai Fort',
    description: 'A Portuguese fort with a unique blend of Portuguese and local architecture.',
    location: 'Korlai, Maharashtra',
    district: 'Raigad',
    history: 'Built in 1521 by the Portuguese, Korlai Fort (also known as Morro de Chaul) was captured by the Marathas in 1739. The fort is unique as it had a distinct community speaking a Portuguese-influenced creole language.',
  },
  {
    name: 'Ajinkyatara Fort',
    description: 'A hill fort offering panoramic views of Satara city and surrounding landscape.',
    location: 'Satara, Maharashtra',
    district: 'Satara',
    history: 'Ajinkyatara Fort, meaning "The Impregnable Star," was part of the Maratha Empire and served as an important watch tower due to its strategic location. It was captured by Aurangzeb in 1700 and later retaken by the Marathas.',
  },
  {
    name: 'Rajmachi Fort',
    description: 'A strategic fort consisting of two fortified peaks - Shrivardhan and Manaranjan.',
    location: 'Lonavala, Maharashtra',
    district: 'Pune',
    history: 'Rajmachi Fort was built by the Satavahanas and later strengthened by Shivaji Maharaj. It was a strategic fort used to control the trade route from Bor Ghat to the Arabian Sea.',
  },
  {
    name: 'Ghangad Fort',
    description: 'A small fort known for its natural beauty and peaceful surroundings.',
    location: 'Pune, Maharashtra',
    district: 'Pune',
    history: 'Ghangad Fort, whose name means "Fort of Bells," was used as a treasure house by Shivaji Maharaj. It is one of the lesser-known forts in the region but offers breathtaking views of the surrounding landscape.',
  },
  {
    name: 'Visapur Fort',
    description: 'Adjacent to Lohagad Fort, known for its massive size and historical significance.',
    location: 'Pune, Maharashtra',
    district: 'Pune',
    history: 'Visapur Fort was built during 1713-1756 CE by the Peshwas on a higher elevation than Lohagad Fort. It was a key site during the First Anglo-Maratha War and was captured by the British in 1818.',
  },
  {
    name: 'Tikona Fort',
    description: 'A triangular fort with steep climbs and panoramic views of Pawna Lake.',
    location: 'Pune, Maharashtra',
    district: 'Pune',
    history: 'Tikona, meaning "triangular" in Marathi, gets its name from its pyramidal shape. The fort was captured by Shivaji Maharaj in 1657 CE and has several small temples, water cisterns, and caves within its premises.',
  },
  {
    name: 'Mandangad Fort',
    description: 'A lesser-known fort in the Konkan region with historical significance.',
    location: 'Ratnagiri, Maharashtra',
    district: 'Ratnagiri',
    history: 'Mandangad Fort has religious and historical importance. It was part of the Maratha Empire and served as a strategic outpost in the Konkan region.',
  },
  {
    name: 'Sindhudurg Fort',
    description: 'A sea fort built by Shivaji Maharaj, known for its strong foundation and strategic location.',
    location: 'Malvan, Maharashtra',
    district: 'Sindhudurg',
    history: 'Built in 1664, Sindhudurg Fort is considered a marvel of military architecture. It has a temple with Shivaji Maharaj\'s handprints and footprints in dried lime, believed to be the only concrete evidence of what he looked like.',
  },
];

// Function to seed the database with initial fort data
async function POST(request: NextRequest) {
  try {
    await connectDB();

    console.log("Starting fort database seeding process...");
    
    // Instead of deleting all forts, we'll use upsert approach
    // This will update existing forts and insert new ones

    let successCount = 0;
    let errorCount = 0;
    let errors = [];

    // Process each fort individually
    for (const fort of initialForts) {
      try {
        console.log(`Processing fort: ${fort.name}`);
        
        // Check if image URL already exists
        const existingFort = await Fort.findOne({ name: fort.name });
        const imageUrl = existingFort?.imageUrl || await searchImages(fort.name);
        
        // Update or insert the fort using findOneAndUpdate with upsert option
        await Fort.findOneAndUpdate(
          { name: fort.name }, // filter
          { ...fort, imageUrl }, // update
          { upsert: true, new: true } // options
        );
        
        successCount++;
        console.log(`Successfully processed fort: ${fort.name}`);
      } catch (err: any) {
        console.error(`Error processing fort ${fort.name}:`, err.message);
        errorCount++;
        errors.push({ name: fort.name, error: err.message });
      }
    }

    console.log(`Fort seeding completed. Processed ${successCount} forts with ${errorCount} errors.`);
    
    return NextResponse.json({
      success: true,
      message: `Forts data seeded successfully. Processed: ${successCount}, Errors: ${errorCount}`,
      count: successCount,
      errorDetails: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error seeding forts data:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while seeding forts data',
        success: false
      },
      { status: 500 }
    );
  }
}

// Expose the POST endpoint without protection for development
export { POST }; 