import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  language: 'en' | 'hi';
  onLanguageChange: (language: 'en' | 'hi') => void;
  className?: string;
}

export const LanguageToggle = ({ language, onLanguageChange, className }: LanguageToggleProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className="transition-all duration-300"
      >
        English
      </Button>
      <Button
        variant={language === 'hi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('hi')}
        className="transition-all duration-300"
      >
        हिंदी
      </Button>
    </div>
  );
};