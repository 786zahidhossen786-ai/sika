import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Product, StockMovement, Language, MovementType } from '../types';
import { translations } from '../data/translations';

interface InventoryViewProps {
  products: Product[];
  stockMovements: StockMovement[];
  currentLang: Language;
  onAdjustStock: (movement: StockMovement) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  stockMovements,
  currentLang,
  onAdjustStock
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Adjustment Modal State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [movementType, setMovementType] = useState<MovementType>('adjustment');
  const [quantityDelta, setQuantityDelta] = useState<number>(10);
  const [reason, setReason] = useState<string>('Routine warehouse cycle count verification');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const totalInventoryValuation = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchaseCost,
    0
  );
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStockOnly ? p.currentStock <= p.reorderLevel : true;
    return matchesSearch && matchesLowStock;
  });

  const handleConfirmAdjustment = () => {
    if (!selectedProduct || quantityDelta === 0) return;

    let finalDelta = quantityDelta;
    if (movementType === 'damage_loss') {
      finalDelta = -Math.abs(quantityDelta);
    }

    const previousStock = selectedProduct.currentStock;
    const newStock = Math.max(0, previousStock + finalDelta);

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      productId: selectedProduct.id,
      productCode: selectedProduct.code,
      productName: selectedProduct.name,
      type: movementType,
      quantity: finalDelta,
      previousStock,
      newStock,
      referenceDoc: `ADJ-2026-${String(stockMovements.length + 101).padStart(3, '0')}`,
      reason: reason || 'Warehouse stock audit',
      user: 'Warehouse Lead'
    };

    onAdjustStock(movement);
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Inventory Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Total Inventory Valuation (Cost)
          </div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            ${totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Calculated at actual procurement landed cost
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Total Physical Units On-Hand
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {totalUnitsInStock.toLocaleString()} <span className="text-xs text-slate-400 font-normal">items</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {products.length} catalog SKU lines
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Critical Reorder Alerts
          </div>
          <div className={`text-2xl font-bold tabular-nums ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockCount} <span className="text-xs text-slate-400 font-normal">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lowStockCount > 0 ? 'Immediate purchase order required' : 'All SKUs above minimum threshold'}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU or product to check warehouse stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              filterLowStockOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Low Stock Filter</span>
          </button>
        </div>

        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-950" />
          <span>Adjust Stock / Log Damage</span>
        </button>
      </div>

      {/* Real-time Stock Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                <th className="py-3 px-4">Sika SKU & Name</th>
                <th className="py-3 px-4">Warehouse Location</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Physical Stock</th>
                <th className="py-3 px-4 text-right">Min Threshold</th>
                <th className="py-3 px-4 text-right">Total Valuation</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.map((p) => {
                const isLow = p.currentStock <= p.reorderLevel;
                const valuation = p.currentStock * p.purchaseCost;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[11px] font-mono text-amber-400/90 mt-0.5">
                        {p.code} · {p.packaging}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.locationRack || 'Bay 1 Rack A'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      ${p.purchaseCost.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span className={`font-bold text-sm ${isLow ? 'text-rose-400' : 'text-slate-100'}`}>
                        {p.currentStock}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">{p.unit}s</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      {p.reorderLevel} {p.unit}s
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-200">
                      ${valuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isLow
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isLow ? 'Reorder Urgent' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-100">
                Stock Adjustment & Loss Entry
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Sika Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock} {p.unit}s)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Adjustment Type</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as MovementType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="adjustment">Cycle Count Audit Adjustment (+ / -)</option>
                  <option value="damage_loss">Forklift / Transport Damage (Loss Write-Off)</option>
                  <option value="return_in">Customer Return into Stock (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {movementType === 'damage_loss' ? 'Damaged Quantity to Deduct' : 'Quantity (+ for In, - for Out)'}
                </label>
                <input
                  type="number"
                  value={quantityDelta}
                  onChange={(e) => setQuantityDelta(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Audit Explanation / Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Expired batch discarded or forklift impact"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdjustment}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
              >
                Apply Stock Ledger Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
