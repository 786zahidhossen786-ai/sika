import React from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { Invoice, Product, ExpenseRecord, Language } from '../types';
import { translations } from '../data/translations';

interface ProfitLossViewProps {
  invoices: Invoice[];
  products: Product[];
  expenses: ExpenseRecord[];
  currentLang: Language;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({
  invoices,
  products,
  expenses,
  currentLang
}) => {
  const t = translations[currentLang];

  // Financial aggregates
  const totalGrossRevenue = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalDiscountsAllowed = invoices.reduce((sum, inv) => sum + inv.totalDiscount, 0);
  const netInvoicedSales = totalGrossRevenue - totalDiscountsAllowed;
  const totalCOGS = invoices.reduce((sum, inv) => sum + inv.totalCost, 0);
  const grossProfit = netInvoicedSales - totalCOGS;
  const grossMarginPct = netInvoicedSales > 0 ? (grossProfit / netInvoicedSales) * 100 : 0;

  const totalDeliveryRevenue = invoices.reduce((sum, inv) => sum + inv.deliveryCharge, 0);
  const totalOperatingExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netOperatingProfit = grossProfit + totalDeliveryRevenue - totalOperatingExpenses;
  const netMarginPct = netInvoicedSales > 0 ? (netOperatingProfit / netInvoicedSales) * 100 : 0;

  // Product-wise profit calculation
  const productProfitMap: Record<string, { product: Product; quantitySold: number; revenue: number; cogs: number; profit: number }> = {};

  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (!productProfitMap[item.productId]) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          productProfitMap[item.productId] = {
            product: prod,
            quantitySold: 0,
            revenue: 0,
            cogs: 0,
            profit: 0
          };
        }
      }
      if (productProfitMap[item.productId]) {
        productProfitMap[item.productId].quantitySold += item.quantity;
        productProfitMap[item.productId].revenue += item.lineTotal;
        productProfitMap[item.productId].cogs += item.unitCost * item.quantity;
        productProfitMap[item.productId].profit += item.lineProfit;
      }
    });
  });

  const sortedProductProfit = Object.values(productProfitMap).sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6">
      {/* P&L Executive Statement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Net Invoiced Revenue</div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            ${netInvoicedSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            After -${totalDiscountsAllowed.toFixed(2)} in trade discounts
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Cost of Goods Sold (COGS)</div>
          <div className="text-2xl font-bold text-slate-300 tabular-nums">
            ${totalCOGS.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Procurement landed material value
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Gross Trading Profit</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            ${grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Gross Margin: <strong className="font-semibold">{grossMarginPct.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Net Realized Profit</div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            ${netOperatingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            After OPEX (${totalOperatingExpenses.toFixed(2)}) & fleet revenue
          </div>
        </div>
      </div>

      {/* Financial Statement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ledger Breakdown Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-100 mb-4">
            Income & Expenditure Breakdown
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-300">
              <span>Gross Product Sales</span>
              <span className="font-semibold text-slate-100 tabular-nums">${totalGrossRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-rose-400">
              <span>Less: Contractor Trade Discounts</span>
              <span className="tabular-nums">-${totalDiscountsAllowed.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-200 font-semibold">
              <span>Net Invoiced Sales</span>
              <span className="tabular-nums">${netInvoicedSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-slate-400">
              <span>Less: Direct Material Cost (COGS)</span>
              <span className="tabular-nums">-${totalCOGS.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-emerald-400 font-bold">
              <span>Gross Operating Margin</span>
              <span className="tabular-nums">${grossProfit.toFixed(2)} ({grossMarginPct.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-blue-400">
              <span>Plus: Billed Freight / Delivery Charges</span>
              <span className="tabular-nums">+${totalDeliveryRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-rose-400">
              <span>Less: Fixed Operating Overheads (OPEX)</span>
              <span className="tabular-nums">-${totalOperatingExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold text-amber-400 bg-amber-500/10 px-3 rounded-lg">
              <span>Net Business Profit</span>
              <span className="tabular-nums">${netOperatingProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Operating Expenses Detail */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100">
              Operating Overheads & Fleet Expenses
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total: ${totalOperatingExpenses.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2.5">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{exp.category}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{exp.description}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{exp.date} · {exp.paidVia}</div>
                </div>
                <div className="text-right font-mono font-bold text-rose-400 tabular-nums">
                  ${exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product-Wise Profit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Product-Wise Profit Contribution
          </h3>
          <div className="text-xs text-slate-400 mt-0.5">
            Unit sales, direct cost allocation, and net realized dollar margin per Sika SKU
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                <th className="py-3 px-4">Product SKU & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Qty Billed</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Total COGS</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
                <th className="py-3 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {sortedProductProfit.map((item) => {
                const margin = item.revenue > 0 ? (item.profit / item.revenue) * 100 : 0;
                return (
                  <tr key={item.product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                      {item.product.name}
                      <div className="font-mono text-[11px] text-amber-400">{item.product.code}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">
                      {item.product.category}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                      {item.quantitySold} {item.product.unit}s
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                      ${item.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                      ${item.cogs.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-400">
                      +${item.profit.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span className={`font-semibold ${margin > 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
