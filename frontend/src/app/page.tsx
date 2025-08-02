'use client';

import PersonalInfoForm from '@/components/PersonalInfoForm';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                MITARBEITERSTAMMDATEN
              </h1>
            </div>
            <PersonalInfoForm />
          </div>
        </div>
      </div>
    </div>
  );
}
