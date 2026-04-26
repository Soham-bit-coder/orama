"use client";

import React from 'react';

const brands = [
  { name: 'JioHotstar', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Prime Video', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
  { 
    name: 'HBO Max', 
    logo: 'https://cdn.worldvectorlogo.com/logos/hbo-max-stacked.svg', 
    style: 'bg-gradient-to-br from-[#410476] to-[#1D0041] border-purple-500/50' 
  },
  { name: 'Marvel', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg' },
  { name: 'Star Wars', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg' },
  { name: 'Warner Bros', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Warner_Bros_logo.svg' }
];

export default function BrandLogos() {
  return (
    <div className="container mx-auto px-4 md:px-12 lg:px-16 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 items-center">
        {brands.map((brand) => (
          <div 
            key={brand.name}
            className={`${brand.style || 'bg-gray-900/40 border-white/5'} border rounded-2xl p-6 h-28 flex items-center justify-center hover:scale-105 transition-all group overflow-hidden relative shadow-2xl`}
          >
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className={`max-h-14 w-auto drop-shadow-2xl ${brand.name === 'HBO Max' ? 'brightness-0 invert opacity-100' : 'opacity-70 group-hover:opacity-100'}`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
