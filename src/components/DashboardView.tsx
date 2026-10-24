import React from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Truck,
  Boxes,
  Users,
  ArrowUpRight,
  Receipt,
  Clock,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Product, Customer, Invoice, Delivery, Language } from '../types';
import { translations } from '../data/translations';

interface DashboardViewProps {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  deliveries: Delivery[];
  currentLang: Language;
  onNavigate: (view: string) => void;
  onSelectProductForReorder: (product: Product) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  customers,
  invoices,
  deliveries,
  currentLang,
  onNavigate,
  onSelectProductForReorder
}) => {
  const t = translations[currentLang];

  // Aggregated KPIs
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCost = invoices.reduce((sum, inv) => sum + inv.totalCost, 0);
  const netProfit = invoices.reduce((sum, inv) => sum + inv.netProfit, 0);
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const pendingDeliveries = deliveries.filter(
    (d) => d.status === 'Pending' || d.status === 'Loaded' || d.status === 'Out for Delivery'
  ).length;

  const lowStockProducts = products.filter((p) => p.currentStock <= p.reorderLevel);

  // Top products by volume
  const productSalesMap: Record<string, { product: Product; qty: number; revenue: number }> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          productSalesMap[item.productId] = { product: prod, qty: 0, revenue: 0 };
        }
      }
      if (productSalesMap[item.productId]) {
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += item.lineTotal;
      }
    });
  });

  const bestSellingProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  // Top customers by balance / volume
  const topCustomers = [...customers]
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 4);

  // 7-day revenue trend simulation
  const chartDays = [
    { day: 'Mon', revenue: 2840, cost: 1820 },
    { day: 'Tue', revenue: 4190, cost: 2650 },
    { day: 'Wed', revenue: 3260, cost: 2100 },
    { day: 'Thu', revenue: 5820, cost: 3700 },
    { day: 'Fri', revenue: 4910, cost: 3120 },
    { day: 'Sat', revenue: 6450, cost: 4100 },
    { day: 'Sun (Today)', revenue: 3150, cost: 2024 },
  ];
  const maxDayVal = Math.max(...chartDays.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Low Stock Alert Strip if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-rose-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-rose-100">
                {lowStockProducts.length} Sika items reached critical threshold
              </div>
              <div className="text-[11px] text-rose-300/80 truncate">
                {lowStockProducts.map((p) => `${p.name} (${p.currentStock})`).join(' · ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shrink-0 text-center"
          >
            Review Stock & Reorder
          </button>
        </div>
      )}

      {/* Main KPI Quad + Secondary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.totalSales}</span>
            <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 tabular-nums">
              ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Net Realized Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.netProfit}</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Gross margin: <span className="text-slate-200 tabular-nums font-semibold">{profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Receivables / Outstanding Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.outstandingBalance}</span>
            <div className="w-7 h-7 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-300 tabular-nums">
              ${totalReceivables.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Across <span className="text-slate-200 font-semibold">{customers.filter(c => c.outstandingBalance > 0).length}</span> contractor accounts
            </div>
          </div>
        </div>

        {/* Metric 4: Logistics & Dispatches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t.pendingDeliveries}</span>
            <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 tabular-nums">
              {pendingDeliveries} <span className="text-xs font-normal text-slate-400">active trips</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-400 font-medium mt-1">
              <Clock className="w-3 h-3" />
              <span>2 trucks en route, 1 loading</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Revenue Chart & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Revenue vs Cost Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Weekly Revenue & Landed Cost Trend
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Real-time invoiced revenue compared to procurement cost
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
                <span>COGS</span>
              </div>
            </div>
          </div>

          {/* Minimalist Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
            {chartDays.map((item, idx) => {
              const revHeight = (item.revenue / maxDayVal) * 100;
              const costHeight = (item.cost / maxDayVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] text-slate-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.revenue}
                  </div>
                  <div className="w-full max-w-[38px] flex items-end gap-1 h-full justify-center">
                    <div
                      style={{ height: `${costHeight}%` }}
                      className="w-1/2 bg-slate-700 rounded-t-sm transition-all duration-300 group-hover:bg-slate-600"
                      title={`COGS: $${item.cost}`}
                    />
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/2 bg-amber-500 rounded-t-sm transition-all duration-300 group-hover:bg-amber-400"
                      title={`Revenue: $${item.revenue}`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium truncate">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-1">
            <span>Average Order Margin: <strong className="text-emerald-400 font-semibold tabular-nums">34.8%</strong></span>
            <span>Total Week Invoiced: <strong className="text-slate-200 font-semibold tabular-nums">$30,620.00</strong></span>
          </div>
        </div>

        {/* Right Column: Top Best Sellers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">
              {t.bestSellers}
            </h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {bestSellingProducts.map((item, i) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.product.category}</span>
                    <span>·</span>
                    <span>Stock: {item.product.currentStock} {item.product.unit}s</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-amber-400 tabular-nums">
                    {item.qty} units
                  </div>
                  <div className="text-[10px] text-slate-400 tabular-nums">
                    ${item.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Catalog Active SKUs</span>
            <span className="font-semibold text-slate-200 tabular-nums">{products.length} Products</span>
          </div>
        </div>
      </div>

      {/* Lower Row: High Volume Contractors & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contractors & Credit Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {t.topCustomers}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Contractors with active credit and order volume
              </div>
            </div>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
            >
              <span>Ledgers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topCustomers.map((cust) => {
              const creditRatio = (cust.outstandingBalance / cust.creditLimit) * 100;
              return (
                <div
                  key={cust.id}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {cust.name}
                      </span>
                      <span className="text-[10px] text-slate-400">({cust.type})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {cust.phone} · Terms: Net {cust.paymentTermsDays}d
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-200 tabular-nums">
                      ${cust.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 tabular-nums mt-0.5">
                      Limit: ${cust.creditLimit.toLocaleString()} ({creditRatio.toFixed(0)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices & Dispatch State */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {t.recentInvoices}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Latest sales bills and settlement status
              </div>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
            >
              <span>All Invoices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {invoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-amber-400">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-slate-300 truncate">
                      {inv.customerName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{inv.date}</span>
                    <span>·</span>
                    <span>{inv.items.length} items</span>
                    <span>·</span>
                    <span className={
                      inv.paymentStatus === 'Paid' ? 'text-emerald-400' :
                      inv.paymentStatus === 'Partial' ? 'text-amber-400' : 'text-rose-400'
                    }>
                      {inv.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-100 tabular-nums">
                    ${inv.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Margin: ${inv.netProfit.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
