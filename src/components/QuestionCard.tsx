import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/assessment";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswer: (questionId: string, answer: any) => void;
  language: 'en' | 'hi';
  className?: string;
}

export const QuestionCard = ({ question, answer, onAnswer, language, className }: QuestionCardProps) => {
  const questionText = language === 'hi' ? question.textHindi || question.text : question.text;

  return (
    <Card className={cn("p-6 space-y-4 animate-slide-up", className)}>
      <h3 className="text-lg font-semibold text-foreground">
        {questionText}
      </h3>
      
      {question.type === 'yes-no' && (
        <div className="flex gap-3">
          <Button
            variant={answer === 'yes' ? 'default' : 'outline'}
            onClick={() => onAnswer(question.id, 'yes')}
            className={cn(
              "flex-1 transition-all duration-300",
              answer === 'yes' && "bg-gradient-primary shadow-primary"
            )}
          >
            {language === 'hi' ? 'हाँ' : 'Yes'}
          </Button>
          <Button
            variant={answer === 'no' ? 'destructive' : 'outline'}
            onClick={() => onAnswer(question.id, 'no')}
            className="flex-1 transition-all duration-300"
          >
            {language === 'hi' ? 'नहीं' : 'No'}
          </Button>
        </div>
      )}
      
      {question.type === 'multiple-choice' && (
        <div className="grid grid-cols-2 gap-3">
          {(
            question.options || ['yes','sometimes','not-sure','no']
          ).map((opt) => {
            const isActive = answer === opt;
            const label = (() => {
              switch (opt) {
                case 'yes': return language === 'hi' ? 'हाँ / हमेशा' : 'Yes / Always';
                case 'sometimes': return language === 'hi' ? 'कभी-कभी' : 'Sometimes';
                case 'not-sure': return language === 'hi' ? 'पता नहीं' : 'Not Sure';
                case 'no': return language === 'hi' ? 'नहीं / कभी नहीं' : 'No / Never';
                default: return String(opt);
              }
            })();
            return (
              <Button
                key={opt}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => onAnswer(question.id, opt)}
                className={cn(
                  "transition-all duration-300",
                  isActive && "bg-gradient-primary shadow-primary"
                )}
              >
                {label}
              </Button>
            );
          })}
        </div>
      )}
      
      {question.type === 'rating' && (
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant={answer === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => onAnswer(question.id, rating)}
              className={cn(
                "w-12 h-12 rounded-full transition-all duration-300",
                answer === rating && "bg-gradient-primary shadow-primary"
              )}
            >
              {rating}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};