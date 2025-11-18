'use client';

import React, { useState, useEffect } from 'react';
import MissionCard from './components/MissionCard';
import MissionModal from './components/AddMissionModal';
import Loader from '@/app/utils/Loaders/element/Loader';

export default function Missions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);

  const fetchMissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}missions`);
      if (!res.ok) {
        throw new Error('فشل جلب الأهداف');
      }
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}missions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMissions();
    } catch (err) {
      console.error('Failed to update status:', err);
      // استخدام رسالة بديلة
    }
  };

  const handleDeleteMission = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}missions/${id}`, {
        method: 'DELETE',
      });
      fetchMissions();
    } catch (err) {
      console.error('Failed to delete mission:', err);
      // استخدام رسالة بديلة
    }
  };

  const handleOpenEditModal = (mission) => {
    setCurrentMission(mission);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentMission(null);
    fetchMissions();
  };

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8 flex-col gap-5 md:flex-row">
        <h1 className="text-3xl font-bold">الأهداف</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3  bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
        >
          + إضافة هدف
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className='flex justify-center items-center col-span-full'>
            <Loader />
          </div>
        )}
        {error && <div className="text-red-500 col-span-full">{error}</div>}
        {!isLoading && missions.length === 0 ? (
          <p className='text-xl text-gray-400'>لا توجد أهداف متاحة. أضف هدف جديدة.</p>
        ) : (
          missions.map((mission) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteMission}
              onEdit={() => handleOpenEditModal(mission)}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <MissionModal
          onClose={handleModalClose}
          mission={currentMission}
        />
      )}
    </div>
  );
}
