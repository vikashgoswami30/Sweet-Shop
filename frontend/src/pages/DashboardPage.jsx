import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../services/context/AuthContext.jsx';
import { useSweets } from '../services/hooks/useSweets.js';
import { SweetCard } from '../components/sweets/SweetsCard.jsx';
import { SearchBar } from '../components/sweets/SearchBar.jsx';
import { AddSweetModal } from '../components/sweets/AddSweetModal.jsx';
import { EditSweetModal } from '../components/sweets/EditSweetModal.jsx';
import { Button } from '../components/common/Button.jsx';

export const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const { sweets, loading, searchSweets, purchaseSweet, restockSweet, deleteSweet, fetchSweets } = useSweets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      searchSweets(query);
    } else {
      fetchSweets();
    }
  };

  const handlePurchase = async (sweet) => {
    const quantity = prompt(`How many ${sweet.name} would you like to purchase?`, '1');
    if (!quantity || isNaN(quantity) || quantity <= 0) return;

    const result = await purchaseSweet(sweet._id, parseInt(quantity));
    if (result.success) {
      alert(`Successfully purchased ${quantity} ${sweet.name}!`);
    } else {
      alert(result.error || 'Purchase failed');
    }
  };

  const handleRestock = async (sweet) => {
    const quantity = prompt(`How many ${sweet.name} would you like to restock?`, '10');
    if (!quantity || isNaN(quantity) || quantity <= 0) return;

    const result = await restockSweet(sweet._id, parseInt(quantity));
    if (result.success) {
      alert(`Successfully restocked ${quantity} ${sweet.name}!`);
    } else {
      alert(result.error || 'Restock failed');
    }
  };

  const handleDelete = async (sweet) => {
    if (!confirm(`Are you sure you want to delete ${sweet.name}?`)) return;

    const result = await deleteSweet(sweet._id);
    if (result.success) {
      alert(`${sweet.name} deleted successfully!`);
    } else {
      alert(result.error || 'Delete failed');
    }
  };

  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    fetchSweets();
    setShowEditModal(false);
    setSelectedSweet(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-600">🍬 Sweet Shop</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
              <User size={20} className="text-purple-600" />
              <div>
                <p className="font-semibold text-sm">{user?.fullName}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <Button onClick={handleLogout} variant="danger">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {isAdmin() && (
            <Button onClick={() => setShowAddModal(true)} variant="success" size="lg">
              <Plus size={20} />
              Add Sweet
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-purple-600" size={48} />
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No sweets found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or add new sweets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <AddSweetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSweets}
      />

      <EditSweetModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSweet(null);
        }}
        onSuccess={handleEditSuccess}
        sweet={selectedSweet}
      />
    </div>
  );
};