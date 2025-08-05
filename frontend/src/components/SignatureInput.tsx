'use client';

import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SignatureInput({ value, onChange, placeholder, className = '' }: SignatureInputProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onChange('');
    }
  };

  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL();
      onChange(signatureData);
    }
  };

  const handleBegin = () => {
    setIsDrawing(true);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    handleSave();
  };

  useEffect(() => {
    // Clear canvas when value is empty
    if (!value && signatureRef.current) {
      signatureRef.current.clear();
    }
  }, [value]);

  return (
    <div className={`signature-input ${className}`}>
      <div className="border border-gray-300 rounded-md bg-white">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: 'w-full h-24 border-0',
            style: { border: 'none' }
          }}
          onBegin={handleBegin}
          onEnd={handleEnd}
          backgroundColor="white"
          penColor="black"
        />
      </div>
      {!isDrawing && (
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            Löschen
          </button>
          {!value && (
            <span className="text-xs text-gray-500">
              {placeholder || 'Unterschrift hier zeichnen'}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 