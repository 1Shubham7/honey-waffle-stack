import { NutritionData } from '@/components/NutritionResults';

export const exportToCSV = (results: NutritionData[]) => {
  const headers = [
    'Image',
    'Food Item',
    'Quantity',
    'Calories',
    'Protein (g)',
    'Carbs (g)',
    'Fat (g)'
  ];

  const rows = results.flatMap(result => {
    if (result.error) {
      return [[result.fileName, 'Analysis failed', result.error, '', '', '', '']];
    }
    
    return result.foodItems.map(item => [
      result.fileName,
      item.name,
      item.quantity,
      item.calories,
      item.protein,
      item.carbs,
      item.fat
    ]);
  });

  // Add session totals
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

  rows.push(['', '', 'SESSION TOTAL', sessionTotals.calories, sessionTotals.protein, sessionTotals.carbs, sessionTotals.fat]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `caloritrack-image-recognition-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = (results: NutritionData[]) => {
  // Create HTML content for PDF
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>CaloriTrack Image Recognition Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .result { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; }
            .food-item { margin: 10px 0; padding: 10px; background: #f5f5f5; }
            .totals { background: #fffbf0; padding: 15px; margin-top: 20px; }
            .session-total { background: #ffd700; padding: 20px; text-align: center; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>CaloriTrack Image Recognition Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        ${results.map(result => `
            <div class="result">
                <h2>${result.fileName}</h2>
                ${result.error ? `
                    <p style="color: red;">Analysis failed: ${result.error}</p>
                ` : `
                    <h3>Detected Food Items:</h3>
                    ${result.foodItems.map(item => `
                        <div class="food-item">
                            <strong>${item.name}</strong> (${item.quantity})<br>
                            Calories: ${item.calories} | Protein: ${item.protein}g | Carbs: ${item.carbs}g | Fat: ${item.fat}g
                        </div>
                    `).join('')}
                    
                    <div class="totals">
                        <h4>Image Total:</h4>
                        <p>Calories: ${result.totalCalories} | Protein: ${result.totalProtein}g | Carbs: ${result.totalCarbs}g | Fat: ${result.totalFat}g</p>
                    </div>
                `}
            </div>
        `).join('')}
        
        <div class="session-total">
            <h2>Session Total</h2>
            <table>
                <tr>
                    <th>Calories</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fat (g)</th>
                </tr>
                <tr>
                    <td>${sessionTotals.calories}</td>
                    <td>${sessionTotals.protein}</td>
                    <td>${sessionTotals.carbs}</td>
                    <td>${sessionTotals.fat}</td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};
