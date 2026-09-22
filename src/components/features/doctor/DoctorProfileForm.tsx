'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  doctorId: string;
  initialData: {
    specialisation: string;
    licenseNumber: string;
    experienceYears: number;
    bio: string;
    isAvailable: boolean;
  };
}

export default function DoctorProfileForm({ doctorId, initialData }: Props) {
  const [specialisation, setSpecialisation] = useState(initialData.specialisation);
  const [licenseNumber, setLicenseNumber] = useState(initialData.licenseNumber);
  const [experienceYears, setExperienceYears] = useState(initialData.experienceYears);
  const [bio, setBio] = useState(initialData.bio);
  const [isAvailable, setIsAvailable] = useState(initialData.isAvailable);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/doctors/${doctorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialisation, licenseNumber, experienceYears, bio, isAvailable }),
    });

    setLoading(false);
    if (res.ok) {
      toast.success('Profile updated');
    } else {
      toast.error('Failed to update profile');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Specialisation</Label>
        <Input
          type="text"
          value={specialisation}
          onChange={(e) => setSpecialisation(e.target.value)}
          placeholder="e.g. Cardiology, Dermatology"
        />
      </div>

      <div className="space-y-2">
        <Label>License Number</Label>
        <Input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Years of Experience</Label>
        <Input
          type="number"
          min={0}
          max={60}
          value={experienceYears}
          onChange={(e) => setExperienceYears(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="A short professional bio..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="available"
          checked={isAvailable}
          onCheckedChange={(checked) => setIsAvailable(checked === true)}
        />
        <Label htmlFor="available" className="text-sm font-normal">
          Available for appointments
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
