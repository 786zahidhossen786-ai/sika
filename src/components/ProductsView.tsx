import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  History,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  X
} from 'lucide-react';
import { Product, ProductCategory, StockMovement, Language } from '../types';
import { translations } from '../data/translations';

interface ProductsViewProps {
  products: Product[];
  stockMovements: StockMovement[];
  currentLang: Language;
  onSaveProduct: (product: Product) => void;
  onOpenMovementModal?: (productId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  stockMovements,
  currentLang,
  onSaveProduct
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewHistoryProduct, setViewHistoryProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories: (ProductCategory | 'all')[] = [
    'all',
    'Waterproofing',
    'Sealants & Adhesives',
    'Concrete & Mortar Repair',
    'Flooring & Coating',
    'Roofing Systems',
    'Admixtures'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsAddModalOpen(true);
  };

  const handleAddNew = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      code: 'SIKA-',
      name: '',
      category: 'Sealants & Adhesives',
      unit: 'Cartridge',
      packaging: 'Cartridge 300ml',
      purchaseCost: 10.0,
      sellingPrice: 16.0,
      minSellingPrice: 13.0,
      currentStock: 50,
      reorderLevel: 20,
      maxDiscountPercent: 10,
      description: '',
      shelfLifeMonths: 12,
      locationRack: 'A1-01',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setEditingProduct(newProd);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, product name, or chemical family..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t.newProduct}</span>
        </button>
      </div>

      {/* Category Segmented Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Product Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category & Unit</th>
                <th className="py-3 px-4 text-right">Landed Cost</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Gross Margin</th>
                <th className="py-3 px-4 text-right">Inventory Stock</th>
                <th className="py-3 px-4 text-center">Rack / Bin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.map((p) => {
                const isLow = p.currentStock <= p.reorderLevel;
                const margin = ((p.sellingPrice - p.purchaseCost) / p.sellingPrice) * 100;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Product Name & Code */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-md object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-amber-400/80" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-200 hover:text-amber-400 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[11px] font-mono text-amber-400/90 mt-0.5">
                            {p.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Packaging */}
                    <td className="py-3 px-4">
                      <div className="text-slate-300 font-medium">{p.category}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.packaging}</div>
                    </td>

                    {/* Landed Cost */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      ${p.purchaseCost.toFixed(2)}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-100">
                      ${p.sellingPrice.toFixed(2)}
                      <div className="text-[10px] text-slate-500 font-normal">
                        Min: ${p.minSellingPrice.toFixed(2)}
                      </div>
                    </td>

                    {/* Gross Margin */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span className={`font-semibold ${margin >= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>

                    {/* Inventory Stock */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-bold ${isLow ? 'text-rose-400' : 'text-slate-100'}`}>
                          {p.currentStock} {p.unit}s
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isLow ? (
                          <span className="text-rose-400 font-medium">Reorder (Min {p.reorderLevel})</span>
                        ) : (
                          `Min: ${p.reorderLevel}`
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-400">
                      {p.locationRack || 'Bay 1'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewHistoryProduct(p)}
                          title="View Stock Movements"
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          title="Edit Product"
                          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Product Modal */}
      {isAddModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-100">
                {editingProduct.id.startsWith('prod-') && editingProduct.name ? 'Edit Sika Product' : 'Add New Sika Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Sikaflex-11FC+ Polyurethane Sealant"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Product Code (SKU)</label>
                <input
                  type="text"
                  value={editingProduct.code}
                  onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                  placeholder="SIKA-FLEX-11"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Waterproofing">Waterproofing</option>
                  <option value="Sealants & Adhesives">Sealants & Adhesives</option>
                  <option value="Concrete & Mortar Repair">Concrete & Mortar Repair</option>
                  <option value="Flooring & Coating">Flooring & Coating</option>
                  <option value="Roofing Systems">Roofing Systems</option>
                  <option value="Admixtures">Admixtures</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Packaging Specification</label>
                <input
                  type="text"
                  value={editingProduct.packaging}
                  onChange={(e) => setEditingProduct({ ...editingProduct, packaging: e.target.value as any })}
                  placeholder="e.g. Cartridge 300ml / Bag 25kg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Unit of Measurement</label>
                <input
                  type="text"
                  value={editingProduct.unit}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                  placeholder="Cartridge / Pail / Bag"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Purchase Cost ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.purchaseCost}
                  onChange={(e) => setEditingProduct({ ...editingProduct, purchaseCost: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Standard Selling Price ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.sellingPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Current Stock Count</label>
                <input
                  type="number"
                  value={editingProduct.currentStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, currentStock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Reorder Alert Level</label>
                <input
                  type="number"
                  value={editingProduct.reorderLevel}
                  onChange={(e) => setEditingProduct({ ...editingProduct, reorderLevel: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Warehouse Rack / Bin Location</label>
                <input
                  type="text"
                  value={editingProduct.locationRack}
                  onChange={(e) => setEditingProduct({ ...editingProduct, locationRack: e.target.value })}
                  placeholder="e.g. A2-04-B"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingProduct.name && editingProduct.code) {
                    onSaveProduct(editingProduct);
                    setIsAddModalOpen(false);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Drawer */}
      {viewHistoryProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Stock Movement Audit Ledger
                </h3>
                <div className="text-xs text-amber-400 font-mono mt-0.5">
                  {viewHistoryProduct.name} ({viewHistoryProduct.code})
                </div>
              </div>
              <button
                onClick={() => setViewHistoryProduct(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5">
              {stockMovements
                .filter((m) => m.productId === viewHistoryProduct.id)
                .map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          m.type === 'purchase_in' ? 'text-emerald-400' :
                          m.type === 'sale_out' ? 'text-blue-400' : 'text-rose-400'
                        }`}>
                          {m.type === 'purchase_in' ? '+ Inflow (PO)' :
                           m.type === 'sale_out' ? '- Outflow (Sales)' :
                           m.type === 'damage_loss' ? 'Damage / Scrapped' : 'Adjustment'}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="font-mono text-slate-300">{m.referenceDoc}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {m.reason} · Performed by {m.user}
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div className={`font-bold ${m.quantity > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Balance: {m.newStock}
                      </div>
                    </div>
                  </div>
                ))}
              {stockMovements.filter((m) => m.productId === viewHistoryProduct.id).length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No stock movements recorded yet for this product.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setViewHistoryProduct(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
