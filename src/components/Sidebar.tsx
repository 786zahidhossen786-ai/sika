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
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BadgePercent,
  Package,
  Building2
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations, isRTL } from '../data/translations';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentLang: Language;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lowStockCount: number;
  pendingDeliveryCount: number;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  currentLang,
  currentRole,
  onRoleChange,
  lowStockCount,
  pendingDeliveryCount,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const t = translations[currentLang];
  const rtl = isRTL(currentLang);

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
          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
          <span>{lowStockCount}</span>
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

  const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'admin', label: t.roleAdmin, icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'sales_manager', label: t.roleSales, icon: <BadgePercent className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'warehouse_manager', label: t.roleWarehouse, icon: <Package className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'delivery_driver', label: t.roleDriver, icon: <Truck className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'accountant', label: t.roleAccountant, icon: <Building2 className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  const handleMenuClick = (id: string) => {
    onViewChange(id);
    onCloseMobile();
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MOBILE OVERLAY DRAWER (< md)                                */}
      {/* ============================================================== */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out Drawer */}
          <div
            className={`relative w-72 max-w-[85vw] bg-slate-900 border-slate-800 flex flex-col h-full shadow-2xl z-10 ${
              rtl ? 'border-l mr-auto' : 'border-r ml-0'
            }`}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-slate-950 font-black text-xs">
                  SIKA
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-100 block">MaterialOps</span>
                  <span className="text-[10px] text-amber-400">Navigation Menu</span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Role Switcher */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/50">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Active Operational Role:
              </span>
              <div className="grid grid-cols-1 gap-1">
                {roles.map((r) => {
                  const active = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onRoleChange(r.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${
                        active
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="p-3 overflow-y-auto flex-1">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isAllowed = item.allowedRoles.includes(currentRole);
                  if (!isAllowed) return null;

                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : item.highlight
                          ? 'text-amber-300 hover:bg-slate-800/80 border border-amber-500/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
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
            <div className="p-3 border-t border-slate-800 bg-slate-950/60">
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                <span>Sika Logistics Hub</span>
                <span className="text-[10px] text-emerald-400 font-normal">Active</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Bay 4 • Dispatch Dock #2</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DESKTOP COLLAPSIBLE SIDEBAR (>= md)                         */}
      {/* ============================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 select-none transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Navigation Group */}
        <div className="p-3 flex-1 overflow-y-auto">
          {!isDesktopCollapsed && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
              Navigation
            </div>
          )}

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isAllowed = item.allowedRoles.includes(currentRole);
              if (!isAllowed) return null;

              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  title={isDesktopCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isDesktopCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } text-xs font-medium rounded-lg transition-colors text-left relative group ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-slate-800/80 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    {!isDesktopCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isDesktopCollapsed && item.badge && (
                    <div className="shrink-0">{item.badge}</div>
                  )}

                  {/* Compact dot or badge in collapsed mode */}
                  {isDesktopCollapsed && (item.badge || item.highlight) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                  )}

                  {/* Tooltip on collapsed hover */}
                  {isDesktopCollapsed && (
                    <div
                      className={`absolute ${
                        rtl ? 'right-full mr-2' : 'left-full ml-2'
                      } px-2.5 py-1 bg-slate-950 text-slate-100 text-xs font-medium rounded-md shadow-xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50`}
                    >
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Collapse Control / Mini Status */}
        <div className="p-3 border-t border-slate-800">
          {!isDesktopCollapsed ? (
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-400">Warehouse Ops</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">Sika Distribution Hub</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Bay 4 • Dispatch Dock #2</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onToggleDesktopCollapse}
                title="Expand Sidebar"
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
