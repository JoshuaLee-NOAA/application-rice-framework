'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Application } from '@/lib/types';

// Simplified schema for Phase 3
const FormSchema = z.object({
  Application: z.string().min(1, 'Application name is required'),
  'Program Name': z.string().min(1, 'Program name is required'),
  'Prod URL': z.string().optional().default(''),
  'Dev URL': z.string().optional().default(''),
  'Test URL': z.string().optional().default(''),
  'Public Access?': z.enum(['Yes', 'No', 'Unknown']),
  'Technology Stack': z.string().min(1, 'Technology stack is required'),
  'Product Owner': z.string().min(1, 'Product owner is required'),
  'Product Contact': z.string().min(1, 'Product contact is required'),
  'Number of Users': z.coerce.number().min(0),
  Purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
});

type FormData = z.infer<typeof FormSchema>;

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: application ? {
      Application: application.Application,
      'Program Name': application['Program Name'],
      'Prod URL': application['Prod URL'] || '',
      'Public Access?': application['Public Access?'] || 'Unknown',
      'Technology Stack': application['Technology Stack'],
      'Product Owner': application['Product Owner'],
      'Product Contact': application['Product Contact'],
      'Number of Users': application['Number of Users'] || 0,
      Purpose: application.Purpose,
    } : {
      'Public Access?': 'Unknown',
      'Number of Users': 0,
    },
  });

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Application">Application Name *</Label>
          <Input
            id="Application"
            {...register('Application')}
          />
          {errors.Application && (
            <p className="text-sm text-red-600">{errors.Application.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="Program Name">Program Name *</Label>
          <Input
            id="Program Name"
            {...register('Program Name')}
          />
          {errors['Program Name'] && (
            <p className="text-sm text-red-600">{errors['Program Name'].message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="Prod URL">Production URL</Label>
        <Input
          id="Prod URL"
          {...register('Prod URL')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Technology Stack">Technology Stack *</Label>
          <Input
            id="Technology Stack"
            {...register('Technology Stack')}
          />
          {errors['Technology Stack'] && (
            <p className="text-sm text-red-600">{errors['Technology Stack'].message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="Public Access?">Public Access *</Label>
          <select
            id="Public Access?"
            {...register('Public Access?')}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Product Owner">Product Owner *</Label>
          <Input
            id="Product Owner"
            {...register('Product Owner')}
          />
          {errors['Product Owner'] && (
            <p className="text-sm text-red-600">{errors['Product Owner'].message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="Product Contact">Product Contact Email *</Label>
          <Input
            id="Product Contact"
            type="email"
            {...register('Product Contact')}
          />
          {errors['Product Contact'] && (
            <p className="text-sm text-red-600">{errors['Product Contact'].message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="Number of Users">Number of Users *</Label>
        <Input
          id="Number of Users"
          type="number"
          {...register('Number of Users')}
        />
        {errors['Number of Users'] && (
          <p className="text-sm text-red-600">{errors['Number of Users'].message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="Purpose">Purpose *</Label>
        <textarea
          id="Purpose"
          {...register('Purpose')}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        {errors.Purpose && (
          <p className="text-sm text-red-600">{errors.Purpose.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-navy-500 hover:bg-navy-600" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : application ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
