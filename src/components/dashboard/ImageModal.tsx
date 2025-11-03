'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { generateImage } from '@/lib/actions';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: 'exercise' | 'meal';
}

export function ImageModal({ isOpen, onClose, itemName, itemType }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && itemName) {
      const fetchImage = async () => {
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        
        const result = await generateImage(itemName, itemType);
        
        if ('error' in result) {
          setError(result.error);
        } else {
          setImageUrl(result.imageUrl);
        }
        setIsLoading(false);
      };

      fetchImage();
    }
  }, [isOpen, itemName, itemType]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="capitalize">{itemName}</DialogTitle>
          <DialogDescription>
            An AI-generated visual representation of the {itemType}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center min-h-[300px]">
          {isLoading && <Skeleton className="h-[300px] w-[475px] rounded-lg" />}
          {error && !isLoading && (
             <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Image Generation Failed</AlertTitle>
                <AlertDescription>
                  {error} Please try again later.
                </AlertDescription>
            </Alert>
          )}
          {imageUrl && !isLoading && (
            <Image
              src={imageUrl}
              alt={`An AI-generated visual for ${itemName}`}
              width={475}
              height={300}
              className={`rounded-lg object-cover`}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
