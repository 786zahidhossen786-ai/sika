import React, { useState, useEffect } from 'react';
import {
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialInvoices,
  initialDeliveries,
  initialPurchaseOrders,
  initialStockMovements,
  initialPayments,
  initialExpenses
} from './data/mockData';
import {
  Product,
  Customer,
  Supplier,
  Invoice,
  Delivery,
  PurchaseOrder,
  StockMovement,
  PaymentRecord,
  ExpenseRecord,
  UserRole,
  Language,
  DeliveryStatus
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { SalesBillingView } from './components/SalesBillingView';
import { CustomersView } from './components/CustomersView';
import { InventoryView } from './components/InventoryView';
import { SuppliersPurchasesView } from './components/SuppliersPurchasesView';
import { DeliveriesView } from './components/DeliveriesView';
import { ProfitLossView } from './components/ProfitLossView';
import { ReportsView } from './components/ReportsView';
import { AppSpecView } from './components/AppSpecView';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { isRTL } from './data/translations';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Business state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(initialExpenses);

  // Modals
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  // Update HTML document direction for RTL languages (Arabic / Urdu)
  useEffect(() => {
    const rtl = isRTL(currentLang);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Handler: Save or Update Product
  const handleSaveProduct = (updatedProd: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updatedProd.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      }
      return [updatedProd, ...prev];
    });
  };

  // Handler: Create Sales Invoice (Auto inventory reduction & ledger sync)
  const handleCreateInvoice = (newInvoice: Invoice) => {
    // 1. Add invoice
    setInvoices((prev) => [newInvoice, ...prev]);

    // 2. Decrement product stock & create stock movements
    const newMovements: StockMovement[] = [];
    setProducts((prev) =>
      prev.map((prod) => {
        const line = newInvoice.items.find((item) => item.productId === prod.id);
        if (!line) return prod;

        const previousStock = prod.currentStock;
        const newStock = Math.max(0, previousStock - line.quantity);

        newMovements.push({
          id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          type: 'sale_out',
          quantity: -line.quantity,
          previousStock,
          newStock,
          referenceDoc: newInvoice.invoiceNumber,
          reason: `Sales dispatch to ${newInvoice.customerName}`,
          user: newInvoice.salesPerson
        });

        return { ...prod, currentStock: newStock };
      })
    );

    if (newMovements.length > 0) {
      setStockMovements((prev) => [...newMovements, ...prev]);
    }

    // 3. Update customer outstanding balance & purchase volume
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id !== newInvoice.customerId) return cust;
        return {
          ...cust,
          outstandingBalance: cust.outstandingBalance + newInvoice.outstandingAmount,
          totalPurchases: cust.totalPurchases + newInvoice.grandTotal
        };
      })
    );

    // 4. If delivery required, create new Delivery dispatch manifest
    if (newInvoice.deliveryCharge > 0 || newInvoice.deliveryStatus === 'Pending') {
      const itemsSummary = newInvoice.items
        .map((i) => `${i.quantity}x ${i.productName.split(' ')[0]}`)
        .join(', ');

      const newDelivery: Delivery = {
        id: `del-${Date.now()}`,
        deliveryNumber: `DSP-2026-${String(deliveries.length + 101).padStart(3, '0')}`,
        invoiceId: newInvoice.id,
        invoiceNumber: newInvoice.invoiceNumber,
        customerName: newInvoice.customerName,
        customerAddress: newInvoice.customerAddress,
        customerPhone: newInvoice.customerPhone,
        driverName: 'Rashid Khan',
        truckNumber: 'DXB-84920 (Canter 4-Ton)',
        dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        deliveryCharge: newInvoice.deliveryCharge,
        status: 'Loaded',
        itemsSummary,
        weightKg: Math.round(newInvoice.items.reduce((sum, i) => sum + i.quantity * 10, 0)),
        notes: newInvoice.notes
      };

      setDeliveries((prev) => [newDelivery, ...prev]);
    }
  };

  // Handler: Adjust Stock / Damage Scrap
  const handleAdjustStock = (movement: StockMovement) => {
    setStockMovements((prev) => [movement, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== movement.productId) return p;
        return { ...p, currentStock: movement.newStock };
      })
    );
  };

  // Handler: Customer Save / Update
  const handleSaveCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === customer.id);
      if (exists) {
        return prev.map((c) => (c.id === customer.id ? customer : c));
      }
      return [customer, ...prev];
    });
  };

  // Handler: Record Customer Payment
  const handleRecordPayment = (payment: PaymentRecord) => {
    setPayments((prev) => [payment, ...prev]);

    // Reduce customer's balance
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id !== payment.customerId) return cust;
        return {
          ...cust,
          outstandingBalance: Math.max(0, cust.outstandingBalance - payment.amount)
        };
      })
    );

    // If payment covers an invoice, mark invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.customerId === payment.customerId && inv.outstandingAmount > 0) {
          const newPaid = inv.paidAmount + Math.min(inv.outstandingAmount, payment.amount);
          const newOutstanding = Math.max(0, inv.grandTotal - newPaid);
          const newStatus = newOutstanding === 0 ? 'Paid' : 'Partial';
          return {
            ...inv,
            paidAmount: newPaid,
            outstandingAmount: newOutstanding,
            paymentStatus: newStatus
          };
        }
        return inv;
      })
    );
  };

  // Handler: Create Purchase Order
  const handleCreatePurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders((prev) => [po, ...prev]);
  };

  // Handler: Receive PO (Restocks warehouse)
  const handleReceivePO = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    // Update PO status
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'Received', receivedDate: new Date().toISOString().split('T')[0] } : p))
    );

    // Increment stocks & create movements
    const newMovements: StockMovement[] = [];
    setProducts((prev) =>
      prev.map((prod) => {
        const item = po.items.find((i) => i.productId === prod.id);
        if (!item) return prod;

        const previousStock = prod.currentStock;
        const newStock = previousStock + item.quantity;

        newMovements.push({
          id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          type: 'purchase_in',
          quantity: item.quantity,
          previousStock,
          newStock,
          referenceDoc: po.poNumber,
          reason: `Shipment received from ${po.supplierName}`,
          user: 'Warehouse Lead'
        });

        return { ...prod, currentStock: newStock };
      })
    );

    if (newMovements.length > 0) {
      setStockMovements((prev) => [...newMovements, ...prev]);
    }
  };

  // Handler: Delivery Status Transition
  const handleUpdateDeliveryStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
    );

    // Update related invoice deliveryStatus
    const del = deliveries.find((d) => d.id === deliveryId);
    if (del) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === del.invoiceId ? { ...inv, deliveryStatus: newStatus } : inv))
      );
    }
  };

  const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;
  const pendingDeliveryCount = deliveries.filter(
    (d) => d.status === 'Pending' || d.status === 'Loaded' || d.status === 'Out for Delivery'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Clean Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        activeView={activeView}
        onNewInvoiceClick={() => setIsCreateInvoiceModalOpen(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          currentLang={currentLang}
          currentRole={currentRole}
          lowStockCount={lowStockCount}
          pendingDeliveryCount={pendingDeliveryCount}
        />

        {/* Dynamic Viewport View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                products={products}
                customers={customers}
                invoices={invoices}
                deliveries={deliveries}
                currentLang={currentLang}
                onNavigate={setActiveView}
                onSelectProductForReorder={(p) => setActiveView('inventory')}
              />
            )}

            {activeView === 'products' && (
              <ProductsView
                products={products}
                stockMovements={stockMovements}
                currentLang={currentLang}
                onSaveProduct={handleSaveProduct}
              />
            )}

            {activeView === 'sales' && (
              <SalesBillingView
                invoices={invoices}
                products={products}
                customers={customers}
                currentLang={currentLang}
                onCreateInvoice={handleCreateInvoice}
                onPrintInvoice={setPrintInvoice}
                isCreateModalOpen={isCreateInvoiceModalOpen}
                setIsCreateModalOpen={setIsCreateInvoiceModalOpen}
              />
            )}

            {activeView === 'inventory' && (
              <InventoryView
                products={products}
                stockMovements={stockMovements}
                currentLang={currentLang}
                onAdjustStock={handleAdjustStock}
              />
            )}

            {activeView === 'customers' && (
              <CustomersView
                customers={customers}
                invoices={invoices}
                payments={payments}
                currentLang={currentLang}
                onSaveCustomer={handleSaveCustomer}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {activeView === 'suppliers' && (
              <SuppliersPurchasesView
                suppliers={suppliers}
                purchaseOrders={purchaseOrders}
                products={products}
                currentLang={currentLang}
                onCreatePurchaseOrder={handleCreatePurchaseOrder}
                onReceivePO={handleReceivePO}
              />
            )}

            {activeView === 'deliveries' && (
              <DeliveriesView
                deliveries={deliveries}
                currentLang={currentLang}
                onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
              />
            )}

            {activeView === 'profit_loss' && (
              <ProfitLossView
                invoices={invoices}
                products={products}
                expenses={expenses}
                currentLang={currentLang}
              />
            )}

            {activeView === 'reports' && (
              <ReportsView
                invoices={invoices}
                products={products}
                customers={customers}
                deliveries={deliveries}
                currentLang={currentLang}
              />
            )}

            {activeView === 'app_spec' && (
              <AppSpecView currentLang={currentLang} />
            )}
          </div>
        </main>
      </div>

      {/* Official Sika Tax Invoice Print Modal */}
      <InvoicePrintModal
        invoice={printInvoice}
        onClose={() => setPrintInvoice(null)}
        currentLang={currentLang}
      />
    </div>
  );
}
