import React, { useState } from 'react';
import {
  FileCode2,
  Database,
  Copy,
  Check,
  Server,
  Key,
  Layers,
  ArrowRight,
  Shield,
  Table as TableIcon
} from 'lucide-react';
import { databaseSchemaTables, postgresDDL } from '../data/appSpecification';
import { Language } from '../types';
import { translations } from '../data/translations';

interface AppSpecViewProps {
  currentLang: Language;
}

export const AppSpecView: React.FC<AppSpecViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [selectedTable, setSelectedTable] = useState(databaseSchemaTables[0].name);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'schema' | 'ddl' | 'architecture' | 'api'>('schema');

  const currentTable = databaseSchemaTables.find((t) => t.name === selectedTable) || databaseSchemaTables[0];

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(postgresDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Specification Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              System Blueprint & Technical Specification
            </span>
            <span className="text-[10px] text-slate-500 font-mono">v1.2.0-STABLE</span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">
            Sika Construction Materials ERP Architecture & Database Schema
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Minimalist relational architecture with strict foreign key constraints, FIFO landed cost tracking, and role-based operational permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyDDL}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Copied DDL' : 'Copy PostgreSQL DDL'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'schema'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Interactive Database Schema</span>
        </button>

        <button
          onClick={() => setActiveTab('ddl')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'ddl'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Production SQL DDL Script</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'architecture'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ERD & Business Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'api'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>API Endpoints Spec</span>
        </button>
      </div>

      {/* Tab Content 1: Interactive Database Schema */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Selector */}
          <div className="lg:col-span-1 space-y-1 bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1 mb-1">
              Database Tables ({databaseSchemaTables.length})
            </div>
            {databaseSchemaTables.map((tbl) => (
              <button
                key={tbl.name}
                onClick={() => setSelectedTable(tbl.name)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded-lg transition-colors text-left ${
                  selectedTable === tbl.name
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>public.{tbl.name}</span>
                <span className="text-[10px] text-slate-500 font-sans">{tbl.columns.length} cols</span>
              </button>
            ))}
          </div>

          {/* Table Detail */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-mono font-bold text-slate-100">
                    public.{currentTable.name}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-sans">
                  {currentTable.description}
                </span>
              </div>

              {/* Columns Table */}
              <div className="border border-slate-800 rounded-lg overflow-hidden mt-4">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold font-sans">
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3">Constraints</th>
                      <th className="py-2.5 px-3 font-sans">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {currentTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-1.5">
                          {col.primaryKey && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                          <span>{col.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-amber-400/90">{col.type}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">
                          {col.primaryKey ? (
                            <span className="text-amber-400 font-semibold">PRIMARY KEY</span>
                          ) : col.references ? (
                            <span className="text-blue-400 font-semibold">FK → {col.references}</span>
                          ) : col.nullable ? (
                            'NULL'
                          ) : (
                            'NOT NULL'
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px]">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Performance Indexes
                </div>
                <div className="space-y-1">
                  {currentTable.indexes.map((idx, i) => (
                    <div key={i} className="text-xs font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      {idx}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Raw SQL DDL Script */}
      {activeTab === 'ddl' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                PostgreSQL 15+ Compatible DDL Script
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to execute directly in Cloud SQL, Supabase, Neon, or self-hosted PostgreSQL.
              </p>
            </div>
            <button
              onClick={handleCopyDDL}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full SQL</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-amber-200/90 overflow-x-auto max-h-[500px]">
            {postgresDDL}
          </pre>
        </div>
      )}

      {/* Tab Content 3: ERD & Business Rules */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
                <Shield className="w-4 h-4" />
                <span>FIFO Inventory & Margin Shield</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When generating sales invoices, the system snapshots the current <code className="text-amber-400 font-mono">purchase_cost</code> directly into <code className="text-amber-400 font-mono">invoice_items.unit_cost</code>. This locks in historical gross profit regardless of future material price fluctuations.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-2">
                <Shield className="w-4 h-4" />
                <span>Credit Exposure Safeguard</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Customers possess a contractual <code className="text-blue-400 font-mono">credit_limit</code> and running <code className="text-blue-400 font-mono">outstanding_balance</code>. If unpaid balance + new invoice exceeds limit, the POS warns the sales manager for approval.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
                <Shield className="w-4 h-4" />
                <span>Automated Stock Movement Audit</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every sale, PO receipt, damage scrap, or count adjustment writes an immutable record into <code className="text-emerald-400 font-mono">stock_movements</code> with previous stock, delta, new stock, and document references.
              </p>
            </div>
          </div>

          {/* Visual Relational Mapping */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-4">
              Core Entity Relational Map (ERD)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="font-mono text-amber-400 font-semibold">customers (1)</span>
                <span className="text-slate-500 font-mono">── [1:N] ──</span>
                <span className="font-mono text-slate-200">invoices (N)</span>
                <span className="text-slate-400 text-[11px]">One customer receives multiple sales invoices</span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="font-mono text-amber-400 font-semibold">invoices (1)</span>
                <span className="text-slate-500 font-mono">── [1:N] ──</span>
                <span className="font-mono text-slate-200">invoice_items (N)</span>
                <span className="text-slate-400 text-[11px]">Each bill contains multi-product line items</span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="font-mono text-amber-400 font-semibold">products (1)</span>
                <span className="text-slate-500 font-mono">── [1:N] ──</span>
                <span className="font-mono text-slate-200">stock_movements (N)</span>
                <span className="text-slate-400 text-[11px]">Real-time tracking of in/out/loss adjustments</span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="font-mono text-amber-400 font-semibold">invoices (1)</span>
                <span className="text-slate-500 font-mono">── [1:1] ──</span>
                <span className="font-mono text-slate-200">deliveries (1)</span>
                <span className="text-slate-400 text-[11px]">Optional site logistics dispatch manifest</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: API Endpoints Specification */}
      {activeTab === 'api' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              REST / RPC API Endpoints Contract
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contract for backend integration (Express / Cloud Functions / Next.js API)
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">GET</span>
                <span className="text-slate-200 font-bold">/api/products</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                Returns Sika catalog with on-hand stock and reorder flags. Query: <code className="text-amber-400">?low_stock=true&category=Waterproofing</code>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded">POST</span>
                <span className="text-slate-200 font-bold">/api/invoices</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                Creates new sales bill, automatically decrements product stock, logs stock movement, and adds to customer accounts receivable.
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded">POST</span>
                <span className="text-slate-200 font-bold">/api/customers/:id/payments</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                Records bank transfer or cash collection, writes to customer ledger, and reconciles invoice outstanding balance.
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 font-bold rounded">PATCH</span>
                <span className="text-slate-200 font-bold">/api/deliveries/:id/status</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                Updates fleet dispatch progression (Pending → Loaded → Out for Delivery → Delivered).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
