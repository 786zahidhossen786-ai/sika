import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Filter,
  Check,
  Building,
  Boxes,
  Truck,
  TrendingUp
} from 'lucide-react';
import { Invoice, Product, Customer, Delivery, Language } from '../types';
import { translations } from '../data/translations';

interface ReportsViewProps {
  invoices: Invoice[];
  products: Product[];
  customers: Customer[];
  deliveries: Delivery[];
  currentLang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  products,
  customers,
  deliveries,
  currentLang
}) => {
  const t = translations[currentLang];
  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'inventory' | 'customers' | 'deliveries'>('sales');

  // CSV Export utility
  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = 'sika_report.csv';

    if (activeReportTab === 'sales') {
      fileName = `sika_sales_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Invoice Number,Date,Customer,Subtotal,Discount,Tax,Delivery,Grand Total,Payment Status,Delivery Status\n';
      invoices.forEach((inv) => {
        csvContent += `"${inv.invoiceNumber}","${inv.date}","${inv.customerName}",${inv.subtotal},${inv.totalDiscount},${inv.taxAmount},${inv.deliveryCharge},${inv.grandTotal},"${inv.paymentStatus}","${inv.deliveryStatus}"\n`;
      });
    } else if (activeReportTab === 'inventory') {
      fileName = `sika_inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'SKU,Product Name,Category,Unit,Current Stock,Reorder Level,Unit Cost,Selling Price,Inventory Valuation\n';
      products.forEach((p) => {
        csvContent += `"${p.code}","${p.name}","${p.category}","${p.unit}",${p.currentStock},${p.reorderLevel},${p.purchaseCost},${p.sellingPrice},${p.currentStock * p.purchaseCost}\n`;
      });
    } else if (activeReportTab === 'customers') {
      fileName = `sika_customers_ledger_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Customer,Company,Type,Phone,Credit Limit,Outstanding Balance,Total Purchases,Terms (Days)\n';
      customers.forEach((c) => {
        csvContent += `"${c.name}","${c.company}","${c.type}","${c.phone}",${c.creditLimit},${c.outstandingBalance},${c.totalPurchases},${c.paymentTermsDays}\n`;
      });
    } else {
      fileName = `sika_deliveries_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Delivery #,Invoice #,Customer,Address,Driver,Truck,Status,Delivery Fee,Weight Kg\n';
      deliveries.forEach((d) => {
        csvContent += `"${d.deliveryNumber}","${d.invoiceNumber}","${d.customerName}","${d.customerAddress}","${d.driverName}","${d.truckNumber}","${d.status}",${d.deliveryCharge},${d.weightKg}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveReportTab('sales')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeReportTab === 'sales'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sales & Invoicing Report
          </button>
          <button
            onClick={() => setActiveReportTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeReportTab === 'inventory'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inventory Valuation
          </button>
          <button
            onClick={() => setActiveReportTab('customers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeReportTab === 'customers'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer Receivables
          </button>
          <button
            onClick={() => setActiveReportTab('deliveries')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeReportTab === 'deliveries'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Logistics & Delivery
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Active Report (.CSV)</span>
        </button>
      </div>

      {/* Report Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {activeReportTab === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">Discount</th>
                  <th className="py-3 px-4 text-right">VAT</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-right">Margin $</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-amber-400">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                    <td className="py-3 px-4 font-sans text-slate-200 font-medium">{inv.customerName}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">${inv.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-400">-${inv.totalDiscount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">${inv.taxAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-100">${inv.grandTotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-400">+${inv.netProfit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-sans font-medium text-slate-300">{inv.paymentStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReportTab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Holding Value</th>
                  <th className="py-3 px-4 text-center">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {products.map((p) => {
                  const val = p.currentStock * p.purchaseCost;
                  const isLow = p.currentStock <= p.reorderLevel;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-amber-400">{p.code}</td>
                      <td className="py-3 px-4 font-sans text-slate-200 font-medium">{p.name}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">{p.category}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-100">
                        {p.currentStock} {p.unit}s
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-400">${p.purchaseCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-300">${p.sellingPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-400">${val.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[11px] font-sans ${isLow ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                          {isLow ? 'Reorder Needed' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeReportTab === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Contractor / Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4 text-right">Credit Limit</th>
                  <th className="py-3 px-4 text-right">Outstanding Due</th>
                  <th className="py-3 px-4 text-right">Total Purchases</th>
                  <th className="py-3 px-4 text-center">Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-200">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.company}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">{c.type}</td>
                    <td className="py-3 px-4 text-slate-400">{c.phone}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">${c.creditLimit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-amber-400">${c.outstandingBalance.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-100">${c.totalPurchases.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-sans text-slate-400">Net {c.paymentTermsDays}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReportTab === 'deliveries' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Manifest #</th>
                  <th className="py-3 px-4">Invoice Ref</th>
                  <th className="py-3 px-4">Destination Contractor</th>
                  <th className="py-3 px-4">Assigned Fleet</th>
                  <th className="py-3 px-4 text-right">Cargo Weight</th>
                  <th className="py-3 px-4 text-right">Freight Fee</th>
                  <th className="py-3 px-4 text-center">Trip Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-amber-400">{d.deliveryNumber}</td>
                    <td className="py-3 px-4 text-slate-300">{d.invoiceNumber}</td>
                    <td className="py-3 px-4 font-sans text-slate-200 font-medium">{d.customerName}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{d.truckNumber} ({d.driverName})</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">{d.weightKg} kg</td>
                    <td className="py-3 px-4 text-right tabular-nums text-amber-400">${d.deliveryCharge.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="text-[11px] font-semibold text-slate-200">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
