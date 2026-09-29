"use client"

import { format } from 'date-fns'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export function ButtonDatePicker() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const router = useRouter();

  function handleChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedDate(e.target.value);

    const url = new URL(window.location.href);
    url.searchParams.set('date', e.target.value);

    router.push(url.toString());
  }

  return (
    <input
      type="date"
      id="start"
      className="border-2 px-2 py-1 rounded-md text-sm md:text-base"
      value={selectedDate}
      onChange={handleChangeDate}
    />
  )
}
