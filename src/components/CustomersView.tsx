import React, { useState } from 'react';
import {
  Search,
  Plus,
  Users2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  CreditCard,
  CheckCircle2,
  History,
  X
} from 'lucide-react';
import { Customer, Invoice, PaymentRecord, Language, CustomerType } from '../types';
import { translations } from '../data/translations';

interface CustomersViewProps {
  customers: Customer[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  currentLang: Language;
  onSaveCustomer: (customer: Customer) => void;
  onRecordPayment: (payment: PaymentRecord) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  invoices,
  payments,
  currentLang,
  onSaveCustomer,
  onRecordPayment
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [ledgerCustomer, setLedgerCustomer] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Record Payment Modal State
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<any>('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState<string>('WIRE-');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleOpenPayment = (customer: Customer) => {
    setPaymentCustomer(customer);
    setPaymentAmount(customer.outstandingBalance > 0 ? customer.outstandingBalance : 500);
    setPaymentRef(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmPayment = () => {
    if (!paymentCustomer || paymentAmount <= 0) return;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${String(payments.length + 101).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customerId: paymentCustomer.id,
      customerName: paymentCustomer.name,
      invoiceId: '',
      invoiceNumber: 'ON-ACCOUNT',
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentRef,
      recordedBy: 'Finance / Accounts Lead',
      notes: `Settlement payment towards account balance`
    };

    onRecordPayment(newPayment);
    setPaymentCustomer(null);
  };

  const handleAddNewCustomer = () => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      type: 'Contractor',
      creditLimit: 20000,
      outstandingBalance: 0,
      totalPurchases: 0,
      discountRate: 5,
      paymentTermsDays: 30,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEditingCustomer(newCust);
  };

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by contractor name, firm, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'Contractor', 'Wholesaler', 'Retailer'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'All Accounts' : type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddNewCustomer}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const customerInvoices = invoices.filter((inv) => inv.customerId === cust.id);
          const creditRatio = (cust.outstandingBalance / cust.creditLimit) * 100;

          return (
            <div
              key={cust.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 hover:text-amber-400 transition-colors">
                      {cust.name}
                    </h3>
                    <div className="text-xs text-amber-400/90 font-medium">{cust.company}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {cust.type}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 my-3">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{cust.address}</span>
                  </div>
                </div>

                {/* Credit & Balance Bar */}
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Receivable Due:</span>
                    <span className={`font-bold tabular-nums ${cust.outstandingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      ${cust.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(creditRatio, 100)}%` }}
                      className={`h-full ${
                        creditRatio > 80 ? 'bg-rose-500' : creditRatio > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Credit Limit: ${cust.creditLimit.toLocaleString()}</span>
                    <span>Terms: Net {cust.paymentTermsDays}d</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setLedgerCustomer(cust)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Ledger</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPayment(cust)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Ledger Statement Modal */}
      {ledgerCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Account Ledger Statement
                </h3>
                <div className="text-xs text-amber-400 mt-0.5">
                  {ledgerCustomer.name} · {ledgerCustomer.company}
                </div>
              </div>
              <button
                onClick={() => setLedgerCustomer(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Balance Summary Header */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono">
                <div>
                  <div className="text-slate-400 text-[11px]">Total Purchases</div>
                  <div className="text-sm font-bold text-slate-100 tabular-nums">
                    ${ledgerCustomer.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Outstanding Receivable</div>
                  <div className="text-sm font-bold text-amber-400 tabular-nums">
                    ${ledgerCustomer.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Approved Limit</div>
                  <div className="text-sm font-bold text-slate-300 tabular-nums">
                    ${ledgerCustomer.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2">
                  Invoice & Settlement History
                </h4>
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Doc Ref</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">Debit (Invoice)</th>
                        <th className="py-2.5 px-3 text-right">Credit (Paid)</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {invoices
                        .filter((inv) => inv.customerId === ledgerCustomer.id)
                        .map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 text-slate-400">{inv.date}</td>
                            <td className="py-2.5 px-3 text-amber-400 font-semibold">{inv.invoiceNumber}</td>
                            <td className="py-2.5 px-3 text-slate-300">Sales Invoice</td>
                            <td className="py-2.5 px-3 text-right text-slate-100">${inv.grandTotal.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right text-emerald-400">${inv.paidAmount.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-[11px] text-slate-400">{inv.paymentStatus}</span>
                            </td>
                          </tr>
                        ))}
                      {payments
                        .filter((p) => p.customerId === ledgerCustomer.id)
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40 bg-emerald-950/10">
                            <td className="py-2.5 px-3 text-slate-400">{p.date}</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-semibold">{p.receiptNumber}</td>
                            <td className="py-2.5 px-3 text-emerald-300">Payment Received</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">-</td>
                            <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">${p.amount.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right text-slate-400">{p.method}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setLedgerCustomer(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-100">
                Record Customer Payment
              </h3>
              <button
                onClick={() => setPaymentCustomer(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                <div className="text-slate-400">Account:</div>
                <div className="font-bold text-slate-200 text-sm">{paymentCustomer.name}</div>
                <div className="text-amber-400 font-mono mt-0.5">
                  Outstanding Due: ${paymentCustomer.outstandingBalance.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="50"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Bank Transfer">Bank Wire / Transfer</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit">Credit Note Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Bank Reference / Cheque #</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setPaymentCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors font-semibold"
              >
                Confirm Payment Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-100">
                {editingCustomer.id.startsWith('cust-') && editingCustomer.name ? 'Edit Customer' : 'Add New Customer Profile'}
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Contact Name / Billing Name</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="e.g. Apex Infrastructure Group"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Registered Company Name</label>
                <input
                  type="text"
                  value={editingCustomer.company}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                  placeholder="Apex Construction LLC"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="+971 4 883 4901"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Client Type</label>
                  <select
                    value={editingCustomer.type}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, type: e.target.value as CustomerType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  >
                    <option value="Contractor">Contractor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Direct">Direct</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Site / Office Delivery Address</label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  placeholder="Plot 418, Industrial Area 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={editingCustomer.creditLimit}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, creditLimit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Baseline Discount %</label>
                  <input
                    type="number"
                    value={editingCustomer.discountRate}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, discountRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingCustomer.name) {
                    onSaveCustomer(editingCustomer);
                    setEditingCustomer(null);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
