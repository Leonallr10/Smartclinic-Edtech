'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  patientId: string;
  initialData: {
    phone: string;
    dateOfBirth: string;
    bloodGroup: string;
    address: string;
  };
}

export default function ProfileForm({ patientId, initialData }: Props) {
  const [phone, setPhone] = useState(initialData.phone);
  const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth);
  const [bloodGroup, setBloodGroup] = useState(initialData.bloodGroup);
  const [address, setAddress] = useState(initialData.address);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/patients/${patientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, dateOfBirth, bloodGroup, address }),
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
        <Label>Phone</Label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <Input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Blood Group</Label>
        <Select value={bloodGroup} onValueChange={setBloodGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
