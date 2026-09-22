'use client';

import { useState } from 'react';

interface Doctor {
  id: string;
  specialisation: string | null;
  experienceYears: number | null;
  user: { name: string };
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchDoctors(specialisation?: string) {
    setLoading(true);
    const params = specialisation ? `?specialisation=${encodeURIComponent(specialisation)}` : '';
    const res = await fetch(`/api/doctors${params}`);
    if (res.ok) {
      setDoctors(await res.json());
    }
    setLoading(false);
  }

  return { doctors, loading, fetchDoctors };
}

export function useBookAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function book(data: { doctorId: string; scheduledAt: string; notes?: string }) {
    setLoading(true);
    setError('');
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Booking failed');
      return null;
    }
    return await res.json();
  }

  return { book, loading, error };
}

export function useAppointmentActions() {
  const [loading, setLoading] = useState(false);

  async function updateStatus(id: string, status: string) {
    setLoading(true);
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    return res.ok;
  }

  async function cancelAppointment(id: string) {
    setLoading(true);
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    setLoading(false);
    return res.ok;
  }

  return { updateStatus, cancelAppointment, loading };
}
