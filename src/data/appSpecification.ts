export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey?: boolean;
    references?: string;
    description: string;
  }[];
  indexes: string[];
}

export const databaseSchemaTables: SchemaTable[] = [
  {
    name: 'products',
    description: 'Sika construction chemicals, sealants, mortars and waterproofing catalog',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Primary key (gen_random_uuid())' },
      { name: 'code', type: 'VARCHAR(64)', nullable: false, description: 'Sika SKU / article code (unique)' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Commercial product name' },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, description: 'Waterproofing, Sealants, Mortars, etc.' },
      { name: 'unit', type: 'VARCHAR(32)', nullable: false, description: 'Base measurement unit (Cartridge, Pail, Bag)' },
      { name: 'packaging', type: 'VARCHAR(64)', nullable: false, description: 'Standard packaging size (e.g. 300ml, 25kg)' },
      { name: 'purchase_cost', type: 'NUMERIC(12,2)', nullable: false, description: 'Latest procurement landed unit cost' },
      { name: 'selling_price', type: 'NUMERIC(12,2)', nullable: false, description: 'Standard baseline retail selling price' },
      { name: 'min_selling_price', type: 'NUMERIC(12,2)', nullable: false, description: 'Price floor to protect gross margins' },
      { name: 'current_stock', type: 'INTEGER', nullable: false, description: 'Real-time on-hand physical stock quantity' },
      { name: 'reorder_level', type: 'INTEGER', nullable: false, description: 'Stock threshold for automated replenishment' },
      { name: 'max_discount_pct', type: 'NUMERIC(5,2)', nullable: false, description: 'Maximum allowable discretionary discount %' },
      { name: 'location_rack', type: 'VARCHAR(64)', nullable: true, description: 'Warehouse bin / rack location' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Creation timestamp' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_products_code ON products(code);', 'CREATE INDEX idx_products_category ON products(category);', 'CREATE INDEX idx_products_low_stock ON products(current_stock) WHERE current_stock <= reorder_level;']
  },
  {
    name: 'customers',
    description: 'B2B contractors, sub-contractors, wholesalers, and retail accounts',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Customer identifier' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Primary contact or account name' },
      { name: 'company', type: 'VARCHAR(255)', nullable: true, description: 'Registered business/firm name' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: false, description: 'Primary telephone/mobile' },
      { name: 'email', type: 'VARCHAR(128)', nullable: true, description: 'Billing email address' },
      { name: 'type', type: 'VARCHAR(32)', nullable: false, description: 'Contractor, Wholesaler, Retailer, Direct' },
      { name: 'credit_limit', type: 'NUMERIC(12,2)', nullable: false, description: 'Pre-approved maximum credit exposure' },
      { name: 'outstanding_balance', type: 'NUMERIC(12,2)', nullable: false, description: 'Current unpaid receivable balance' },
      { name: 'discount_rate', type: 'NUMERIC(5,2)', nullable: false, description: 'Contractual baseline discount percentage' },
      { name: 'payment_terms_days', type: 'INTEGER', nullable: false, description: 'Standard net terms (e.g. Net 30, Net 45)' }
    ],
    indexes: ['CREATE INDEX idx_customers_company ON customers(company);', 'CREATE INDEX idx_customers_balance ON customers(outstanding_balance) WHERE outstanding_balance > 0;']
  },
  {
    name: 'suppliers',
    description: 'Sika regional hubs and specialized raw chemical suppliers',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Supplier identifier' },
      { name: 'code', type: 'VARCHAR(32)', nullable: false, description: 'Supplier reference code' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Supplier entity name' },
      { name: 'contact_person', type: 'VARCHAR(128)', nullable: true, description: 'Account representative' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: false, description: 'Telephone' },
      { name: 'email', type: 'VARCHAR(128)', nullable: true, description: 'Procurement email' },
      { name: 'lead_time_days', type: 'INTEGER', nullable: false, description: 'Average order dispatch lead time' },
      { name: 'outstanding_payable', type: 'NUMERIC(12,2)', nullable: false, description: 'Accounts payable balance' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_suppliers_code ON suppliers(code);']
  },
  {
    name: 'invoices',
    description: 'Sales bills, contractor tax invoices, and revenue records',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Invoice identifier' },
      { name: 'invoice_number', type: 'VARCHAR(64)', nullable: false, description: 'Formatted unique sequence (INV-YYYY-XXXX)' },
      { name: 'customer_id', type: 'UUID', nullable: false, references: 'customers(id)', description: 'Foreign key to customer' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Invoice issue date' },
      { name: 'due_date', type: 'DATE', nullable: false, description: 'Payment due date' },
      { name: 'subtotal', type: 'NUMERIC(12,2)', nullable: false, description: 'Gross item total before tax & discounts' },
      { name: 'total_discount', type: 'NUMERIC(12,2)', nullable: false, description: 'Cumulative discount deducted' },
      { name: 'tax_amount', type: 'NUMERIC(12,2)', nullable: false, description: 'Calculated VAT / sales tax' },
      { name: 'delivery_charge', type: 'NUMERIC(12,2)', nullable: false, description: 'Logistics and freight fee' },
      { name: 'grand_total', type: 'NUMERIC(12,2)', nullable: false, description: 'Final payable invoice balance' },
      { name: 'total_cogs', type: 'NUMERIC(12,2)', nullable: false, description: 'Total cost of goods sold for margin' },
      { name: 'net_profit', type: 'NUMERIC(12,2)', nullable: false, description: 'Gross profit minus delivery overhead' },
      { name: 'payment_status', type: 'VARCHAR(32)', nullable: false, description: 'Paid, Partial, Credit, Overdue' },
      { name: 'payment_method', type: 'VARCHAR(32)', nullable: false, description: 'Cash, Bank Transfer, Credit, Cheque' },
      { name: 'paid_amount', type: 'NUMERIC(12,2)', nullable: false, description: 'Amount collected to date' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_invoices_number ON invoices(invoice_number);', 'CREATE INDEX idx_invoices_customer_date ON invoices(customer_id, date DESC);', 'CREATE INDEX idx_invoices_status ON invoices(payment_status);']
  },
  {
    name: 'invoice_items',
    description: 'Line item breakdown with historical landed cost preservation',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Line item primary key' },
      { name: 'invoice_id', type: 'UUID', nullable: false, references: 'invoices(id)', description: 'Parent invoice' },
      { name: 'product_id', type: 'UUID', nullable: false, references: 'products(id)', description: 'Sold Sika product' },
      { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Billed units' },
      { name: 'unit_cost', type: 'NUMERIC(12,2)', nullable: false, description: 'Snapshot of cost price at time of sale' },
      { name: 'unit_price', type: 'NUMERIC(12,2)', nullable: false, description: 'Selling price per unit' },
      { name: 'discount_pct', type: 'NUMERIC(5,2)', nullable: false, description: 'Applied discount %' },
      { name: 'line_total', type: 'NUMERIC(12,2)', nullable: false, description: 'Quantity * (unit_price * (1 - disc))' }
    ],
    indexes: ['CREATE INDEX idx_invoice_items_inv ON invoice_items(invoice_id);', 'CREATE INDEX idx_invoice_items_prod ON invoice_items(product_id);']
  },
  {
    name: 'stock_movements',
    description: 'Immutable ledger of every stock in, dispatch out, return, and damage',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Movement identifier' },
      { name: 'product_id', type: 'UUID', nullable: false, references: 'products(id)', description: 'Product altered' },
      { name: 'movement_type', type: 'VARCHAR(32)', nullable: false, description: 'purchase_in, sale_out, adjustment, return_in, damage_loss' },
      { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Signed delta (+ in, - out)' },
      { name: 'previous_stock', type: 'INTEGER', nullable: false, description: 'Stock before event' },
      { name: 'new_stock', type: 'INTEGER', nullable: false, description: 'Stock after event' },
      { name: 'reference_doc', type: 'VARCHAR(64)', nullable: false, description: 'INV-XXXX or PO-XXXX or ADJ-XXXX' },
      { name: 'reason', type: 'VARCHAR(255)', nullable: true, description: 'Audit explanation' },
      { name: 'performed_by', type: 'VARCHAR(128)', nullable: false, description: 'User responsible' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Exact audit timestamp' }
    ],
    indexes: ['CREATE INDEX idx_stock_prod_date ON stock_movements(product_id, created_at DESC);']
  },
  {
    name: 'deliveries',
    description: 'Fleet logistics, driver route dispatch, and proof of site delivery',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, primaryKey: true, description: 'Delivery trip ID' },
      { name: 'delivery_number', type: 'VARCHAR(64)', nullable: false, description: 'Dispatch manifest number' },
      { name: 'invoice_id', type: 'UUID', nullable: false, references: 'invoices(id)', description: 'Related sales bill' },
      { name: 'driver_name', type: 'VARCHAR(128)', nullable: false, description: 'Assigned company driver' },
      { name: 'truck_number', type: 'VARCHAR(64)', nullable: false, description: 'Fleet vehicle plate / specification' },
      { name: 'dispatched_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Depot departure time' },
      { name: 'delivered_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Site offloading completion' },
      { name: 'status', type: 'VARCHAR(32)', nullable: false, description: 'Pending, Loaded, Out for Delivery, Delivered, Returned' },
      { name: 'delivery_charge', type: 'NUMERIC(10,2)', nullable: false, description: 'Billed freight fee' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_deliv_num ON deliveries(delivery_number);', 'CREATE INDEX idx_deliv_status ON deliveries(status);']
  }
];

export const postgresDDL = `-- ==========================================================
-- SIKA MATERIALOPS - POSTGRESQL PRODUCTION DDL SCHEMA
-- Compatible with Cloud SQL, Supabase & Standard PostgreSQL 15+
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Master Catalog
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    packaging VARCHAR(64) NOT NULL,
    purchase_cost NUMERIC(12,2) NOT NULL CHECK (purchase_cost >= 0),
    selling_price NUMERIC(12,2) NOT NULL CHECK (selling_price >= purchase_cost),
    min_selling_price NUMERIC(12,2) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 20,
    max_discount_pct NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    location_rack VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customers & Contractors
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(128),
    address TEXT,
    type VARCHAR(32) NOT NULL DEFAULT 'Contractor',
    credit_limit NUMERIC(12,2) NOT NULL DEFAULT 0,
    outstanding_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
    payment_terms_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(128),
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(128),
    address TEXT,
    lead_time_days INTEGER NOT NULL DEFAULT 3,
    outstanding_payable NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Sales Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    total_discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    delivery_charge NUMERIC(12,2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    total_cogs NUMERIC(12,2) NOT NULL,
    net_profit NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'Credit',
    payment_method VARCHAR(32) NOT NULL DEFAULT 'Credit',
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    outstanding_amount NUMERIC(12,2) NOT NULL,
    sales_person VARCHAR(128),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Invoice Line Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(12,2) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    line_total NUMERIC(12,2) NOT NULL,
    line_profit NUMERIC(12,2) NOT NULL
);

-- 6. Stock Movements (Audit Ledger)
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    movement_type VARCHAR(32) NOT NULL,
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference_doc VARCHAR(64) NOT NULL,
    reason TEXT,
    performed_by VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Delivery Logistics
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_number VARCHAR(64) UNIQUE NOT NULL,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    driver_name VARCHAR(128) NOT NULL,
    truck_number VARCHAR(64) NOT NULL,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_reorder ON products(current_stock) WHERE current_stock <= reorder_level;
CREATE INDEX idx_invoices_customer ON invoices(customer_id, date DESC);
CREATE INDEX idx_stock_movements_prod ON stock_movements(product_id, created_at DESC);
`;
