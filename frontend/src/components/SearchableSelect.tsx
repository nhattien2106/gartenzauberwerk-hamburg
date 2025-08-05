'use client';

import React, { useState, useEffect, useRef } from 'react';
import { countries } from 'countries-list';

interface Country {
  name: string;
  code: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function SearchableSelect({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "", 
  label,
  required = false,
  error 
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert countries object to array
  const countriesList: Country[] = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = countriesList.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered.slice(0, 50)); // Limit results
  }, [searchTerm]);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const selectedCountry = countriesList.find(country => country.name === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedCountry?.name || value)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                onClick={() => handleSelect(country)}
              >
                {country.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">No countries found</div>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
} 