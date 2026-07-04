export const stats = {
  mealsRescued: 128450,
  activeDonors: 342,
  partnerNgos: 58,
  volunteers: 214,
  citiesCovered: 12,
};

export const donations = [
  { id: "D-1042", item: "Cooked Rice & Curry", quantity: "40 servings", donor: "Green Leaf Restaurant", status: "pending", createdAt: "2026-07-04T08:30:00", pickupWindow: "10:00 AM - 12:00 PM" },
  { id: "D-1041", item: "Bakery Assortment", quantity: "60 units", donor: "Sunrise Bakery", status: "in_transit", createdAt: "2026-07-04T07:10:00", pickupWindow: "8:00 AM - 9:00 AM" },
  { id: "D-1040", item: "Packaged Sandwiches", quantity: "25 units", donor: "Corner Cafe", status: "delivered", createdAt: "2026-07-03T18:45:00", pickupWindow: "6:00 PM - 7:00 PM" },
  { id: "D-1039", item: "Fresh Produce Box", quantity: "15 crates", donor: "Wholesale Market Co.", status: "delivered", createdAt: "2026-07-03T14:20:00", pickupWindow: "2:00 PM - 4:00 PM" },
  { id: "D-1038", item: "Catering Surplus", quantity: "80 servings", donor: "Elite Events Catering", status: "pending", createdAt: "2026-07-03T11:00:00", pickupWindow: "12:00 PM - 1:00 PM" },
];

export const ngos = [
  { id: "N-01", name: "Hope Kitchen Foundation", city: "Bengaluru", capacity: "500 meals/day", verified: true },
  { id: "N-02", name: "Feed Forward Trust", city: "Mumbai", capacity: "350 meals/day", verified: true },
  { id: "N-03", name: "Anna Seva Society", city: "Chennai", capacity: "220 meals/day", verified: false },
];

export const volunteers = [
  { id: "V-01", name: "Ravi Kumar", zone: "Indiranagar", deliveriesCompleted: 84, status: "available" },
  { id: "V-02", name: "Priya Sharma", zone: "Koramangala", deliveriesCompleted: 61, status: "on_route" },
  { id: "V-03", name: "Arjun Mehta", zone: "Whitefield", deliveriesCompleted: 47, status: "available" },
  { id: "V-04", name: "Fatima Sheikh", zone: "HSR Layout", deliveriesCompleted: 102, status: "offline" },
];

export const pendingApprovals = [
  { id: "A-01", type: "NGO", name: "Anna Seva Society", submittedAt: "2026-07-03T09:00:00" },
  { id: "A-02", type: "Donor", name: "Spice Route Diner", submittedAt: "2026-07-03T15:20:00" },
  { id: "A-03", type: "Volunteer", name: "Sameer Iqbal", submittedAt: "2026-07-04T06:45:00" },
];

export const impactTimeline = [
  { month: "Feb", meals: 8200 },
  { month: "Mar", meals: 10450 },
  { month: "Apr", meals: 13800 },
  { month: "May", meals: 17650 },
  { month: "Jun", meals: 21900 },
];

export const activityFeed = [
  { id: 1, text: "Green Leaf Restaurant listed a new donation", time: "5 min ago" },
  { id: 2, text: "Ravi Kumar completed delivery D-1040", time: "22 min ago" },
  { id: 3, text: "Hope Kitchen Foundation confirmed pickup", time: "1 hr ago" },
  { id: 4, text: "New NGO application submitted: Anna Seva Society", time: "3 hrs ago" },
];
