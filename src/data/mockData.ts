import {
  Product,
  Customer,
  Supplier,
  Invoice,
  PurchaseOrder,
  StockMovement,
  Delivery,
  PaymentRecord,
  ExpenseRecord
} from '../types';

import sikaSealantImg from '../assets/images/sika_sealant_cartridge_1792853146716.jpg';
import sikaMortarImg from '../assets/images/sika_mortar_pail_1792853146876.jpg';
import sikaWarehouseImg from '../assets/images/sika_warehouse_depot_1792853147575.jpg';
import avatarDirectorImg from '../assets/images/avatar_operations_director_1792853147363.jpg';

export { sikaSealantImg, sikaMortarImg, sikaWarehouseImg, avatarDirectorImg };

export const initialProducts: Product[] = [
  {
    id: 'prod-101',
    code: 'SIKA-FLEX-11FC',
    name: 'Sikaflex®-11 FC+ Polyurethane Sealant',
    category: 'Sealants & Adhesives',
    unit: 'Cartridge',
    packaging: 'Cartridge 300ml',
    purchaseCost: 6.20,
    sellingPrice: 10.50,
    minSellingPrice: 8.50,
    currentStock: 480,
    reorderLevel: 100,
    maxDiscountPercent: 15,
    image: sikaSealantImg,
    description: '1-component elastic polyurethane adhesive and multi-purpose joint sealant for interior and exterior sealing.',
    shelfLifeMonths: 15,
    locationRack: 'A1-04-B',
    updatedAt: '2026-10-22'
  },
  {
    id: 'prod-102',
    code: 'SIKA-TOP-107',
    name: 'SikaTop® Seal-107 Polymer Waterproofing Slurry',
    category: 'Waterproofing',
    unit: 'Kit',
    packaging: 'Bag 25kg',
    purchaseCost: 32.00,
    sellingPrice: 48.00,
    minSellingPrice: 41.00,
    currentStock: 185,
    reorderLevel: 50,
    maxDiscountPercent: 12,
    image: sikaMortarImg,
    description: 'Two-part polymer modified cementitious waterproof slurry mortar for concrete structures, basements, water tanks, and reservoirs.',
    shelfLifeMonths: 12,
    locationRack: 'B2-01-A',
    updatedAt: '2026-10-20'
  },
  {
    id: 'prod-103',
    code: 'SIKA-LATEX-POW',
    name: 'SikaLatex® Power Waterproof Bonding Agent',
    category: 'Admixtures',
    unit: 'Pail',
    packaging: 'Pail 20L',
    purchaseCost: 45.00,
    sellingPrice: 68.00,
    minSellingPrice: 58.00,
    currentStock: 64,
    reorderLevel: 30,
    maxDiscountPercent: 10,
    image: sikaMortarImg,
    description: 'Synthetic rubber emulsion for bonding slurries and high-strength polymer-modified repair mortars.',
    shelfLifeMonths: 18,
    locationRack: 'C1-03-A',
    updatedAt: '2026-10-23'
  },
  {
    id: 'prod-104',
    code: 'SIKA-ANCHOR-1',
    name: 'Sika AnchorFix®-1 Chemical Anchoring Adhesive',
    category: 'Sealants & Adhesives',
    unit: 'Cartridge',
    packaging: 'Cartridge 300ml',
    purchaseCost: 14.50,
    sellingPrice: 24.00,
    minSellingPrice: 20.00,
    currentStock: 18, // LOW STOCK
    reorderLevel: 40,
    maxDiscountPercent: 8,
    image: sikaSealantImg,
    description: 'Fast-curing, 2-component methacrylate anchoring adhesive for threaded rods and reinforcing rebar in concrete.',
    shelfLifeMonths: 12,
    locationRack: 'A2-02-C',
    updatedAt: '2026-10-18'
  },
  {
    id: 'prod-105',
    code: 'SIKA-DUR-31CF',
    name: 'Sikadur®-31 CF Normal Structural Epoxy Adhesive',
    category: 'Concrete & Mortar Repair',
    unit: 'Set',
    packaging: 'Pail 5L',
    purchaseCost: 38.00,
    sellingPrice: 59.00,
    minSellingPrice: 50.00,
    currentStock: 52,
    reorderLevel: 25,
    maxDiscountPercent: 10,
    description: '2-component thixotropic structural adhesive and repair mortar based on epoxy resin and selected quartz aggregate.',
    shelfLifeMonths: 24,
    locationRack: 'B1-02-D',
    updatedAt: '2026-10-21'
  },
  {
    id: 'prod-106',
    code: 'SIKA-CIM-WP',
    name: 'SikaCim® Integral Liquid Waterproofer',
    category: 'Admixtures',
    unit: 'Can',
    packaging: 'Pail 5L',
    purchaseCost: 11.20,
    sellingPrice: 18.50,
    minSellingPrice: 15.00,
    currentStock: 140,
    reorderLevel: 50,
    maxDiscountPercent: 15,
    description: 'Integral liquid waterproofing admixture for concrete, plaster, and mortar mixes for roof slabs and retaining walls.',
    shelfLifeMonths: 24,
    locationRack: 'C2-01-A',
    updatedAt: '2026-10-15'
  },
  {
    id: 'prod-107',
    code: 'SIKA-PROOF-A',
    name: 'SikaProof® A+ Fully Bonded FPO Sheet Membrane',
    category: 'Roofing Systems',
    unit: 'Roll',
    packaging: 'Roll 20m',
    purchaseCost: 210.00,
    sellingPrice: 295.00,
    minSellingPrice: 260.00,
    currentStock: 12, // LOW STOCK
    reorderLevel: 20,
    maxDiscountPercent: 8,
    description: 'Pre-applied fully bonded composite sheet waterproofing membrane for damp-proofing and sub-structure concrete protection.',
    shelfLifeMonths: 36,
    locationRack: 'D1-BAY-01',
    updatedAt: '2026-10-19'
  },
  {
    id: 'prod-108',
    code: 'SIKA-FLOOR-264',
    name: 'Sikafloor®-264 2-Part Epoxy Heavy Duty Floor Coating',
    category: 'Flooring & Coating',
    unit: 'Set',
    packaging: 'Drum 200L',
    purchaseCost: 280.00,
    sellingPrice: 395.00,
    minSellingPrice: 350.00,
    currentStock: 24,
    reorderLevel: 15,
    maxDiscountPercent: 10,
    description: 'High-durability solvent-free epoxy coating for industrial concrete floors, parking garages, and chemical processing zones.',
    shelfLifeMonths: 24,
    locationRack: 'E2-BAY-04',
    updatedAt: '2026-10-17'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-201',
    name: 'Apex Infrastructure Group',
    company: 'Apex Construction LLC',
    phone: '+971 4 883 4901',
    email: 'procurement@apexbuild.com',
    address: 'Plot 418, Industrial Area 3, Dubai',
    type: 'Contractor',
    creditLimit: 35000,
    outstandingBalance: 12450.00,
    totalPurchases: 84900.00,
    discountRate: 8,
    paymentTermsDays: 30,
    createdAt: '2025-02-14'
  },
  {
    id: 'cust-202',
    name: 'Metro Foundation & Piling Ltd',
    company: 'Metro Groundworks Corp',
    phone: '+971 2 554 9912',
    email: 'sites@metrogroundworks.com',
    address: 'Sector M-14, Mussafah, Abu Dhabi',
    type: 'Contractor',
    creditLimit: 25000,
    outstandingBalance: 5800.00,
    totalPurchases: 46200.00,
    discountRate: 6,
    paymentTermsDays: 45,
    createdAt: '2025-05-18'
  },
  {
    id: 'cust-203',
    name: 'Skyline Ready-Mix & Supplies',
    company: 'Skyline Wholesale Builders',
    phone: '+971 6 741 2388',
    email: 'orders@skylinewholesale.ae',
    address: 'Industrial Zone 1, Sharjah',
    type: 'Wholesaler',
    creditLimit: 50000,
    outstandingBalance: 18200.00,
    totalPurchases: 112000.00,
    discountRate: 10,
    paymentTermsDays: 30,
    createdAt: '2024-11-02'
  },
  {
    id: 'cust-204',
    name: 'Gulf Waterproofing Contractors',
    company: 'Gulf Water & Seal Tech',
    phone: '+971 4 339 1204',
    email: 'info@gulfwaterseal.com',
    address: 'Al Quoz 4, St 22, Dubai',
    type: 'Contractor',
    creditLimit: 15000,
    outstandingBalance: 0.00,
    totalPurchases: 32600.00,
    discountRate: 5,
    paymentTermsDays: 15,
    createdAt: '2025-08-09'
  },
  {
    id: 'cust-205',
    name: 'Al-Madina Building Materials',
    company: 'Al-Madina Hardware Retail',
    phone: '+971 7 228 9033',
    email: 'madina_hardware@gmail.com',
    address: 'Main Commercial Strip, Ras Al Khaimah',
    type: 'Retailer',
    creditLimit: 10000,
    outstandingBalance: 2450.00,
    totalPurchases: 21800.00,
    discountRate: 7,
    paymentTermsDays: 15,
    createdAt: '2026-01-10'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'supp-301',
    name: 'Sika Regional Authorized Distribution Hub',
    code: 'SIKA-DIRECT-HUB',
    contactPerson: 'Marc Weber / Regional Ops',
    phone: '+971 4 438 5200',
    email: 'orders.gcc@ae.sika.com',
    address: 'Dubai South Aviation & Logistics City, Dubai',
    leadTimeDays: 2,
    totalPurchased: 142000.00,
    outstandingPayable: 14500.00
  },
  {
    id: 'supp-302',
    name: 'Middle East Polymers & Additives',
    code: 'ME-POLYMERS',
    contactPerson: 'Tariq Al-Mansoor',
    phone: '+971 6 534 8871',
    email: 'sales@mepolymers.ae',
    address: 'Sajaa Industrial Oasis, Sharjah',
    leadTimeDays: 4,
    totalPurchased: 38400.00,
    outstandingPayable: 3200.00
  },
  {
    id: 'supp-303',
    name: 'Specialist Packaging & Logistics LLC',
    code: 'SPEC-PACK',
    contactPerson: 'Ramesh Patel',
    phone: '+971 4 285 4190',
    email: 'accounts@specpack-uae.com',
    address: 'Jebel Ali Free Zone South, Dubai',
    leadTimeDays: 3,
    totalPurchased: 18900.00,
    outstandingPayable: 0.00
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-401',
    invoiceNumber: 'INV-2026-094',
    date: '2026-10-24',
    dueDate: '2026-11-23',
    customerId: 'cust-201',
    customerName: 'Apex Infrastructure Group',
    customerPhone: '+971 4 883 4901',
    customerAddress: 'Plot 418, Industrial Area 3, Dubai',
    items: [
      {
        productId: 'prod-101',
        productCode: 'SIKA-FLEX-11FC',
        productName: 'Sikaflex®-11 FC+ Polyurethane Sealant',
        packaging: 'Cartridge 300ml',
        quantity: 120,
        unitCost: 6.20,
        unitPrice: 10.50,
        discountPercent: 8,
        taxPercent: 5,
        lineTotal: 1159.20,
        lineProfit: 415.20
      },
      {
        productId: 'prod-102',
        productCode: 'SIKA-TOP-107',
        productName: 'SikaTop® Seal-107 Polymer Waterproofing Slurry',
        packaging: 'Bag 25kg',
        quantity: 40,
        unitCost: 32.00,
        unitPrice: 48.00,
        discountPercent: 8,
        taxPercent: 5,
        lineTotal: 1766.40,
        lineProfit: 486.40
      }
    ],
    subtotal: 3180.00,
    totalDiscount: 254.40,
    taxAmount: 146.28,
    deliveryCharge: 80.00,
    grandTotal: 3151.88,
    totalCost: 2024.00,
    netProfit: 1047.88,
    paymentStatus: 'Credit',
    paymentMethod: 'Credit',
    paidAmount: 0,
    outstandingAmount: 3151.88,
    deliveryStatus: 'Out for Delivery',
    deliveryId: 'del-501',
    salesPerson: 'Zahid Hossain (Lead)',
    notes: 'Tower 4 Basement expansion joints.'
  },
  {
    id: 'inv-402',
    invoiceNumber: 'INV-2026-093',
    date: '2026-10-23',
    dueDate: '2026-11-07',
    customerId: 'cust-202',
    customerName: 'Metro Foundation & Piling Ltd',
    customerPhone: '+971 2 554 9912',
    customerAddress: 'Sector M-14, Mussafah, Abu Dhabi',
    items: [
      {
        productId: 'prod-105',
        productCode: 'SIKA-DUR-31CF',
        productName: 'Sikadur®-31 CF Normal Structural Epoxy Adhesive',
        packaging: 'Pail 5L',
        quantity: 20,
        unitCost: 38.00,
        unitPrice: 59.00,
        discountPercent: 5,
        taxPercent: 5,
        lineTotal: 1121.00,
        lineProfit: 361.00
      },
      {
        productId: 'prod-103',
        productCode: 'SIKA-LATEX-POW',
        productName: 'SikaLatex® Power Waterproof Bonding Agent',
        packaging: 'Pail 20L',
        quantity: 15,
        unitCost: 45.00,
        unitPrice: 68.00,
        discountPercent: 5,
        taxPercent: 5,
        lineTotal: 969.00,
        lineProfit: 294.00
      }
    ],
    subtotal: 2200.00,
    totalDiscount: 110.00,
    taxAmount: 104.50,
    deliveryCharge: 120.00,
    grandTotal: 2314.50,
    totalCost: 1435.00,
    netProfit: 759.50,
    paymentStatus: 'Partial',
    paymentMethod: 'Bank Transfer',
    paidAmount: 1500.00,
    outstandingAmount: 814.50,
    deliveryStatus: 'Delivered',
    deliveryId: 'del-502',
    salesPerson: 'Sara Lin',
    notes: 'Bridge pier cap bonding.'
  },
  {
    id: 'inv-403',
    invoiceNumber: 'INV-2026-092',
    date: '2026-10-22',
    dueDate: '2026-10-22',
    customerId: 'cust-204',
    customerName: 'Gulf Waterproofing Contractors',
    customerPhone: '+971 4 339 1204',
    customerAddress: 'Al Quoz 4, St 22, Dubai',
    items: [
      {
        productId: 'prod-102',
        productCode: 'SIKA-TOP-107',
        productName: 'SikaTop® Seal-107 Polymer Waterproofing Slurry',
        packaging: 'Bag 25kg',
        quantity: 50,
        unitCost: 32.00,
        unitPrice: 48.00,
        discountPercent: 10,
        taxPercent: 5,
        lineTotal: 2160.00,
        lineProfit: 560.00
      }
    ],
    subtotal: 2400.00,
    totalDiscount: 240.00,
    taxAmount: 108.00,
    deliveryCharge: 0.00,
    grandTotal: 2268.00,
    totalCost: 1600.00,
    netProfit: 668.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    paidAmount: 2268.00,
    outstandingAmount: 0.00,
    deliveryStatus: 'Delivered',
    salesPerson: 'Zahid Hossain (Lead)',
    notes: 'Warehouse counter pickup.'
  },
  {
    id: 'inv-404',
    invoiceNumber: 'INV-2026-091',
    date: '2026-10-21',
    dueDate: '2026-11-20',
    customerId: 'cust-203',
    customerName: 'Skyline Ready-Mix & Supplies',
    customerPhone: '+971 6 741 2388',
    customerAddress: 'Industrial Zone 1, Sharjah',
    items: [
      {
        productId: 'prod-106',
        productCode: 'SIKA-CIM-WP',
        productName: 'SikaCim® Integral Liquid Waterproofer',
        packaging: 'Pail 5L',
        quantity: 100,
        unitCost: 11.20,
        unitPrice: 18.50,
        discountPercent: 12,
        taxPercent: 5,
        lineTotal: 1628.00,
        lineProfit: 508.00
      },
      {
        productId: 'prod-108',
        productCode: 'SIKA-FLOOR-264',
        productName: 'Sikafloor®-264 2-Part Epoxy Heavy Duty Floor Coating',
        packaging: 'Drum 200L',
        quantity: 6,
        unitCost: 280.00,
        unitPrice: 395.00,
        discountPercent: 10,
        taxPercent: 5,
        lineTotal: 2133.00,
        lineProfit: 453.00
      }
    ],
    subtotal: 4220.00,
    totalDiscount: 459.00,
    taxAmount: 188.05,
    deliveryCharge: 150.00,
    grandTotal: 4099.05,
    totalCost: 2800.00,
    netProfit: 1149.05,
    paymentStatus: 'Credit',
    paymentMethod: 'Credit',
    paidAmount: 0.00,
    outstandingAmount: 4099.05,
    deliveryStatus: 'Loaded',
    deliveryId: 'del-503',
    salesPerson: 'Sara Lin',
    notes: 'Sharjah logistic center floor project.'
  }
];

