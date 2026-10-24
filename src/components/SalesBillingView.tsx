import React, { useState } from 'react';
import {
  Search,
  Plus,
  Receipt,
  Printer,
  FileText,
  DollarSign,
  Trash2,
  AlertCircle,
  Truck,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  Invoice,
  InvoiceItem,
  Product,
  Customer,
  Language,
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus
} from '../types';
import { translations } from '../data/translations';

interface SalesBillingViewProps {
  invoices: Invoice[];
  products: Product[];
  customers: Customer[];
  currentLang: Language;
  onCreateInvoice: (invoice: Invoice) => void;
  onPrintInvoice: (invoice: Invoice) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const SalesBillingView: React.FC<SalesBillingViewProps> = ({
  invoices,
  products,
  customers,
  currentLang,
  onCreateInvoice,
  onPrintInvoice,
  isCreateModalOpen,
  setIsCreateModalOpen
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Invoice Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Credit');
  const [paidAmountInput, setPaidAmountInput] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [notes, setNotes] = useState<string>('');
  const [assignDelivery, setAssignDelivery] = useState<boolean>(true);

  // Line items state
  const [items, setItems] = useState<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
  }[]>([
    {
      productId: products[0]?.id || '',
      quantity: 10,
      unitPrice: products[0]?.sellingPrice || 10,
      discountPercent: 5
    }
  ]);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Add line item
  const handleAddLine = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;
    setItems([
      ...items,
      {
        productId: defaultProd.id,
        quantity: 5,
        unitPrice: defaultProd.sellingPrice,
        discountPercent: selectedCustomer ? selectedCustomer.discountRate : 0
      }
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Calculations
  const calculatedItems: InvoiceItem[] = items.map((item) => {
    const prod = products.find((p) => p.id === item.productId) || products[0];
    const discountedPrice = item.unitPrice * (1 - item.discountPercent / 100);
    const lineTotal = discountedPrice * item.quantity;
    const lineCost = prod.purchaseCost * item.quantity;
    const lineProfit = lineTotal - lineCost;

    return {
      productId: prod.id,
      productCode: prod.code,
      productName: prod.name,
      packaging: prod.packaging,
      quantity: item.quantity,
      unitCost: prod.purchaseCost,
      unitPrice: item.unitPrice,
      discountPercent: item.discountPercent,
      taxPercent: 5,
      lineTotal,
      lineProfit
    };
  });

  const subtotal = calculatedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalLineCalculated = calculatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalDiscount = subtotal - totalLineCalculated;
  const taxAmount = totalLineCalculated * 0.05;
  const grandTotal = totalLineCalculated + taxAmount + (assignDelivery ? deliveryCharge : 0);
  const totalCost = calculatedItems.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
  const netProfit = totalLineCalculated - totalCost + (assignDelivery ? deliveryCharge * 0.2 : 0);

  const effectivePaid = paymentStatus === 'Paid' ? grandTotal : paymentStatus === 'Partial' ? paidAmountInput : 0;
  const outstandingAmount = grandTotal - effectivePaid;

  const handleSubmitInvoice = () => {
    if (!selectedCustomer || calculatedItems.length === 0) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 101).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + (selectedCustomer.paymentTermsDays || 30) * 86400000).toISOString().split('T')[0],
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      items: calculatedItems,
      subtotal,
      totalDiscount,
      taxAmount,
      deliveryCharge: assignDelivery ? deliveryCharge : 0,
      grandTotal,
      totalCost,
      netProfit,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      paidAmount: effectivePaid,
      outstandingAmount,
      deliveryStatus: assignDelivery ? 'Pending' : 'Delivered',
      notes,
      salesPerson: 'Zahid Hossain (Lead)'
    };

    onCreateInvoice(newInvoice);
    setIsCreateModalOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice number, client contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'Paid', 'Partial', 'Credit'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t.newInvoice}</span>
        </button>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Contractor / Customer</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Payment Status</th>
                <th className="py-3 px-4 text-center">Delivery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-amber-400">{inv.invoiceNumber}</span>
                    <div className="text-[11px] text-slate-500">{inv.date}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{inv.customerAddress}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium">
                      {inv.items.length} Sika products
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                      {inv.items.map((i) => `${i.quantity}x ${i.productName.split(' ')[0]}`).join(', ')}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                    ${inv.subtotal.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-100">
                    ${inv.grandTotal.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <span className={inv.outstandingAmount > 0 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                      ${inv.outstandingAmount.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      inv.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : inv.paymentStatus === 'Partial'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {inv.deliveryStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onPrintInvoice(inv)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                      title="Print Official Invoice / PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Modal: Create Sales Invoice / POS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Create New Sika Commercial Invoice
                  </h3>
                  <div className="text-xs text-slate-400">
                    Auto inventory deduction and customer ledger sync
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer Selector & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contractor / Customer</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedCustomerId(id);
                      const c = customers.find((cust) => cust.id === id);
                      if (c) {
                        setItems(
                          items.map((i) => ({ ...i, discountPercent: c.discountRate }))
                        );
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Credit Standing</label>
                  <div className="py-2 text-slate-300">
                    {selectedCustomer ? (
                      <span className="tabular-nums">
                        Balance: <strong className="text-amber-400">${selectedCustomer.outstandingBalance.toFixed(2)}</strong> / Limit: ${selectedCustomer.creditLimit.toFixed(2)}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Payment Terms</label>
                  <div className="py-2 text-slate-300">
                    Net {selectedCustomer?.paymentTermsDays || 30} Days • Baseline Discount {selectedCustomer?.discountRate}%
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Invoice Items & Quantities
                  </h4>
                  <button
                    onClick={handleAddLine}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded border border-amber-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3 w-24">Qty</th>
                        <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 w-24 text-right">Disc %</th>
                        <th className="py-2.5 px-3 w-32 text-right">Total</th>
                        <th className="py-2.5 px-3 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {items.map((line, idx) => {
                        const prod = products.find((p) => p.id === line.productId) || products[0];
                        const lineNet = line.unitPrice * (1 - line.discountPercent / 100) * line.quantity;

                        return (
                          <tr key={idx} className="bg-slate-900/60">
                            {/* Product selection */}
                            <td className="py-2.5 px-3">
                              <select
                                value={line.productId}
                                onChange={(e) => {
                                  const pId = e.target.value;
                                  const chosen = products.find((p) => p.id === pId);
                                  const newItems = [...items];
                                  newItems[idx] = {
                                    ...newItems[idx],
                                    productId: pId,
                                    unitPrice: chosen ? chosen.sellingPrice : 10
                                  };
                                  setItems(newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
                              >
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} (Stock: {p.currentStock})
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Quantity */}
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min="1"
                                value={line.quantity}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 1;
                                  const newItems = [...items];
                                  newItems[idx].quantity = qty;
                                  setItems(newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200 font-mono text-center"
                              />
                            </td>

                            {/* Unit Price */}
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="0.5"
                                value={line.unitPrice}
                                onChange={(e) => {
                                  const price = parseFloat(e.target.value) || 0;
                                  const newItems = [...items];
                                  newItems[idx].unitPrice = price;
                                  setItems(newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200 font-mono text-right"
                              />
                            </td>

                            {/* Discount % */}
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={line.discountPercent}
                                onChange={(e) => {
                                  const disc = parseFloat(e.target.value) || 0;
                                  const newItems = [...items];
                                  newItems[idx].discountPercent = disc;
                                  setItems(newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200 font-mono text-right"
                              />
                            </td>

                            {/* Line Total */}
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-100 tabular-nums">
                              ${lineNet.toFixed(2)}
                            </td>

                            {/* Delete line */}
                            <td className="py-2.5 px-3 text-center">
                              {items.length > 1 && (
                                <button
                                  onClick={() => handleRemoveLine(idx)}
                                  className="text-slate-500 hover:text-rose-400 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delivery and Payment Mode Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-400" />
                      Assign Site Logistics Dispatch
                    </span>
                    <input
                      type="checkbox"
                      checked={assignDelivery}
                      onChange={(e) => setAssignDelivery(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  {assignDelivery && (
                    <div>
                      <label className="block text-slate-400 mb-1">Delivery Freight Fee ($)</label>
                      <input
                        type="number"
                        value={deliveryCharge}
                        onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-400 mb-1">Invoice Notes / Site Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. Basement slab casting phase 2"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200"
                    />
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                      >
                        <option value="Credit">Credit / Account</option>
                        <option value="Cash">Cash on Delivery</option>
                        <option value="Bank Transfer">Bank Wire</option>
                        <option value="Cheque">PDC Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Payment Status</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                      >
                        <option value="Credit">Full Credit</option>
                        <option value="Paid">Immediate Full Payment</option>
                        <option value="Partial">Partial Advance</option>
                      </select>
                    </div>
                  </div>

                  {paymentStatus === 'Partial' && (
                    <div>
                      <label className="block text-slate-400 mb-1">Collected Advance ($)</label>
                      <input
                        type="number"
                        value={paidAmountInput}
                        onChange={(e) => setPaidAmountInput(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  {/* Bill Summary Strip */}
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Discounts:</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (5%):</span>
                      <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
                    </div>
                    {assignDelivery && (
                      <div className="flex justify-between">
                        <span>Delivery Freight:</span>
                        <span className="text-slate-200">${deliveryCharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-100 pt-1 border-t border-slate-800">
                      <span>Grand Total:</span>
                      <span className="text-amber-400">${grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-400 pt-0.5">
                      <span>Projected Net Margin:</span>
                      <span>+${netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
              <div className="text-xs text-slate-400 font-mono">
                Total Products: <span className="text-slate-200 font-semibold">{calculatedItems.length} lines</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitInvoice}
                  className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-sm shadow-amber-500/20"
                >
                  Generate & Confirm Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
