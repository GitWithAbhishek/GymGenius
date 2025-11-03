'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DailyDiet, PlanData } from '@/lib/types';
import { Button } from '../ui/button';
import { Image as ImageIcon, Volume2, LoaderCircle } from 'lucide-react';
import { generateAudio } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface DietPlanProps {
  planData: PlanData;
  onItemClick: (mealName: string) => void;
}

const getDietDayText = (day: DailyDiet): string => {
  let text = `Day ${day.day}: ${day.title}. `;
  text += day.meals.map(meal => 
    `${meal.name}. Calories: ${meal.calories}. Description: ${meal.description}`
  ).join('. ');
  text += ` Daily Summary. Total Calories: ${day.dailySummary.totalCalories}. Notes: ${day.dailySummary.notes}`;
  return text;
};

export function DietPlan({ planData, onItemClick }: DietPlanProps) {
  const { planTitle, dailyPlans } = planData.dietPlan;
  const [activeAudio, setActiveAudio] = React.useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();


  const handlePlayAudio = async (day: DailyDiet) => {
    const dayId = `diet-day-${day.day}`;
    if (activeAudio === dayId) {
      audioRef.current?.pause();
      setActiveAudio(null);
      return;
    }

    setLoadingAudio(dayId);
    setActiveAudio(null);

    const textToRead = getDietDayText(day);
    const result = await generateAudio(textToRead);

    setLoadingAudio(null);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.error,
      });
    } else {
      if (audioRef.current) {
        audioRef.current.src = result.audioUrl;
        audioRef.current.play();
        setActiveAudio(dayId);
      }
    }
  };
  
  React.useEffect(() => {
    const audioElement = new Audio();
    audioElement.addEventListener('ended', () => setActiveAudio(null));
    audioRef.current = audioElement;

    return () => {
      audioRef.current?.pause();
    };
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{planTitle}</CardTitle>
        <CardDescription>Your weekly personalized nutrition guide.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {dailyPlans.map((day, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <div className="flex items-center w-full">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Day {day.day}</Badge>
                    <span className="font-semibold">{day.title}</span>
                  </div>
                </AccordionTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(day);
                  }}
                  disabled={loadingAudio === `diet-day-${day.day}`}
                >
                  {loadingAudio === `diet-day-${day.day}` ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Volume2 className={activeAudio === `diet-day-${day.day}` ? 'text-primary' : ''} />
                  )}
                </Button>
              </div>
              <AccordionContent>
                <div className="space-y-4 pl-4 pt-2">
                  {day.meals.map((meal, mealIndex) => (
                    <Card key={mealIndex} className="bg-background/50">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">{meal.name}</CardTitle>
                            <CardDescription className="text-xs pt-1">{meal.calories} kcal</CardDescription>
                          </div>
                           <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => onItemClick(meal.name)}
                          >
                            <ImageIcon className="mr-1 h-3 w-3" />
                            Visualize
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                   <div className="p-4 border-t mt-4">
                      <h4 className="font-semibold mb-2">Daily Summary</h4>
                      <p className="text-sm"><strong>Total Calories:</strong> {day.dailySummary.totalCalories} kcal</p>
                      <p className="text-sm text-muted-foreground mt-1"><strong>Notes:</strong> {day.dailySummary.notes}</p>
                   </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
