import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import { Invoice, Language } from '../types';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  currentLang: Language;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  onClose
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Controls (Not printed) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-slate-400">
              Tax Invoice Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 font-sans print-container text-xs">
          {/* Header Strip */}
          <div className="flex items-start justify-between border-b-2 border-amber-500 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center text-slate-950 font-black text-lg tracking-tighter shadow-sm">
                SIKA
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-slate-950 uppercase">
                  Sika MaterialOps Distribution
                </h1>
                <p className="text-[11px] text-slate-600">
                  Authorized Sika Construction Materials Hub
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  TRN / VAT: 100-3849-2918-0003 · Bay 4, Industrial Area 3
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black tracking-wider uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Commercial Tax Invoice
              </span>
              <div className="text-sm font-mono font-black text-slate-950 mt-1">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Issue Date: <strong className="font-mono text-slate-900">{invoice.date}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Payment Due: <strong className="font-mono text-slate-900">{invoice.dueDate}</strong>
              </div>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-6 p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Billed To (Contractor)
              </span>
              <div className="text-xs font-bold text-slate-950">{invoice.customerName}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{invoice.customerAddress}</div>
              <div className="text-[11px] text-slate-600">Phone: {invoice.customerPhone}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Payment & Logistics
              </span>
              <div className="text-xs text-slate-800">
                Terms: <span className="font-semibold text-slate-950">{invoice.paymentMethod}</span> ({invoice.paymentStatus})
              </div>
              <div className="text-xs text-slate-800 mt-0.5">
                Dispatch: <span className="font-semibold text-slate-950">{invoice.deliveryStatus}</span>
              </div>
              <div className="text-xs text-slate-800 mt-0.5">
                Sales Exec: <span className="font-semibold text-slate-950">{invoice.salesPerson}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100 font-bold text-slate-800">
                <th className="py-2 px-3">Item / SKU</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-right">Qty</th>
                <th className="py-2 px-3 text-right">Unit Price</th>
                <th className="py-2 px-3 text-right">Disc %</th>
                <th className="py-2 px-3 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 font-mono">{item.productCode}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-slate-950">{item.productName}</div>
                    <div className="text-[10px] text-slate-500">{item.packaging}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-950">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-rose-600">
                    {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-950">
                    ${item.lineTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Bottom Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-semibold text-slate-900">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                <span>Contract Discount:</span>
                <span>-${invoice.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">VAT (5%):</span>
                <span className="font-semibold text-slate-900">${invoice.taxAmount.toFixed(2)}</span>
              </div>
              {invoice.deliveryCharge > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Freight Transport:</span>
                  <span className="font-semibold text-slate-900">${invoice.deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 text-sm font-black border-b-2 border-slate-950 text-slate-950">
                <span>Total Due:</span>
                <span className="text-amber-600">${invoice.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Paid to Date:</span>
                <span className="text-emerald-600 font-semibold">${invoice.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 rounded">
                <span>Outstanding Balance:</span>
                <span>${invoice.outstandingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Wire Bank Info & Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Bank Remittance Details
              </span>
              <p className="text-[11px] text-slate-700 font-mono">
                Bank: Emirates NBD Commercial Banking<br />
                Account Title: Sika MaterialOps Distribution LLC<br />
                IBAN: AE0702600003194829104<br />
                Swift Code: ENBD-AE-DXB
              </p>
            </div>

            <div className="flex items-end justify-between gap-4 text-center">
              <div className="flex-1">
                <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                  {invoice.salesPerson}
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Authorized Signature</span>
              </div>

              <div className="flex-1">
                <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                  Signature & Site Stamp
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Receiver Acknowledgment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
