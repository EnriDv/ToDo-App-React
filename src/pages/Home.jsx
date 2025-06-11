import React, { useEffect, useState } from 'react';
import {supabase, getSupaBaseClient} from '../supabase-client'; // Asegúrate de que 'supabase-client' inicialice supabase correctamente
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { SheetsList } from '../components/Sheets/SheetsList';
import {CreateSheetModal} from '../components/Sheets/CreateSheetModal';
import { EditSheetModal } from '../components/Sheets/EditSheetModal';

function Home() {
  const { session, signOut } = UserAuth();
  const [sheets, setSheets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSheet, setEditingSheet] = useState(null);

  const fetchSheets = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      console.log("No user ID found, skipping fetchSheets.");
      return;
    }

    const supabaseTodoClient = getSupaBaseClient('todo');
    const { data, error } = await supabaseTodoClient
      .from("sheets")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching sheets: ", error); 
    } else {
      setSheets(data);
    }
  };

    const handleSheetAdded = async (newSheet) => {
      await fetchSheets();
    };

    const handleSheetUpdated = async (updatedSheet) => {
      await fetchSheets();
    };


    const handleSheetDeleted = (deletedId) => {
      setSheets(prev => prev.filter(s => s.id !== deletedId));
    };

    useEffect(() => {
      fetchSheets();
    }, []);

  return (
    <div className="min-h-screen bg-[#0D0714] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Hojas</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#9E78CF] text-[#0D0714] font-semibold px-6 py-2 rounded hover:opacity-90 transition"
        >
          Crear nueva Hoja
        </button>
      </div>
      <SheetsList
        sheets={sheets}
        onEdit={(sheet) => setEditingSheet(sheet)}
        onDelete={handleSheetDeleted}
      />

      <CreateSheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSheetAdded={handleSheetAdded}
      />

      <EditSheetModal
        isOpen={!!editingSheet}
        onClose={() => setEditingSheet(null)}
        sheet={editingSheet}
        onSheetUpdated={handleSheetUpdated}
      />
      </div>
  );
};

export default Home;