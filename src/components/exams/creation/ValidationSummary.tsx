import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ValidationItem {
  label: string;
  value: any;
  valid: boolean;
}

interface ValidationCategory {
  category: string;
  items: ValidationItem[];
}

interface ValidationSummaryProps {
  validationItems: ValidationCategory[];
}

export function ValidationSummary({ validationItems }: ValidationSummaryProps) {
  const totalItems = validationItems.reduce((acc, cat) => acc + cat.items.length, 0);
  const validItems = validationItems.reduce(
    (acc, cat) => acc + cat.items.filter(item => item.valid).length, 
    0
  );
  const completionRate = Math.round((validItems / totalItems) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Validation des informations</span>
          <span className="text-sm font-normal">
            {validItems}/{totalItems} ({completionRate}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barre de progression */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                completionRate === 100 ? 'bg-green-500' : 
                completionRate >= 75 ? 'bg-blue-500' : 
                completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Détails par catégorie */}
        <div className="space-y-4">
          {validationItems.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="font-medium text-sm text-foreground mb-2">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.valid ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">✓</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-700 font-medium">✗</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Message de statut */}
        <div className={`mt-4 p-3 rounded-lg ${
          completionRate === 100 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {completionRate === 100 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800 text-sm font-medium">
                  Toutes les informations sont complètes
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 text-sm font-medium">
                  {totalItems - validItems} information(s) manquante(s)
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}