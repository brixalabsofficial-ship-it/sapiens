// Shared mock initial coupon codes
export const initialCoupons = [
  {
    id: "cpn-1",
    code: "SAPIENS10",
    discountType: "PERCENTAGE", // "PERCENTAGE" or "FIXED"
    discountValue: 10,
    minOrderValue: 2000,
    isActive: true,
    description: "10% off on sartorial collections above ₹2,000"
  },
  {
    id: "cpn-2",
    code: "FIRSTBUY",
    discountType: "FIXED",
    discountValue: 1500,
    minOrderValue: 5000,
    isActive: true,
    description: "Flat ₹1,500 off for first-time orders above ₹5,000"
  },
  {
    id: "cpn-3",
    code: "VIP20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 10000,
    isActive: true,
    description: "20% off on orders above ₹10,000"
  }
];
