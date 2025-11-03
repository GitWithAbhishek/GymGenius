
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { generatePlans } from '@/lib/actions';
import type { UserProfile, PlanData, MotivationalTipsOutput } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Loading from './loading';
import { ProfileForm } from '@/components/home/ProfileForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { usePlan } from '@/hooks/use-plan';


interface HomePageClientProps {
  initialTips: MotivationalTipsOutput['tips'];
}

export default function HomePageClient({ initialTips }: HomePageClientProps) {
  const { 
    userData, 
    planData, 
    isLoading, 
    isGenerating, 
    handleGeneratePlan, 
    handleSavePlan, 
    handleClearPlan 
  } = usePlan();
  
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  if (isLoading) {
    return <Loading />;
  }

  if (planData && userData) {
    return (
      <Dashboard
        userData={userData}
        planData={planData}
        initialTips={initialTips}
        onSave={handleSavePlan}
        onClear={handleClearPlan}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative rounded-lg overflow-hidden mb-12 min-h-[400px] flex items-center justify-center text-center p-8">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Forge Your Ultimate Fitness Path with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              GymGenius
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Your personal AI trainer and nutritionist is ready. Create a bespoke
            workout and diet plan in seconds.
          </p>
        </div>
      </div>
      <ProfileForm onSubmit={handleGeneratePlan} isLoading={isGenerating} />
    </div>
  );
}