export const initialDeliveries: Delivery[] = [
  {
    id: 'del-501',
    deliveryNumber: 'DSP-2026-114',
    invoiceId: 'inv-401',
    invoiceNumber: 'INV-2026-094',
    customerName: 'Apex Infrastructure Group',
    customerAddress: 'Plot 418, Industrial Area 3, Dubai',
    customerPhone: '+971 4 883 4901',
    driverName: 'Rashid Khan',
    truckNumber: 'DXB-84920 (Canter 4-Ton)',
    dispatchedAt: '2026-10-24 08:30',
    deliveryCharge: 80.00,
    status: 'Out for Delivery',
    itemsSummary: '120x Sikaflex-11FC, 40x SikaTop-107 (1.2 Tons)',
    weightKg: 1240,
    notes: 'Gate 2 security badge required.'
  },
  {
    id: 'del-502',
    deliveryNumber: 'DSP-2026-113',
    invoiceId: 'inv-402',
    invoiceNumber: 'INV-2026-092',
    customerName: 'Metro Foundation & Piling Ltd',
    customerAddress: 'Sector M-14, Mussafah, Abu Dhabi',
    customerPhone: '+971 2 554 9912',
    driverName: 'Bilal Ahmed',
    truckNumber: 'AD-21904 (6-Ton Flatbed)',
    dispatchedAt: '2026-10-23 07:00',
    deliveredAt: '2026-10-23 11:45',
    deliveryCharge: 120.00,
    status: 'Delivered',
    itemsSummary: '20x Sikadur-31CF, 15x SikaLatex Power',
    weightKg: 420,
    notes: 'Signed by Site Engineer Eng. Tariq.'
  },
  {
    id: 'del-503',
    deliveryNumber: 'DSP-2026-112',
    invoiceId: 'inv-404',
    invoiceNumber: 'INV-2026-091',
    customerName: 'Skyline Ready-Mix & Supplies',
    customerAddress: 'Industrial Zone 1, Sharjah',
    customerPhone: '+971 6 741 2388',
    driverName: 'Rashid Khan',
    truckNumber: 'DXB-84920 (Canter 4-Ton)',
    dispatchedAt: '2026-10-24 09:15',
    deliveryCharge: 150.00,
    status: 'Loaded',
    itemsSummary: '100x SikaCim WP, 6x Sikafloor-264 Drums',
    weightKg: 1750,
    notes: 'Unloading forklift needed.'
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-601',
    poNumber: 'PO-2026-042',
    date: '2026-10-18',
    supplierId: 'supp-301',
    supplierName: 'Sika Regional Authorized Distribution Hub',
    items: [
      {
        productId: 'prod-101',
        productCode: 'SIKA-FLEX-11FC',
        productName: 'Sikaflex®-11 FC+ Polyurethane Sealant',
        quantity: 300,
        unitCost: 6.20,
        lineTotal: 1860.00
      },
      {
        productId: 'prod-102',
        productCode: 'SIKA-TOP-107',
        productName: 'SikaTop® Seal-107 Polymer Waterproofing Slurry',
        quantity: 100,
        unitCost: 32.00,
        lineTotal: 3200.00
      }
    ],
    subtotal: 5060.00,
    transportCost: 150.00,
    taxAmount: 253.00,
    totalCost: 5463.00,
    status: 'Received',
    paymentStatus: 'Paid',
    invoiceRef: 'SIKA-INV-88910',
    receivedDate: '2026-10-20'
  },
  {
    id: 'po-602',
    poNumber: 'PO-2026-043',
    date: '2026-10-22',
    supplierId: 'supp-301',
    supplierName: 'Sika Regional Authorized Distribution Hub',
    items: [
      {
        productId: 'prod-104',
        productCode: 'SIKA-ANCHOR-1',
        productName: 'Sika AnchorFix®-1 Chemical Anchoring Adhesive',
        quantity: 80,
        unitCost: 14.50,
        lineTotal: 1160.00
      },
      {
        productId: 'prod-107',
        productCode: 'SIKA-PROOF-A',
        productName: 'SikaProof® A+ Fully Bonded FPO Sheet Membrane',
        quantity: 25,
        unitCost: 210.00,
        lineTotal: 5250.00
      }
    ],
    subtotal: 6410.00,
    transportCost: 200.00,
    taxAmount: 320.50,
    totalCost: 6930.50,
    status: 'In Transit',
    paymentStatus: 'Due',
    invoiceRef: 'SIKA-INV-89104'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'mov-701',
    date: '2026-10-24 09:30',
    productId: 'prod-101',
    productCode: 'SIKA-FLEX-11FC',
    productName: 'Sikaflex®-11 FC+ Polyurethane Sealant',
    type: 'sale_out',
    quantity: -120,
    previousStock: 600,
    newStock: 480,
    referenceDoc: 'INV-2026-094',
    reason: 'Sales dispatch to Apex Infrastructure',
    user: 'Rashid K.'
  },
  {
    id: 'mov-702',
    date: '2026-10-24 09:30',
    productId: 'prod-102',
    productCode: 'SIKA-TOP-107',
    productName: 'SikaTop® Seal-107 Polymer Waterproofing Slurry',
    type: 'sale_out',
    quantity: -40,
    previousStock: 225,
    newStock: 185,
    referenceDoc: 'INV-2026-094',
    reason: 'Sales dispatch to Apex Infrastructure',
    user: 'Rashid K.'
  },
  {
    id: 'mov-703',
    date: '2026-10-20 14:15',
    productId: 'prod-101',
    productCode: 'SIKA-FLEX-11FC',
    productName: 'Sikaflex®-11 FC+ Polyurethane Sealant',
    type: 'purchase_in',
    quantity: 300,
    previousStock: 300,
    newStock: 600,
    referenceDoc: 'PO-2026-042',
    reason: 'Shipment received from Sika Hub',
    user: 'Warehouse Lead'
  },
  {
    id: 'mov-704',
    date: '2026-10-19 11:00',
    productId: 'prod-104',
    productCode: 'SIKA-ANCHOR-1',
    productName: 'Sikaflex AnchorFix-1',
    type: 'damage_loss',
    quantity: -2,
    previousStock: 20,
    newStock: 18,
    referenceDoc: 'ADJ-2026-012',
    reason: 'Nozzle punctured during fork unloading',
    user: 'Warehouse Lead'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-801',
    receiptNumber: 'REC-2026-081',
    date: '2026-10-23',
    customerId: 'cust-202',
    customerName: 'Metro Foundation & Piling Ltd',
    invoiceId: 'inv-402',
    invoiceNumber: 'INV-2026-093',
    amount: 1500.00,
    method: 'Bank Transfer',
    reference: 'ENBD-TX-883190',
    recordedBy: 'Finance / Accountant',
    notes: 'Advance part payment for pier repair'
  },
  {
    id: 'pay-802',
    receiptNumber: 'REC-2026-080',
    date: '2026-10-22',
    customerId: 'cust-204',
    customerName: 'Gulf Waterproofing Contractors',
    invoiceId: 'inv-403',
    invoiceNumber: 'INV-2026-092',
    amount: 2268.00,
    method: 'Cash',
    reference: 'CASH-COUNTER-04',
    recordedBy: 'Zahid Hossain',
    notes: 'Full payment on collection'
  }
];

export const initialExpenses: ExpenseRecord[] = [
  {
    id: 'exp-901',
    date: '2026-10-22',
    category: 'Transport & Fleet',
    amount: 450.00,
    description: 'Diesel fuel refill for 2 delivery trucks (Canter & Flatbed)',
    paidVia: 'Company Fuel Card'
  },
  {
    id: 'exp-902',
    date: '2026-10-15',
    category: 'Warehouse Rent',
    amount: 3200.00,
    description: 'Monthly warehouse bay 4 lease installment',
    paidVia: 'Bank Transfer'
  },
  {
    id: 'exp-903',
    date: '2026-10-10',
    category: 'Packaging & Equipment',
    amount: 280.00,
    description: 'Heavy duty shrink wrap rolls and wooden pallets replenishment',
    paidVia: 'Corporate Card'
  }
];
