
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface RegistrationProgressProps {
  currentStep: number;
  elapsedTime: number;
}

export function RegistrationProgress({ currentStep, elapsedTime }: RegistrationProgressProps) {
  const progress = ((currentStep - 1) / 3) * 100;
  const isCompleted = currentStep === 4;
  const isOnTime = elapsedTime < 30;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Progression de l'inscription</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className={`text-sm font-medium ${isOnTime ? 'text-green-600' : 'text-orange-600'}`}>
              {elapsedTime}s
            </span>
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            {currentStep >= 1 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
            <span>Informations</span>
          </div>
          <div className="flex items-center gap-2">
            {currentStep >= 2 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
            <span>Programme</span>
          </div>
          <div className="flex items-center gap-2">
            {currentStep >= 3 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
            <span>Finalisation</span>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
            <span>Validation</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {isOnTime ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Objectif &lt; 30s respecté</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">Dépassement de l'objectif</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
