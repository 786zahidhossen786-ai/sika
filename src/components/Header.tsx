import React from 'react';
import { 
  Building2, 
  Globe, 
  Plus, 
  ShieldCheck, 
  Truck, 
  Package, 
  BadgePercent,
  Check,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations, isRTL } from '../data/translations';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  activeView: string;
  onNewInvoiceClick: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  activeView,
  onNewInvoiceClick,
  isMobileMenuOpen,
  onToggleMobileMenu,
  isDesktopCollapsed,
  onToggleDesktopCollapse
}) => {
  const t = translations[currentLang];
  const rtl = isRTL(currentLang);

  const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'admin', label: t.roleAdmin, icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'sales_manager', label: t.roleSales, icon: <BadgePercent className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'warehouse_manager', label: t.roleWarehouse, icon: <Package className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'delivery_driver', label: t.roleDriver, icon: <Truck className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'accountant', label: t.roleAccountant, icon: <Building2 className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: 'EN' },
    { id: 'ar', label: 'العربية (RTL)', flag: 'AR' },
    { id: 'zh', label: '中文 (CN)', flag: 'ZH' },
    { id: 'ur', label: 'اردو (RTL)', flag: 'UR' },
    { id: 'bn', label: 'বাংলা (BN)', flag: 'BN' },
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 select-none">
      {/* Zone 1: Mobile Hamburger + Brand Wordmark + Desktop Collapse Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-amber-400" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={onToggleDesktopCollapse}
          title={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          {isDesktopCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-amber-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Sika Emblem & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black tracking-tighter text-xs sm:text-sm shrink-0">
            SIKA
          </div>
          <div className="leading-tight">
            <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight block">
              MaterialOps
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-400/90 font-medium hidden sm:block">
              Sika Construction Materials
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Contextual Role Selector (Desktop) */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 px-2">
            Role:
          </span>
          {roles.map((r) => {
            const active = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  active
                    ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
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

      {/* Zone 3: Language Selector & Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="uppercase font-semibold tracking-wider text-[11px] sm:text-xs">{currentLang}</span>
          </button>
          
          <div className={`absolute top-full mt-1.5 ${rtl ? 'left-0' : 'right-0'} w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-slate-950/50 py-1 hidden group-hover:block z-50`}>
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => onLangChange(l.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                  currentLang === l.id 
                    ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{l.label}</span>
                {currentLang === l.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button: Create Sales Invoice */}
        <button
          onClick={onNewInvoiceClick}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] rounded-lg shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="hidden sm:inline">{t.newInvoice}</span>
          <span className="sm:hidden font-bold">Invoice</span>
        </button>
      </div>
    </header>
  );
};
