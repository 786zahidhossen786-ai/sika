import React from 'react';
import { 
  Building2, 
  Globe, 
  PlusCircle, 
  ShieldCheck, 
  Truck, 
  Package, 
  BadgePercent,
  Check
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
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  activeView,
  onNewInvoiceClick
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
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Sika triangle styled emblem */}
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black tracking-tighter text-sm">
            SIKA
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold text-slate-100 tracking-tight block">
              MaterialOps
            </span>
            <span className="text-[11px] text-amber-400/90 font-medium block">
              Sika Construction Materials
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Contextual Role & Operational Mode */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Role Selector */}
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
      <div className="flex items-center gap-3 shrink-0">
        {/* Language selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase font-semibold tracking-wider">{currentLang}</span>
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
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] rounded-lg shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>{t.newInvoice}</span>
        </button>
      </div>
    </header>
  );
};
