import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Package,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Delivery, DeliveryStatus, Language } from '../types';
import { translations } from '../data/translations';

interface DeliveriesViewProps {
  deliveries: Delivery[];
  currentLang: Language;
  onUpdateDeliveryStatus: (deliveryId: string, newStatus: DeliveryStatus) => void;
}

export const DeliveriesView: React.FC<DeliveriesViewProps> = ({
  deliveries,
  currentLang,
  onUpdateDeliveryStatus
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.truckNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Out for Delivery':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse';
      case 'Loaded':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Returned':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const nextStatusMap: Record<DeliveryStatus, DeliveryStatus | null> = {
    'Pending': 'Loaded',
    'Loaded': 'Out for Delivery',
    'Out for Delivery': 'Delivered',
    'Delivered': null,
    'Returned': null
  };

  return (
    <div className="space-y-6">
      {/* Fleet Delivery KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Active Deliveries</div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            {deliveries.filter((d) => d.status !== 'Delivered' && d.status !== 'Returned').length}
          </div>
          <div className="text-[11px] text-blue-400 mt-1">On road or staging</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Completed Dispatches</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {deliveries.filter((d) => d.status === 'Delivered').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Successfully signed off</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Total Cargo Tonnage</div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {(deliveries.reduce((sum, d) => sum + d.weightKg, 0) / 1000).toFixed(1)} <span className="text-xs text-slate-400 font-normal">Tons</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Mortars, resins & membranes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Freight Revenue</div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            ${deliveries.reduce((sum, d) => sum + d.deliveryCharge, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Billed transport charges</div>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search manifest, customer site, truck plate, driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {['all', 'Pending', 'Loaded', 'Out for Delivery', 'Delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 'all' ? 'All Deliveries' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((del) => {
          const nextStatus = nextStatusMap[del.status];

          return (
            <div
              key={del.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      {del.deliveryNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                      {del.customerName}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(del.status)}`}>
                    {del.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 my-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{del.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{del.truckNumber} · Driver: {del.driverName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300">{del.itemsSummary}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">MANIFEST WEIGHT</span>
                    <span className="text-slate-200 font-semibold">{del.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">DELIVERY FEE</span>
                    <span className="text-amber-400 font-semibold">${del.deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">INV REF</span>
                    <span className="text-slate-300 font-semibold">{del.invoiceNumber}</span>
                  </div>
                </div>

                {del.notes && (
                  <div className="text-[11px] text-slate-500 mt-2 italic">
                    Note: {del.notes}
                  </div>
                )}
              </div>

              {/* Status Action */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {del.dispatchedAt ? `Departed: ${del.dispatchedAt.split(' ')[1]}` : 'Staging at depot'}
                </span>

                {nextStatus ? (
                  <button
                    onClick={() => onUpdateDeliveryStatus(del.id, nextStatus)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                  >
                    <span>Mark {nextStatus}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Delivered
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
