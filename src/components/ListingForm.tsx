'use client';

import React, { useMemo } from 'react';
import { TitleGenerator } from './listing/TitleGenerator';
import { ConditionGrading } from './listing/ConditionGrading';
import { ItemSpecifics } from './listing/ItemSpecifics';
import { DimensionsWeight } from './listing/DimensionsWeight';
import { Description } from './listing/Description';
import { AIAnalysis } from '../contexts/ListingContext';

interface ListingFormProps {
  data?: any;
  onChange?: (data: any) => void;
  aiAnalysis?: AIAnalysis | null;
  onRegenerate?: () => void;
}

export function ListingForm({ data, onChange, aiAnalysis, onRegenerate }: ListingFormProps) {
  const formData = {
    title: '',
    condition: 7,
    ...data
  };

  const updateData = (key: string, value: any) => {
    if (onChange) {
      onChange({ ...formData, [key]: value });
    }
  };

  // Generate template parts from AI analysis for title display
  const templateParts = useMemo(() => {
    if (!aiAnalysis) return [];
    
    const parts = [];
    if (aiAnalysis.scale) parts.push({ key: 'scale', label: 'Scale', value: aiAnalysis.scale });
    if (aiAnalysis.brand) parts.push({ key: 'brand', label: 'Brand', value: aiAnalysis.brand });
    if (aiAnalysis.line) parts.push({ key: 'line', label: 'Line', value: aiAnalysis.line });
    if (aiAnalysis.roadName) parts.push({ key: 'road', label: 'Road', value: aiAnalysis.roadName });
    if (aiAnalysis.locomotiveType) parts.push({ key: 'type', label: 'Type', value: aiAnalysis.locomotiveType });
    if (aiAnalysis.roadNumber) parts.push({ key: 'roadNumber', label: 'Road #', value: aiAnalysis.roadNumber });
    if (aiAnalysis.dcc && aiAnalysis.dcc !== 'Unknown') parts.push({ key: 'dcc', label: 'DCC', value: aiAnalysis.dcc });
    if (aiAnalysis.modelNumber) parts.push({ key: 'model', label: 'Model #', value: aiAnalysis.modelNumber });
    if (aiAnalysis.estimatedValue) parts.push({ key: 'value', label: 'Est. Value', value: `$${aiAnalysis.estimatedValue}` });
    
    return parts;
  }, [aiAnalysis]);

  const handleFieldChange = (key: string, value: any) => {
    updateData(key, value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Listing Generator</h2>
        
        <div className="space-y-4 sm:space-y-6">
          <TitleGenerator 
            title={formData.title} 
            onTitleChange={(title) => updateData('title', title)}
            templateParts={templateParts}
            onRegenerate={onRegenerate}
            isAiGenerated={!!(aiAnalysis?.title)}
          />
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <ConditionGrading 
              condition={formData.condition} 
              onConditionChange={(condition) => updateData('condition', condition)}
              conditionNotes={formData.conditionNotes}
              onConditionNotesChange={(notes) => updateData('conditionNotes', notes)}
              features={Array.isArray(formData.features) ? formData.features : aiAnalysis?.features ?? []}
              defects={Array.isArray(formData.defects) ? formData.defects : aiAnalysis?.defects ?? []}
              onFeaturesChange={(features) => updateData('features', features)}
              onDefectsChange={(defects) => updateData('defects', defects)}
              isAiGenerated={!!aiAnalysis?.condition}
            />
          </div>
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <ItemSpecifics 
              data={formData}
              onChange={handleFieldChange}
              isAiGenerated={!!aiAnalysis}
            />
          </div>
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <DimensionsWeight 
              data={{
                length: formData.length,
                width: formData.width,
                height: formData.height,
                weight: formData.weight,
              }}
              onChange={handleFieldChange}
            />
          </div>
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <Description 
              description={formData.description}
              onChange={(desc) => updateData('description', desc)}
              onRegenerate={onRegenerate}
              isAiGenerated={!!(aiAnalysis && formData.description)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}