import React from 'react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-light uppercase tracking-tight text-black border-b border-black/10 pb-4">
        Privacy Policy
      </h1>
      <p className="text-xs text-black/60 uppercase font-mono">Last Updated: March 2026</p>
      
      <div className="space-y-4 text-xs sm:text-sm text-black/80 font-light leading-relaxed">
        <p>
          At <strong>SAPIENS</strong>, we are committed to upholding your privacy and ensuring your personal information is managed with integrity. This Privacy Policy details the protocols we follow regarding the collection, handling, and protection of personal customer data.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">1. Data We Collect</h3>
        <p>
          We only gather necessary information required to fulfill your orders, provide dispatch tracking, and deliver customer assistance: contact details, delivery addresses, and order references.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">2. Security & Payment Integrity</h3>
        <p>
          We never store confidential financial card credentials on our servers. All sensitive data communication is conducted via authenticated SSL encryption protocols.
        </p>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-light uppercase tracking-tight text-black border-b border-black/10 pb-4">
        Terms of Service
      </h1>
      <p className="text-xs text-black/60 uppercase font-mono">Last Updated: March 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-black/80 font-light leading-relaxed">
        <p>
          Welcome to the official digital portal of <strong>SAPIENS</strong>. By browsing, placing orders, or interacting with our platform, you acknowledge and agree to comply with our commercial terms.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">1. Product Integrity & Pricing</h3>
        <p>
          All retail prices are shown in Indian Rupees (₹) and include statutory taxes. SAPIENS reserves the right to modify prices or correct typographic errors without prior notice.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">2. Order Acceptance</h3>
        <p>
          Placement of an order constitutes an offer to purchase. SAPIENS reserves the right to confirm or decline any consignment based on inventory availability and verification protocols.
        </p>
      </div>
    </div>
  );
}

export function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-light uppercase tracking-tight text-black border-b border-black/10 pb-4">
        Shipping & Delivery Policy
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-black/80 font-light leading-relaxed">
        <p>
          We partner with premium tier-one logistics networks (including BlueDart Express and Delhivery Air) to ensure your SAPIENS apparel arrives in pristine condition.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">Domestic Transit Times</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Metro Hubs:</strong> 2–3 business days</li>
          <li><strong>Rest of India:</strong> 4–6 business days</li>
        </ul>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">Shipping Rates</h3>
        <p>
          Complimentary shipping applies on all orders exceeding ₹3,000. Standard orders below ₹3,000 are subject to a nominal flat logistics charge of ₹150.
        </p>
      </div>
    </div>
  );
}

export function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-light uppercase tracking-tight text-black border-b border-black/10 pb-4">
        Returns & Sizing Exchanges
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-black/80 font-light leading-relaxed">
        <p>
          We provide a comprehensive 7-day door-to-door return and size exchange service from the delivery date.
        </p>
        <h3 className="text-base font-bold text-black uppercase tracking-wider pt-4">Eligibility Requirements</h3>
        <p>
          Garments must remain unworn, unwashed, and retained within original packaging with all architectural tags intact. Footwear must not show sole wear.
        </p>
      </div>
    </div>
  );
}
