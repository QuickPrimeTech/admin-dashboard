import { Order } from "@/types/order";

// Helper to create dates
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(12, 0, 0, 0);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
dayAfter.setHours(18, 30, 0, 0);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const mockOrders: Order[] = [
  // Active orders
  {
    id: "1",
    orderNumber: "#4521",
    customerName: "Sarah Johnson",
    type: "delivery",
    status: "new",
    priority: "high",
    items: [
      {
        id: "1a",
        name: "Classic Burger",
        quantity: 2,
        price: 12.99,
        modifiers: ["No onions", "Extra cheese"],
      },
      { id: "1b", name: "Large Fries", quantity: 2, price: 4.99 },
      { id: "1c", name: "Chocolate Shake", quantity: 1, price: 5.99 },
    ],
    total: 41.95,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    estimatedTime: 25,
    deliveryAddress: "123 Main St, Apt 4B",
    specialInstructions: "Please ring doorbell twice",
  },
  {
    id: "2",
    orderNumber: "#4522",
    customerName: "Mike Chen",
    type: "pickup",
    status: "new",
    priority: "normal",
    items: [
      { id: "2a", name: "Veggie Wrap", quantity: 1, price: 10.99 },
      { id: "2b", name: "Caesar Salad", quantity: 1, price: 8.99 },
      { id: "2c", name: "Sparkling Water", quantity: 2, price: 2.49 },
    ],
    total: 24.96,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    estimatedTime: 15,
  },
  {
    id: "3",
    orderNumber: "#4520",
    customerName: "Emma Williams",
    type: "delivery",
    status: "preparing",
    priority: "normal",
    items: [
      {
        id: "3a",
        name: "Margherita Pizza",
        quantity: 1,
        price: 16.99,
        modifiers: ["Extra basil"],
      },
      { id: "3b", name: "Garlic Bread", quantity: 1, price: 5.99 },
      { id: "3c", name: "Tiramisu", quantity: 2, price: 7.99 },
    ],
    total: 38.96,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    estimatedTime: 30,
    deliveryAddress: "456 Oak Avenue",
  },
  {
    id: "4",
    orderNumber: "#4519",
    customerName: "James Rodriguez",
    type: "pickup",
    status: "preparing",
    priority: "high",
    items: [
      {
        id: "4a",
        name: "Chicken Wings (12pc)",
        quantity: 1,
        price: 14.99,
        modifiers: ["Buffalo sauce"],
      },
      { id: "4b", name: "Loaded Nachos", quantity: 1, price: 11.99 },
      { id: "4c", name: "Craft Beer", quantity: 2, price: 6.99 },
    ],
    total: 40.96,
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
    estimatedTime: 20,
  },
  {
    id: "5",
    orderNumber: "#4518",
    customerName: "Lisa Thompson",
    type: "pickup",
    status: "ready",
    priority: "normal",
    items: [
      { id: "5a", name: "Grilled Salmon", quantity: 1, price: 22.99 },
      { id: "5b", name: "Steamed Vegetables", quantity: 1, price: 6.99 },
      { id: "5c", name: "Lemon Tart", quantity: 1, price: 7.99 },
    ],
    total: 37.97,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: "6",
    orderNumber: "#4517",
    customerName: "David Park",
    type: "delivery",
    status: "ready",
    priority: "normal",
    items: [
      { id: "6a", name: "Pad Thai", quantity: 2, price: 13.99 },
      { id: "6b", name: "Spring Rolls", quantity: 1, price: 6.99 },
      { id: "6c", name: "Thai Iced Tea", quantity: 2, price: 3.99 },
    ],
    total: 42.95,
    createdAt: new Date(Date.now() - 32 * 60 * 1000),
    deliveryAddress: "789 Pine Street, Suite 200",
  },
  // Scheduled orders
  {
    id: "7",
    orderNumber: "#4523",
    customerName: "Alex Turner",
    type: "pickup",
    status: "new",
    priority: "scheduled",
    items: [
      { id: "7a", name: "Party Platter", quantity: 1, price: 89.99 },
      { id: "7b", name: "Soda (2L)", quantity: 3, price: 3.99 },
    ],
    total: 101.96,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    scheduledFor: tomorrow,
    estimatedTime: 45,
    specialInstructions: "Office party - need napkins and plates",
  },
  {
    id: "8",
    orderNumber: "#4524",
    customerName: "Rachel Green",
    type: "delivery",
    status: "new",
    priority: "scheduled",
    items: [
      { id: "8a", name: "Family Meal Deal", quantity: 1, price: 59.99 },
      { id: "8b", name: "Extra Sauce Pack", quantity: 2, price: 1.99 },
    ],
    total: 63.97,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    scheduledFor: dayAfter,
    deliveryAddress: "321 Elm Drive",
  },
  // Completed orders (past)
  {
    id: "9",
    orderNumber: "#4515",
    customerName: "John Smith",
    type: "pickup",
    status: "completed",
    priority: "normal",
    items: [
      { id: "9a", name: "BBQ Burger", quantity: 2, price: 14.99 },
      { id: "9b", name: "Onion Rings", quantity: 1, price: 5.99 },
    ],
    total: 35.97,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: "10",
    orderNumber: "#4514",
    customerName: "Maria Garcia",
    type: "delivery",
    status: "completed",
    priority: "high",
    items: [
      { id: "10a", name: "Sushi Combo", quantity: 1, price: 32.99 },
      { id: "10b", name: "Miso Soup", quantity: 2, price: 4.99 },
      { id: "10c", name: "Green Tea", quantity: 2, price: 2.99 },
    ],
    total: 48.95,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    deliveryAddress: "555 Maple Lane",
  },
  {
    id: "11",
    orderNumber: "#4510",
    customerName: "Tom Wilson",
    type: "pickup",
    status: "completed",
    priority: "normal",
    items: [{ id: "11a", name: "Breakfast Combo", quantity: 1, price: 12.99 }],
    total: 12.99,
    createdAt: yesterday,
    completedAt: yesterday,
  },
];
