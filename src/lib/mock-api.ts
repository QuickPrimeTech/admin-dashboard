import {
  mockMenuItems,
  mockReservations,
  mockFAQs,
  mockPrivateEvents,
  mockGalleryItems,
  mockSocialMediaItems,
  mockRestaurantSettings,
} from "@/data/mock-data";

// Mock API functions
export const mockAPI = {
  // Menu Items
  getMenuItems: () => Promise.resolve([...mockMenuItems]),
  createMenuItem: (item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockMenuItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateMenuItem: (id: string, updates: any) => {
    const index = mockMenuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockMenuItems[index] = { ...mockMenuItems[index], ...updates };
    }
    return Promise.resolve(mockMenuItems[index]);
  },
  deleteMenuItem: (id: string) => {
    const index = mockMenuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockMenuItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Reservations
  getReservations: () => Promise.resolve([...mockReservations]),
  updateReservationStatus: (id: string, status: string) => {
    const index = mockReservations.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockReservations[index].status = status;
    }
    return Promise.resolve(mockReservations[index]);
  },

  // FAQs
  getFAQs: () => Promise.resolve([...mockFAQs]),
  createFAQ: (faq: any) => {
    const newFAQ = {
      ...faq,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockFAQs.push(newFAQ);
    return Promise.resolve(newFAQ);
  },
  updateFAQ: (id: string, updates: any) => {
    const index = mockFAQs.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockFAQs[index] = { ...mockFAQs[index], ...updates };
    }
    return Promise.resolve(mockFAQs[index]);
  },
  deleteFAQ: (id: string) => {
    const index = mockFAQs.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockFAQs.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Private Events
  getPrivateEvents: () => Promise.resolve([...mockPrivateEvents]),
  updateEventStatus: (id: string, status: string) => {
    const index = mockPrivateEvents.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockPrivateEvents[index].status = status;
    }
    return Promise.resolve(mockPrivateEvents[index]);
  },

  // Gallery
  getGalleryItems: () => Promise.resolve([...mockGalleryItems]),
  createGalleryItem: (item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockGalleryItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateGalleryItem: (id: string, updates: any) => {
    const index = mockGalleryItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockGalleryItems[index] = { ...mockGalleryItems[index], ...updates };
    }
    return Promise.resolve(mockGalleryItems[index]);
  },
  deleteGalleryItem: (id: string) => {
    const index = mockGalleryItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockGalleryItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Social Media
  getSocialMediaItems: () => Promise.resolve([...mockSocialMediaItems]),
  createSocialMediaItem: (item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockSocialMediaItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateSocialMediaItem: (id: string, updates: any) => {
    const index = mockSocialMediaItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockSocialMediaItems[index] = {
        ...mockSocialMediaItems[index],
        ...updates,
      };
    }
    return Promise.resolve(mockSocialMediaItems[index]);
  },
  deleteSocialMediaItem: (id: string) => {
    const index = mockSocialMediaItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockSocialMediaItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Settings
  getRestaurantSettings: () => Promise.resolve({ ...mockRestaurantSettings }),
  updateRestaurantSettings: (updates: any) => {
    Object.assign(mockRestaurantSettings, updates);
    return Promise.resolve({ ...mockRestaurantSettings });
  },

  // Mock file upload
  uploadFile: (file: File, path: string) => {
    return Promise.resolve(
      `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(
        file.name
      )}`
    );
  },
};
