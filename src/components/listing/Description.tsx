import React from 'react';
import { Wand2 } from 'lucide-react';

const descriptionSections = {
  overview: "This Bowser Executive Line HO scale locomotive represents a Pennsylvania Railroad ALCO RS-3 Phase III diesel in authentic PRR livery. Road number 8595 is accurately rendered on this highly detailed model.",
  features: "• ESU LokSound V5 DCC decoder with factory-installed sound\n• Dual-mode operation (DC/DCC)\n• Directional lighting with warm white LEDs\n• Factory-applied paint and lettering\n• Knuckle couplers\n• Weighted metal chassis",
  condition: "Graded C7 - Excellent condition. The locomotive shows only minor wheel wear from light operation. Shell is clean with no scratches or paint loss. All mechanical and electrical functions operate perfectly.",
  included: "• ALCO RS-3 Locomotive (#8595)\n• Original Bowser Executive Line box\n• Instruction manual\n• All original paperwork",
  testing: "This locomotive has been tested on DC and DCC layouts. Motor runs smoothly at all speed steps. Sound decoder responds correctly to all function commands. Lighting operates as designed in both directions."
};

export function Description() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Description
        </label>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8b4513] bg-[#faf8f6] border border-[#8b4513] rounded-md hover:bg-[#f5f1ec]">
          <Wand2 className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">Overview</div>
          <textarea
            defaultValue={descriptionSections.overview}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
          />
        </div>

        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">Features</div>
          <textarea
            defaultValue={descriptionSections.features}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none font-mono"
          />
        </div>

        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">Condition</div>
          <textarea
            defaultValue={descriptionSections.condition}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
          />
        </div>

        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">What's Included</div>
          <textarea
            defaultValue={descriptionSections.included}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none font-mono"
          />
        </div>

        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">Testing Status</div>
          <textarea
            defaultValue={descriptionSections.testing}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
}
