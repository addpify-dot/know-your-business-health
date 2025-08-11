import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/QuestionCard";
import { BusinessFunction } from "@/types/assessment";

interface FunctionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  func: BusinessFunction | null;
  language: 'en' | 'hi';
  initialAnswers?: Record<string, any>;
  onSave: (answers: Record<string, any>) => void;
}

export default function FunctionDetailsModal({ open, onOpenChange, func, language, initialAnswers = {}, onSave }: FunctionDetailsModalProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);

  // Reset when func changes or modal opens with different initial answers
  React.useEffect(() => {
    setIndex(0);
    setAnswers(initialAnswers || {});
  }, [func?.id, open]);

  if (!func) return null;

  const currentQ = func.questions[index];
  const canNext = answers[currentQ.id] !== undefined;
  const isLast = index === func.questions.length - 1;

  const handleAnswer = (qid: string, ans: any) => {
    setAnswers(prev => ({ ...prev, [qid]: ans }));
  };

  const handleNext = () => {
    if (!canNext) return;
    if (!isLast) setIndex(i => i + 1);
  };

  const handleBack = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const handleSave = () => {
    onSave(answers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {language === 'hi' ? `${func.nameHindi || func.name} - विस्तृत जाँच` : `${func.name} - Detailed Assessment`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground text-right">
            {language === 'hi' ? `प्रश्न ${index + 1} / ${func.questions.length}` : `Question ${index + 1} of ${func.questions.length}`}
          </div>
          <QuestionCard
            question={currentQ}
            answer={answers[currentQ.id]}
            onAnswer={handleAnswer}
            language={language}
          />
        </div>

        <DialogFooter className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} disabled={index === 0}>
              {language === 'hi' ? 'पिछला' : 'Back'}
            </Button>
            {!isLast && (
              <Button onClick={handleNext} disabled={!canNext}>
                {language === 'hi' ? 'आगे' : 'Next'}
              </Button>
            )}
          </div>
          <Button onClick={handleSave} disabled={!canNext} className="bg-gradient-primary">
            {language === 'hi' ? (isLast ? 'सेव करें' : 'सेव और बंद करें') : (isLast ? 'Save' : 'Save & Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
