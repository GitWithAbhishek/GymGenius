
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Bot, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserProfileSchema, type UserProfile } from '@/lib/types';
import React from 'react';

interface ProfileFormProps {
  onSubmit: (data: UserProfile) => void;
  isLoading: boolean;
}

export function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: '',
      age: 25,
      gender: 'male',
      height: 180,
      weight: 75,
      fitnessGoals: 'weight-loss',
      workoutLocation: 'gym',
      availableEquipment: 'Basic dumbbells, bench, resistance bands',
      experienceLevel: 'beginner',
      daysPerWeek: 3,
      workoutType: 'strength-training',
      dietaryPreferences: 'none',
      mealCount: 3,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="text-primary" />
              Tell Us About Yourself
            </CardTitle>
            <CardDescription>
              Provide your details so our AI can craft the perfect plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-8 border-b pb-8 mb-8">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="25" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-8">
                  <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="180" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                  <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="75" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                </div>
            </div>


            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="fitnessGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goals</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="general-fitness">General Fitness</SelectItem>
                          <SelectItem value="endurance">Improve Endurance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workoutLocation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Workout Location</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="gym" />
                            </FormControl>
                            <FormLabel className="font-normal">Gym</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="home" />
                            </FormControl>
                            <FormLabel className="font-normal">Home</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workoutType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Workout Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="strength-training">Strength Training</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="flexibility">Flexibility/Yoga</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daysPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Days Per Week: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={7}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="availableEquipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Equipment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Dumbbells, resistance bands, treadmill..."
                          className="resize-none h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List the equipment you have access to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <FormField
                  control={form.control}
                  name="dietaryPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any dietary preferences?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="paleo">Paleo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mealCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meals Per Day: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                'Generating Your Plan...'
              ) : (
                <>
                  <Bot className="mr-2" />
                  Generate My AI Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

    