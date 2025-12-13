import { ShoppingCart, Package, Trash2 } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { useAuth } from '../../services/context/AuthContext.jsx';

export const SweetCard = ({ sweet, onPurchase, onRestock, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <Card hover className="flex flex-col">
      <img
        src={sweet.sweetImage || 'https://via.placeholder.com/300x200?text=Sweet'}
        alt={sweet.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
            <p className="text-sm text-gray-600">{sweet.flavor}</p>
          </div>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {sweet.category}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-green-600">₹{sweet.price}</p>
          <p className={`text-sm font-semibold ${
            sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {sweet.quantity > 0 ? `In Stock: ${sweet.quantity}` : 'Out of Stock'}
          </p>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <Button
            onClick={() => onPurchase(sweet)}
            disabled={sweet.quantity === 0}
            variant="primary"
            className="flex-1"
          >
            <ShoppingCart size={16} />
            Buy
          </Button>
          
          {isAdmin() && (
            <>
              <Button
                onClick={() => onRestock(sweet)}
                variant="success"
                size="md"
                title="Restock"
              >
                <Package size={18} />
              </Button>
              
              <Button
                onClick={() => onDelete(sweet)}
                variant="danger"
                size="md"
                title="Delete"
              >
                <Trash2 size={18} />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};