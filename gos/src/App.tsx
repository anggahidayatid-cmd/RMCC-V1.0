import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TopHeader } from './components/layout/TopHeader';
import { TodayTab } from './components/tabs/TodayTab';
import { ReservationsTab } from './components/tabs/ReservationsTab';
import { GuestsTab } from './components/tabs/GuestsTab';
import { ClosingTab } from './components/tabs/ClosingTab';
import { MoreTab } from './components/tabs/MoreTab';
import { ReservationModal } from './components/modals/ReservationModal';
import { GuestModal } from './components/modals/GuestModal';
import {
  getSyncedGOSData,
  getTablesState,
  saveTablesState,
  addGuest,
  updateGuest,
  deleteGuest,
  addReservation,
  updateReservation,
  deleteReservation,
  addShiftClosing,
} from './services/gosService';
import { subscribeSyncEvents } from './services/syncService';
import { GOSReservation, GOSGuest, GOSShiftClosing, TableInfo, TableStatusCode, GOSReservationStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'reservations' | 'guests' | 'closing' | 'more'>('today');
  const [outletName, setOutletName] = useState('Jakarta Flagship Dining');
  const [activeStaff, setActiveStaff] = useState('Manager Joko');

  const [gosData, setGosData] = useState(getSyncedGOSData());
  const [tables, setTables] = useState<TableInfo[]>(getTablesState());

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<GOSReservation | null>(null);

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GOSGuest | null>(null);

  // Sync events listener across RMCC and GOS
  useEffect(() => {
    const unsubscribe = subscribeSyncEvents(() => {
      setGosData(getSyncedGOSData());
      setTables(getTablesState());
    });
    return unsubscribe;
  }, []);

  const refreshData = () => {
    setGosData(getSyncedGOSData());
    setTables(getTablesState());
  };

  // Table status update handler
  const handleUpdateTableStatus = (tableId: string, status: TableStatusCode) => {
    const updated = tables.map((t) => (t.id === tableId ? { ...t, status } : t));
    setTables(updated);
    saveTablesState(updated);
  };

  // Reservation handlers
  const handleSaveReservation = (res: GOSReservation) => {
    const exists = gosData.reservations.some((r) => r.id === res.id);
    if (exists) {
      updateReservation(res);
    } else {
      addReservation(res);
    }
    refreshData();
  };

  const handleDeleteReservation = (id: string) => {
    deleteReservation(id);
    refreshData();
  };

  const handleUpdateReservationStatus = (id: string, status: GOSReservationStatus) => {
    const target = gosData.reservations.find((r) => r.id === id);
    if (target) {
      updateReservation({ ...target, status });
      refreshData();
    }
  };

  // Guest handlers
  const handleSaveGuest = (guest: GOSGuest) => {
    const exists = gosData.guests.some((g) => g.id === guest.id);
    if (exists) {
      updateGuest(guest);
    } else {
      addGuest(guest);
    }
    refreshData();
  };

  const handleDeleteGuest = (id: string) => {
    deleteGuest(id);
    refreshData();
  };

  // Shift Closing handler
  const handleAddClosing = (closing: GOSShiftClosing) => {
    addShiftClosing(closing);
    refreshData();
  };

  return (
    <div className="flex h-screen bg-background text-dark overflow-hidden font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationsCount={gosData.reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Pending').length}
        guestsCount={gosData.guests.length}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader outletName={outletName} activeStaff={activeStaff} onRefresh={refreshData} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'today' && (
            <TodayTab
              reservations={gosData.reservations}
              tables={tables}
              onUpdateTableStatus={handleUpdateTableStatus}
              onOpenNewReservation={() => {
                setSelectedReservation(null);
                setIsReservationModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reservations' && (
            <ReservationsTab
              reservations={gosData.reservations}
              onOpenNew={() => {
                setSelectedReservation(null);
                setIsReservationModalOpen(true);
              }}
              onEdit={(res) => {
                setSelectedReservation(res);
                setIsReservationModalOpen(true);
              }}
              onDelete={handleDeleteReservation}
              onUpdateStatus={handleUpdateReservationStatus}
            />
          )}

          {activeTab === 'guests' && (
            <GuestsTab
              guests={gosData.guests}
              onOpenNew={() => {
                setSelectedGuest(null);
                setIsGuestModalOpen(true);
              }}
              onEdit={(g) => {
                setSelectedGuest(g);
                setIsGuestModalOpen(true);
              }}
              onDelete={handleDeleteGuest}
            />
          )}

          {activeTab === 'closing' && (
            <ClosingTab shiftClosings={gosData.shiftClosings} onAddClosing={handleAddClosing} />
          )}

          {activeTab === 'more' && (
            <MoreTab
              outletName={outletName}
              setOutletName={setOutletName}
              activeStaff={activeStaff}
              setActiveStaff={setActiveStaff}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onSave={handleSaveReservation}
        initialReservation={selectedReservation}
      />

      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSave={handleSaveGuest}
        initialGuest={selectedGuest}
      />
    </div>
  );
}

export default App;
