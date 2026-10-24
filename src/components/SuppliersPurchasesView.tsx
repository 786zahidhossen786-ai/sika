import React, { useState } from 'react';
import {
  Factory,
  Search,
  Plus,
  Receipt,
  Truck,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { Supplier, PurchaseOrder, Product, Language } from '../types';
import { translations } from '../data/translations';

interface SuppliersPurchasesViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  currentLang: Language;
  onCreatePurchaseOrder: (po: PurchaseOrder) => void;
  onReceivePO: (poId: string) => void;
}

export const SuppliersPurchasesView: React.FC<SuppliersPurchasesViewProps> = ({
  suppliers,
  purchaseOrders,
  products,
  currentLang,
  onCreatePurchaseOrder,
  onReceivePO
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPOModalOpen, setIsAddPOModalOpen] = useState(false);

  // New PO State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [transportCost, setTransportCost] = useState<number>(150);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(50);
  const [unitCost, setUnitCost] = useState<number>(products[0]?.purchaseCost || 10);
  const [supplierInvoiceRef, setSupplierInvoiceRef] = useState<string>('SIKA-HUB-');

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  const totalProcured = purchaseOrders.reduce((sum, po) => sum + po.totalCost, 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);

  const handleCreatePO = () => {
    if (!selectedSupplier || quantity <= 0) return;

    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const subtotal = quantity * unitCost;
    const taxAmount = subtotal * 0.05;
    const totalCost = subtotal + taxAmount + transportCost;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${String(purchaseOrders.length + 101).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      items: [
        {
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          quantity,
          unitCost,
          lineTotal: subtotal
        }
      ],
      subtotal,
      transportCost,
      taxAmount,
      totalCost,
      status: 'In Transit',
      paymentStatus: 'Due',
      invoiceRef: supplierInvoiceRef || 'SIKA-INV-9900'
    };

    onCreatePurchaseOrder(newPO);
    setIsAddPOModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Supplier KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Total Material Purchases (YTD)
          </div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            ${totalProcured.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Procured through authorized Sika logistics channels
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Outstanding Accounts Payable
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            ${totalPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Supplier invoices due within 30 days
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Active Purchase Orders
          </div>
          <div className="text-2xl font-bold text-blue-400 tabular-nums">
            {purchaseOrders.length} <span className="text-xs text-slate-400 font-normal">orders</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {purchaseOrders.filter((po) => po.status === 'In Transit').length} shipments currently in transit
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO number or supplier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <button
          onClick={() => setIsAddPOModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Purchase Order (PO)</span>
        </button>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Procurement & Inward Shipment Log
          </h3>
          <span className="text-xs text-slate-400">
            Receiving orders automatically increments on-hand warehouse inventory
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                <th className="py-3 px-4">PO # & Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Products Ordered</th>
                <th className="py-3 px-4 text-right">Freight & Transport</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-center">Shipment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-amber-400">{po.poNumber}</span>
                    <div className="text-[11px] text-slate-500">{po.date}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{po.supplierName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Ref: {po.invoiceRef}</div>
                  </td>

                  <td className="py-3 px-4">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="text-slate-300">
                        <strong className="text-slate-100">{item.quantity}x</strong> {item.productName}
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                    ${po.transportCost.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-100">
                    ${po.totalCost.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      po.status === 'Received'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}>
                      {po.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {po.status !== 'Received' ? (
                      <button
                        onClick={() => onReceivePO(po.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded transition-colors"
                      >
                        Receive & Restock
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Stocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {isAddPOModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-100">
                Create Sika Procurement Order (PO)
              </h3>
              <button
                onClick={() => setIsAddPOModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product to Replenish</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const pId = e.target.value;
                    setSelectedProductId(pId);
                    const prod = products.find((p) => p.id === pId);
                    if (prod) setUnitCost(prod.purchaseCost);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Order Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Agreed Landed Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={unitCost}
                    onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Transport & Freight ($)</label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Supplier Invoice Ref #</label>
                  <input
                    type="text"
                    value={supplierInvoiceRef}
                    onChange={(e) => setSupplierInvoiceRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(quantity * unitCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>${(quantity * unitCost * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-400 pt-1 border-t border-slate-800">
                  <span>Grand Total PO Cost:</span>
                  <span>${(quantity * unitCost * 1.05 + transportCost).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsAddPOModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePO}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
              >
                Issue Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
