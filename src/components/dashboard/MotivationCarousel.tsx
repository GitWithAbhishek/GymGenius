'use client';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import type { MotivationalTipsOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Lightbulb, Volume2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAudio } from '@/lib/actions';

interface MotivationCarouselProps {
  tips: MotivationalTipsOutput['tips'];
}

export function MotivationCarousel({ tips }: MotivationCarouselProps) {
  const [activeAudio, setActiveAudio] = React.useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const audioElement = new Audio();
    audioElement.addEventListener('ended', () => setActiveAudio(null));
    audioRef.current = audioElement;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlayAudio = async (tip: MotivationalTipsOutput['tips'][0], index: number) => {
    const tipId = `tip-${index}`;

    // If same audio is playing, stop it
    if (activeAudio === tipId) {
      audioRef.current?.pause();
      setActiveAudio(null);
      return;
    }

    setLoadingAudio(tipId);
    setActiveAudio(null);

    const textToRead = `${tip.tip} - ${tip.advice}`;
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
        setActiveAudio(tipId);
      }
    }
  };

  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent>
        {tips.map((tip, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="bg-card/50">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-4 text-center relative">
                  <Lightbulb className="w-8 h-8 text-primary" />

                  {/* Tip text with escaped quotes */}
                  <p className="text-lg font-semibold italic">
                    &quot;{tip.tip}&quot;
                  </p>

                  <p className="text-sm text-muted-foreground">{tip.advice}</p>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handlePlayAudio(tip, index)}
                    disabled={loadingAudio === `tip-${index}`}
                  >
                    {loadingAudio === `tip-${index}` ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Volume2
                        className={
                          activeAudio === `tip-${index}` ? 'text-primary' : ''
                        }
                      />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
