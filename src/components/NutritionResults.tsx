import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: string;
}

export interface NutritionData {
  id: string;
  imageUrl: string;
  fileName: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  error?: string;
}

interface NutritionResultsProps {
  results: NutritionData[];
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({ results }) => {
  const sessionTotals = results.reduce(
    (totals, result) => {
      if (!result.error) {
        totals.calories += result.totalCalories;
        totals.protein += result.totalProtein;
        totals.carbs += result.totalCarbs;
        totals.fat += result.totalFat;
      }
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Nutrition Analysis Results</h2>
      
      {/* Individual Results */}
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 p-4">
                <img
                  src={result.imageUrl}
                  alt={result.fileName}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <p className="text-sm text-muted-foreground mt-2 truncate">
                  {result.fileName}
                </p>
              </div>
              
              <div className="md:w-2/3 p-4">
                {result.error ? (
                  <div className="text-destructive">
                    <h3 className="font-semibold mb-2">Analysis Failed</h3>
                    <p className="text-sm">{result.error}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-4 text-foreground">Detected Food Items</h3>
                    <div className="space-y-3 mb-4">
                      {result.foodItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">{item.calories} cal</p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="secondary" className="text-xs">P: {item.protein}g</Badge>
                              <Badge variant="secondary" className="text-xs">C: {item.carbs}g</Badge>
                              <Badge variant="secondary" className="text-xs">F: {item.fat}g</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="mt-4 p-3 bg-accent/10 rounded-md">
                      <h4 className="font-semibold text-foreground mb-2">Image Total</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Calories:</span>
                          <span className="font-medium ml-2 text-foreground">{result.totalCalories}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Protein:</span>
                          <span className="font-medium ml-2 text-foreground">{result.totalProtein}g</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Carbs:</span>
                          <span className="font-medium ml-2 text-foreground">{result.totalCarbs}g</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fat:</span>
                          <span className="font-medium ml-2 text-foreground">{result.totalFat}g</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Session Totals */}
      <Card className="bg-primary/5 border-primary">
        <CardHeader>
          <CardTitle className="text-foreground">Session Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{sessionTotals.calories}</div>
              <div className="text-sm text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{sessionTotals.protein}g</div>
              <div className="text-sm text-muted-foreground">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{sessionTotals.carbs}g</div>
              <div className="text-sm text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{sessionTotals.fat}g</div>
              <div className="text-sm text-muted-foreground">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};