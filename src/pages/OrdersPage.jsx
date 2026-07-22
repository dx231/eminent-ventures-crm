import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Plus, SignOut, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  new: 'bg-[#E4E4E7] text-[#27272A]',
  dispatched: 'bg-[#DBEAFE] text-[#1E40AF]',
  in_transit: 'bg-[#FEF3C7] text-[#92400E]',
  delivered: 'bg-[#D1FAE5] text-[#065F46]',
  cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    pickup_location: '',
    dropoff_location: '',
    vehicle_info: '',
    price: '',
  });

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Could not load orders: ' + error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('orders').insert([
      {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        status: 'new',
      },
    ]);
    if (error) {
      toast.error('Error adding order: ' + error.message);
    } else {
      toast.success('Order added');
      setForm({ customer_name: '', pickup_location: '', dropoff_location: '', vehicle_info: '', price: '' });
      setShowForm(false);
      loadOrders();
    }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      loadOrders();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <header className="bg-white border-b border-[#E4E4E7] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#18181B] rounded-sm flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" weight="duotone" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#09090B]">Eminent Ventures CRM</h1>
            {profile && <p className="text-xs text-[#71717A]">{profile.full_name} · {profile.role}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowForm(true)} className="bg-[#18181B] text-white hover:bg-[#27272A]">
            <Plus className="w-4 h-4 mr-1" /> New Order
          </Button>
          <Button onClick={handleSignOut} className="bg-transparent border border-[#E4E4E7] text-[#27272A]">
            <SignOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <p className="text-sm text-[#71717A]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-[#71717A]">
            <p>No orders yet. Click "New Order" to add your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-[#E4E4E7] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F4F5] text-[#52525B] text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Pickup</th>
                  <th className="text-left px-4 py-3">Dropoff</th>
                  <th className="text-left px-4 py-3">Vehicle</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-[#F4F4F5]">
                    <td className="px-4 py-3">{o.customer_name}</td>
                    <td className="px-4 py-3">{o.pickup_location}</td>
                    <td className="px-4 py-3">{o.dropoff_location}</td>
                    <td className="px-4 py-3">{o.vehicle_info}</td>
                    <td className="px-4 py-3">{o.price ? `$${o.price}` : '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`text-xs font-medium rounded-sm px-2 py-1 border-0 ${STATUS_COLORS[o.status] || ''}`}
                      >
                        <option value="new">New</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-[#71717A]">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-[#09090B]">New Order</h2>
            <form onSubmit={handleAddOrder} className="space-y-3">
              <div>
                <Label>Customer Name</Label>
                <Input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              </div>
              <div>
                <Label>Pickup Location</Label>
                <Input required value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} />
              </div>
              <div>
                <Label>Dropoff Location</Label>
                <Input required value={form.dropoff_location} onChange={(e) => setForm({ ...form, dropoff_location: e.target.value })} />
              </div>
              <div>
                <Label>Vehicle Info</Label>
                <Input placeholder="e.g. 2020 Honda Civic" value={form.vehicle_info} onChange={(e) => setForm({ ...form, vehicle_info: e.target.value })} />
              </div>
              <div>
                <Label>Price (USD)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <Button type="submit" className="w-full bg-[#18181B] text-white hover:bg-[#27272A]">
                Add Order
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
