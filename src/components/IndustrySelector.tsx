import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { industries } from "@/types/assessment";
import { cn } from "@/lib/utils";

interface IndustrySelectorProps {
  selectedIndustry: string;
  onIndustrySelect: (industryId: string) => void;
  language: 'en' | 'hi';
}

export const IndustrySelector = ({ selectedIndustry, onIndustrySelect, language }: IndustrySelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {language === 'hi' ? 'अपना उद्योग चुनें' : 'Select Your Industry'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'कृपया अपने व्यापार का प्रकार चुनें' 
            : 'Please choose the type of business you operate'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {industries.map((industry) => (
          <Card 
            key={industry.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-105",
              selectedIndustry === industry.id && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onIndustrySelect(industry.id)}
          >
            <div className="text-center space-y-2">
              
              <div className="font-medium text-sm">
                {language === 'hi' ? industry.nameHindi || industry.name : industry.name}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
    </div>
  );
};