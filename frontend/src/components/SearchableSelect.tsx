'use client';

import React, { useState, useRef, useEffect } from 'react';
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

  // Convert countries data to array and sort by name
  const countriesList: Country[] = Object.entries(countries).map(([code, country]) => ({
    name: country.name,
    code: code
  })).sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    // Filter countries based on search term
    const filtered = countriesList.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered.slice(0, 50)); // Limit to 50 results for performance
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  const getInputClassName = () => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-black";
    if (error) {
      return `${baseClass} border-red-500 focus:ring-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label}
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className={getInputClassName()}
          required={required}
        />
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
              <div className="px-3 py-2 text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
} 