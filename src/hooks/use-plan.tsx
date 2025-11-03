
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePlans } from '@/lib/actions';
import type { UserProfile, PlanData } from '@/lib/types';

const SAVED_PLAN_KEY = 'gymgenius_saved_plan';

interface PlanContextType {
  userData: UserProfile | null;
  planData: PlanData | null;
  hasPlan: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  handleGeneratePlan: (profileData: UserProfile) => Promise<void>;
  handleSavePlan: () => void;
  handleClearPlan: () => void;
  clearPlan: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(SAVED_PLAN_KEY);
      if (savedPlan) {
        const { user, plan } = JSON.parse(savedPlan);
        setUserData(user);
        setPlanData(plan);
        toast({
          title: 'Welcome Back!',
          description: "We've loaded your previously saved plan.",
        });
      }
    } catch (error) {
      console.error('Failed to load saved plan from localStorage', error);
      localStorage.removeItem(SAVED_PLAN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleGeneratePlan = useCallback(async (profileData: UserProfile) => {
    setIsGenerating(true);
    const result = await generatePlans(profileData);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
    } else {
      setUserData(profileData);
      setPlanData(result);
      toast({
        title: 'Success!',
        description: 'Your personalized plans have been generated.',
      });
    }
    setIsGenerating(false);
  }, [toast]);

  const handleSavePlan = useCallback(() => {
    if (userData && planData) {
      try {
        const dataToSave = JSON.stringify({ user: userData, plan: planData });
        localStorage.setItem(SAVED_PLAN_KEY, dataToSave);
        toast({
          title: 'Plan Saved!',
          description: 'Your plan has been saved to your device.',
        });
      } catch (error) {
        console.error('Failed to save plan to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: 'Could not save your plan.',
        });
      }
    }
  }, [userData, planData, toast]);

  const handleClearPlan = useCallback(() => {
    setUserData(null);
    setPlanData(null);
    localStorage.removeItem(SAVED_PLAN_KEY);
    toast({
      title: 'New Plan Started',
      description: 'Your previous plan has been cleared.',
    });
  }, [toast]);

  const value = {
    userData,
    planData,
    hasPlan: !!planData,
    isLoading,
    isGenerating,
    handleGeneratePlan,
    handleSavePlan,
    handleClearPlan,
    clearPlan: handleClearPlan,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
