"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [interestRate, setInterestRate] = useState('5'); // Default to 5%
  
  /**
   * Calculates investment returns using a fixed interest rate
   * @param {number} initial - Initial investment amount
   * @param {number} rate - Fixed annual interest rate
   * @returns {Array} Array of yearly investment data
   */
  const calculateReturns = (initial, rate) => {
    if (!initial || isNaN(initial)) return [];
    if (!rate || isNaN(rate)) return [];
    
    const rateDecimal = parseFloat(rate) / 100;
    let currentValue = parseFloat(initial);
    
    // Calculate returns for 50 years
    return Array.from({ length: 50 }, (_, index) => {
      currentValue = currentValue * (1 + rateDecimal);
      return {
        year: index + 1,
        value: currentValue,
        gain: currentValue - initial,
        returnRate: ((currentValue - initial) / initial) * 100
      };
    });
  };

  // Calculate returns using the fixed rate
  const returns = calculateReturns(initialInvestment, interestRate);
  
  // Enhanced currency formatter with compact notation for large numbers
  const formatCurrency = (value, compact = false) => {
    if (compact) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Investment Return Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home value input */}
            <div className="space-y-2">
              <Label htmlFor="investment">Initial Home Value ($)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="Enter amount"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="max-w-xs"
                min="0"     
              />
            </div>
            {/* Appreciation rate input */}
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Appreciation Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="Enter rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="max-w-xs"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          {initialInvestment && interestRate && (
            <>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={returns}
                    margin={{ top: 10, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tickFormatter={(year) => `Year ${year}`}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value, true)}
                      width={80}
                      padding={{ top: 20, bottom: 20 }}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), "Value"]}
                      labelFormatter={(year) => `Year ${year}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f17422" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Year</th>
                      <th className="p-2 text-right">Value</th>
                      <th className="p-2 text-right">Gain</th>
                      <th className="p-2 text-right">Return</th>
                      <th className="p-2 text-right">Annual Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((row) => (
                      <tr key={row.year} className="border-b hover:bg-gray-50">
                        <td className="p-2">Year {row.year}</td> 
                        <td className="p-2 text-right font-medium">
                          {formatCurrency(row.value)}
                        </td>
                        <td className="p-2 text-right text-green-600">
                          {formatCurrency(row.gain)}
                        </td>
                        <td className="p-2 text-right">
                          {row.returnRate.toFixed(2)}%
                        </td>
                        <td className="p-2 text-right">
                          {interestRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;