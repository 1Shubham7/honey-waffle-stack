import { FoodItem, NutritionData } from '@/components/NutritionResults';

export class NutritionService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeImage(file: File): Promise<NutritionData> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(file);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this food image and identify all visible food items. For each food item, estimate the quantity and provide nutritional information. Return the response as a JSON object with this exact structure:

{
  "foodItems": [
    {
      "name": "food item name",
      "quantity": "estimated quantity (e.g., '1 medium apple', '150g rice')",
      "calories": estimated_calories_number,
      "protein": protein_grams_number,
      "carbs": carbs_grams_number,
      "fat": fat_grams_number
    }
  ]
}

Be as accurate as possible with portion sizes and nutritional values. If you can't clearly identify an item, don't include it. Only return the JSON object, no additional text.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const nutritionData = JSON.parse(content);
      
      // Calculate totals
      const totals = nutritionData.foodItems.reduce(
        (acc: any, item: FoodItem) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        id: crypto.randomUUID(),
        imageUrl: URL.createObjectURL(file),
        fileName: file.name,
        foodItems: nutritionData.foodItems,
        totalCalories: Math.round(totals.calories),
        totalProtein: Math.round(totals.protein * 10) / 10,
        totalCarbs: Math.round(totals.carbs * 10) / 10,
        totalFat: Math.round(totals.fat * 10) / 10
      };

    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        id: crypto.randomUUID(),
        imageUrl: URL.createObjectURL(file),
        fileName: file.name,
        foodItems: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        error: error instanceof Error ? error.message : 'Failed to analyze image'
      };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}