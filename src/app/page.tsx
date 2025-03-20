import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Guardians of Maharashtra
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl">
            Explore the historic forts that have protected Maharashtra for centuries
          </p>
          <Link 
            href="/login" 
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Overview Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
            Discover Maharashtra's Rich Fort Heritage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fort Card 1 */}
            <div className="bg-slate-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-slate-800 text-white flex items-center justify-center">
                  <p>Fort Image</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-800">Raigad Fort</h3>
                <p className="text-slate-600 mb-4">
                  The capital fort of the Maratha Empire, where Chhatrapati Shivaji Maharaj was coronated.
                </p>
                <Link href="/login" className="text-amber-600 hover:text-amber-800 font-semibold">
                  Learn more →
                </Link>
              </div>
            </div>
            
            {/* Fort Card 2 */}
            <div className="bg-slate-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-slate-800 text-white flex items-center justify-center">
                  <p>Fort Image</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-800">Pratapgad Fort</h3>
                <p className="text-slate-600 mb-4">
                  A mountain fort where the famous battle between Shivaji Maharaj and Afzal Khan took place.
                </p>
                <Link href="/login" className="text-amber-600 hover:text-amber-800 font-semibold">
                  Learn more →
                </Link>
              </div>
            </div>
            
            {/* Fort Card 3 */}
            <div className="bg-slate-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-slate-800 text-white flex items-center justify-center">
                  <p>Fort Image</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-800">Sinhagad Fort</h3>
                <p className="text-slate-600 mb-4">
                  Previously known as Kondhana, this fort has witnessed many battles including the Battle of Sinhagad.
                </p>
                <Link href="/login" className="text-amber-600 hover:text-amber-800 font-semibold">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
            Why Explore With Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500 p-3 rounded-full mb-4">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Interactive Maps</h3>
              <p className="text-slate-600">
                Navigate through detailed maps showing the location of every historic fort in Maharashtra.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500 p-3 rounded-full mb-4">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Rich History</h3>
              <p className="text-slate-600">
                Dive deep into the stories and historical significance of each fort.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500 p-3 rounded-full mb-4">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Visual Tours</h3>
              <p className="text-slate-600">
                Experience virtual tours with high-quality images and 360° views of these magnificent structures.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="w-full py-16 bg-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us on this journey through Maharashtra's majestic forts and discover the rich heritage that shaped the region.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/login" 
              className="bg-white text-amber-600 hover:bg-slate-100 font-bold py-3 px-8 rounded-md transition-colors duration-300"
            >
              login
            </Link>
            <Link 
              href="/signup" 
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
            >
              sign up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
