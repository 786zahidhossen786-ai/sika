import React from 'react';
import {
  LayoutDashboard,
  Layers,
  ReceiptText,
  Boxes,
  Users2,
  Factory,
  Truck,
  TrendingUp,
  FileBarChart,
  FileCode2,
  AlertTriangle
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../data/translations';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentLang: Language;
  currentRole: UserRole;
  lowStockCount: number;
  pendingDeliveryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  currentLang,
  currentRole,
  lowStockCount,
  pendingDeliveryCount
}) => {
  const t = translations[currentLang];

  const menuItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'warehouse_manager', 'delivery_driver', 'accountant']
    },
    {
      id: 'products',
      label: t.products,
      icon: <Layers className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'warehouse_manager', 'accountant'],
      badge: lowStockCount > 0 ? (
        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 px-1.5 py-0.5 rounded">
          {lowStockCount}
        </span>
      ) : null
    },
    {
      id: 'sales',
      label: t.salesBilling,
      icon: <ReceiptText className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'accountant']
    },
    {
      id: 'inventory',
      label: t.inventory,
      icon: <Boxes className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'warehouse_manager', 'sales_manager'],
      badge: lowStockCount > 0 ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          {lowStockCount}
        </span>
      ) : null
    },
    {
      id: 'customers',
      label: t.customers,
      icon: <Users2 className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'accountant']
    },
    {
      id: 'suppliers',
      label: t.suppliers,
      icon: <Factory className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'warehouse_manager', 'accountant']
    },
    {
      id: 'deliveries',
      label: t.deliveries,
      icon: <Truck className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'warehouse_manager', 'delivery_driver', 'sales_manager'],
      badge: pendingDeliveryCount > 0 ? (
        <span className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
          {pendingDeliveryCount}
        </span>
      ) : null
    },
    {
      id: 'profit_loss',
      label: t.profitLoss,
      icon: <TrendingUp className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'accountant']
    },
    {
      id: 'reports',
      label: t.reports,
      icon: <FileBarChart className="w-4 h-4 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'accountant', 'warehouse_manager']
    },
    {
      id: 'app_spec',
      label: t.appSpec,
      icon: <FileCode2 className="w-4 h-4 text-amber-400 shrink-0" />,
      allowedRoles: ['admin', 'sales_manager', 'warehouse_manager', 'delivery_driver', 'accountant'],
      highlight: true
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Navigation Group */}
      <div className="p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
          Navigation
        </div>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isAllowed = item.allowedRoles.includes(currentRole);
            if (!isAllowed) return null;

            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-slate-800/80 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && <div className="shrink-0">{item.badge}</div>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Warehouse Hub Status Mini Card */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Warehouse Ops</span>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <div className="text-xs text-slate-300 font-medium">Sika Distribution Hub</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Bay 4 • Dispatch Dock #2</div>
        </div>
      </div>
    </aside>
  );
};
