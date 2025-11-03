
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Utensils, Save, Sparkles, XCircle, FileDown, LoaderCircle } from 'lucide-react';
import type { PlanData, UserProfile, MotivationalTipsOutput } from '@/lib/types';
import { WorkoutPlan } from './WorkoutPlan';
import { DietPlan } from './DietPlan';
import { ImageModal } from './ImageModal';
import { MotivationCarousel } from './MotivationCarousel';
import jsPDF from 'jspdf';

interface DashboardProps {
  userData: UserProfile;
  planData: PlanData;
  initialTips: MotivationalTipsOutput['tips'];
  onSave: () => void;
  onClear: () => void;
}

export function Dashboard({
  userData,
  planData,
  initialTips,
  onSave,
  onClear,
}: DashboardProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: 'exercise' | 'meal';
  }>({ isOpen: false, itemName: '', itemType: 'exercise' });
  const [isExporting, setIsExporting] = useState(false);

  const handleItemClick = (itemName: string, itemType: 'exercise' | 'meal') => {
    setModalState({ isOpen: true, itemName, itemType });
  };

  const handleExportPdf = async () => {
    setIsExporting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const addText = (text: string, size: number, isBold: boolean = false) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.setFontSize(size);
        pdf.setFont(undefined, isBold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, y);
        y += (lines.length * size) / 2.8; // Approximate line height
      };

      // Title
      addText(`Your GymGenius Plan for ${userData.name}`, 18, true);
      y += 5;

      // Workout Plan
      addText(planData.workoutPlan.planTitle, 14, true);
      y += 2;
      planData.workoutPlan.weeklySchedule.forEach(day => {
        addText(`Day ${day.day}: ${day.focus}`, 12, true);
        if (day.exercises.length > 0) {
            day.exercises.forEach(ex => {
                addText(`- ${ex.name}: ${ex.sets} sets of ${ex.reps} reps, ${ex.rest} rest`, 10);
            });
        } else {
            addText('- Rest & Recovery', 10);
        }
        y += 4;
      });

      // Diet Plan
      pdf.addPage();
      y = margin;
      addText(planData.dietPlan.planTitle, 14, true);
      y += 2;
      planData.dietPlan.dailyPlans.forEach(day => {
        addText(`Day ${day.day}: ${day.title}`, 12, true);
        day.meals.forEach(meal => {
            addText(`- ${meal.name} (~${meal.calories} kcal): ${meal.description}`, 10);
        });
        addText(`Daily Total: ~${day.dailySummary.totalCalories} kcal. Notes: ${day.dailySummary.notes}`, 10);
        y += 4;
      });
      
      pdf.save(`GymGenius_Plan_${userData.name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your AI-Generated Plan</h1>
          <p className="text-muted-foreground">
            Here is the personalized workout and diet plan crafted just for you.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={onSave}><Save className="mr-2" />Save Plan</Button>
          <Button variant="outline" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? <LoaderCircle className="mr-2 animate-spin" /> : <FileDown className="mr-2" />}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button variant="destructive" onClick={onClear}><XCircle className="mr-2" />New Plan</Button>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2"><Sparkles className="text-primary"/>AI Motivational Tips</h2>
        <MotivationCarousel tips={initialTips} />
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">
            <Dumbbell className="mr-2" />
            Workout Plan
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Utensils className="mr-2" />
            Diet Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workout" id="workout-plan-content">
          <WorkoutPlan
            planData={planData}
            onItemClick={(name) => handleItemClick(name, 'exercise')}
          />
        </TabsContent>
        <TabsContent value="diet" id="diet-plan-content">
          <DietPlan
            planData={planData}
            onItemClick={(name) => handleItemClick(name, 'meal')}
          />
        </TabsContent>
      </Tabs>

      <ImageModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        itemName={modalState.itemName}
        itemType={modalState.itemType}
      />
    </div>
  );
}
