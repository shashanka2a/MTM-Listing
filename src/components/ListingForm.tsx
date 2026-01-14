'use client';

import React from 'react';
import { TitleGenerator } from './listing/TitleGenerator';
import { ConditionGrading } from './listing/ConditionGrading';
import { ItemSpecifics } from './listing/ItemSpecifics';
import { DimensionsWeight } from './listing/DimensionsWeight';
import { Description } from './listing/Description';

interface ListingFormProps {
  data?: any;
  onChange?: (data: any) => void;
}

export function ListingForm({ data, onChange }: ListingFormProps) {
  const defaultData = {
    title: 'HO Bowser Executive 24688 PRR ALCO RS-3 Ph. III Diesel #8595 w/ DCC & Sound',
    condition: 7,
    ...data
  };

  const updateData = (key: string, value: any) => {
    if (onChange) {
      onChange({ ...defaultData, [key]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Listing Generator</h2>
        
        <div className="space-y-6">
          <TitleGenerator 
            title={defaultData.title} 
            onTitleChange={(title) => updateData('title', title)} 
          />
          <div className="border-t border-gray-200 pt-6">
            <ConditionGrading 
              condition={defaultData.condition} 
              onConditionChange={(condition) => updateData('condition', condition)} 
            />
          </div>
          <div className="border-t border-gray-200 pt-6">
            <ItemSpecifics />
          </div>
          <div className="border-t border-gray-200 pt-6">
            <DimensionsWeight />
          </div>
          <div className="border-t border-gray-200 pt-6">
            <Description />
          </div>
        </div>
      </div>
    </div>
  );
}