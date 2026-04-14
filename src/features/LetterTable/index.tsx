'use client';

import React from 'react';

interface LetterTableProps {
  studentName?: string;
  studentClass?: string;
}

export function LetterTable({
  studentName = '',
  studentClass = ''
}: LetterTableProps) {
  return (
    <div className="dl-envelope-container relative flex flex-col">
      {/* Logo Header */}
      <div className="flex items-center justify-between mb-8 p-3">
        <div className="w-26 h-26">
          <img src="/leftLogo.png" alt="Left Logo" className="w-full h-full object-contain" />
        </div>
        <div className="w-26 h-26">
          <img src="/rightLogo.png" alt="Right Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Student Name - XXL Size in Center */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-center">
            {studentName || 'اسم التلميذ'}
          </h1>
        </div>

        {/* Student Class at Bottom */}
        <div className="text-center pb-4">
          <p className="text-xl font-semibold">
            {studentClass || 'القسم'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute right-12 bottom-6 w-full border-t-2 border-black pt-4 text-center">
        <p className="text-sm font-medium mb-1">
          Résidence les Jardins Majorelle Lot. P Hay Al Qods Bernoussi - Casablanca
        </p>
        <p className="text-sm">
          Tél : 05 22 74 14 18 - GSM : 06 68 09 51 57 - E-mail : jhenrilambert@gmail.com
        </p>
      </div>
    </div>
  );
}