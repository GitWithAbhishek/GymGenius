'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Image as ImageIcon, Coffee, Volume2, LoaderCircle } from 'lucide-react';
import type { DailyWorkout, PlanData } from '@/lib/types';
import { generateAudio } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface WorkoutPlanProps {
  planData: PlanData;
  onItemClick: (exerciseName: string) => void;
}

const getWorkoutDayText = (day: DailyWorkout): string => {
  if (day.exercises.length === 0) {
    return `Day ${day.day}: ${day.focus}. Today is a rest day. Take it easy and let your body recover.`;
  }

  let text = `Day ${day.day}: ${day.focus}. `;
  text += day.exercises.map(ex => 
    `${ex.name}. ${ex.sets} sets of ${ex.reps} repetitions, with ${ex.rest} rest in between.`
  ).join(' ');
  return text;
};

export function WorkoutPlan({ planData, onItemClick }: WorkoutPlanProps) {
  const { planTitle, weeklySchedule } = planData.workoutPlan;
  const [activeAudio, setActiveAudio] = React.useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayAudio = async (day: DailyWorkout) => {
    const dayId = `workout-day-${day.day}`;
    if (activeAudio === dayId) {
      audioRef.current?.pause();
      setActiveAudio(null);
      return;
    }

    setLoadingAudio(dayId);
    setActiveAudio(null);

    const textToRead = getWorkoutDayText(day);
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
        <CardDescription>Your weekly personalized training schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {weeklySchedule.map((day, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <div className="flex items-center w-full">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center gap-4">
                    <Badge>Day {day.day}</Badge>
                    <span className="font-semibold">{day.focus}</span>
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
                  disabled={loadingAudio === `workout-day-${day.day}`}
                >
                  {loadingAudio === `workout-day-${day.day}` ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Volume2 className={activeAudio === `workout-day-${day.day}` ? 'text-primary' : ''} />
                  )}
                </Button>
              </div>
              <AccordionContent>
                {day.exercises.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Exercise</TableHead>
                        <TableHead>Sets</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead>Rest</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {day.exercises.map((exercise, exIndex) => (
                        <TableRow key={exIndex}>
                          <TableCell className="font-medium">{exercise.name}</TableCell>
                          <TableCell>{exercise.sets}</TableCell>
                          <TableCell>{exercise.reps}</TableCell>
                          <TableCell>{exercise.rest}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-2 py-1 text-xs"
                              onClick={() => onItemClick(exercise.name)}
                            >
                              <ImageIcon className="mr-1 h-3 w-3" />
                              Visualize
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <Coffee className="h-10 w-10 mb-4" />
                    <h3 className="text-lg font-semibold">Rest & Recovery</h3>
                    <p className="text-sm">A great day to recover and grow stronger.</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
