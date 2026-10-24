export type UserRole = 'admin' | 'sales_manager' | 'warehouse_manager' | 'delivery_driver' | 'accountant';

export type Language = 'en' | 'ar' | 'zh' | 'ur' | 'bn';

export type ProductCategory = 
  | 'Waterproofing'
  | 'Sealants & Adhesives'
  | 'Concrete & Mortar Repair'
  | 'Flooring & Coating'
  | 'Roofing Systems'
  | 'Admixtures';

export type PackagingType = 
  | 'Cartridge 300ml'
  | 'Sausage 600ml'
  | 'Pail 20L'
  | 'Pail 5L'
  | 'Bag 25kg'
  | 'Bag 20kg'
  | 'Drum 200L'
  | 'Roll 20m';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  unit: string;
  packaging: PackagingType;
  purchaseCost: number;
  sellingPrice: number;
  minSellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  maxDiscountPercent: number;
  image?: string;
  description: string;
  shelfLifeMonths: number;
  locationRack: string;
  updatedAt: string;
}

export type CustomerType = 'Contractor' | 'Wholesaler' | 'Retailer' | 'Direct';

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  type: CustomerType;
  creditLimit: number;
  outstandingBalance: number;
  totalPurchases: number;
  discountRate: number; // default contractual discount %
  paymentTermsDays: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  leadTimeDays: number;
  totalPurchased: number;
  outstandingPayable: number;
}

export interface InvoiceItem {
  productId: string;
  productCode: string;
  productName: string;
  packaging: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  lineTotal: number;
  lineProfit: number;
}

export type PaymentStatus = 'Paid' | 'Partial' | 'Credit' | 'Overdue';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Credit' | 'Cheque';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  totalCost: number;
  netProfit: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  outstandingAmount: number;
  deliveryStatus: DeliveryStatus;
  deliveryId?: string;
  notes?: string;
  salesPerson: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  transportCost: number;
  taxAmount: number;
  totalCost: number;
  status: 'Received' | 'Pending' | 'In Transit';
  paymentStatus: 'Paid' | 'Due' | 'Partial';
  invoiceRef: string;
  receivedDate?: string;
}

export type MovementType = 'purchase_in' | 'sale_out' | 'adjustment' | 'return_in' | 'damage_loss';

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productCode: string;
  productName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceDoc: string; // e.g. INV-2026-081, PO-2026-014
  reason: string;
  user: string;
}

export type DeliveryStatus = 'Pending' | 'Loaded' | 'Out for Delivery' | 'Delivered' | 'Returned';

export interface Delivery {
  id: string;
  deliveryNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  driverName: string;
  truckNumber: string;
  dispatchedAt: string;
  deliveredAt?: string;
  deliveryCharge: number;
  status: DeliveryStatus;
  itemsSummary: string;
  weightKg: number;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  recordedBy: string;
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Transport & Fleet' | 'Warehouse Rent' | 'Staff Payroll' | 'Utilities & Power' | 'Packaging & Equipment' | 'Miscellaneous';
  amount: number;
  description: string;
  paidVia: string;
}
