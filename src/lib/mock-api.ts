import {
  mockMenuItems,
  mockReservations,
  mockFAQs,
  mockPrivateEvents,
  mockGalleryItems,
  mockSocialMediaItems,
  mockRestaurantSettings,
} from "@/data/mock-data";

import {
  MenuItem,
  Reservation,
  FAQ,
  PrivateEvent,
  GalleryItem,
  SocialMediaItem,
  RestaurantSettings,
  ReservationStatus,
} from "@/types/mock-api";

// Generic type for update payloads
export const mockAPI = {
  // Menu Items
  getMenuItems: (): Promise<MenuItem[]> => Promise.resolve([...mockMenuItems]),
  createMenuItem: (
    item: Omit<MenuItem, "id" | "created_at">
  ): Promise<MenuItem> => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockMenuItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateMenuItem: (
    id: string,
    updates: Partial<MenuItem>
  ): Promise<MenuItem | undefined> => {
    const index = mockMenuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockMenuItems[index] = { ...mockMenuItems[index], ...updates };
    }
    return Promise.resolve(mockMenuItems[index]);
  },
  deleteMenuItem: (id: string): Promise<void> => {
    const index = mockMenuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockMenuItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Reservations
  getReservations: (): Promise<Reservation[]> =>
    Promise.resolve([...mockReservations]),
  updateReservationStatus: (
    id: string,
    status: ReservationStatus // 👈 enforce only valid statuses
  ): Promise<Reservation | undefined> => {
    const index = mockReservations.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockReservations[index].status = status;
    }
    return Promise.resolve(mockReservations[index]);
  },

  // FAQs
  getFAQs: (): Promise<FAQ[]> => Promise.resolve([...mockFAQs]),
  createFAQ: (faq: Omit<FAQ, "id" | "created_at">): Promise<FAQ> => {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockFAQs.push(newFAQ);
    return Promise.resolve(newFAQ);
  },
  updateFAQ: (id: string, updates: Partial<FAQ>): Promise<FAQ | undefined> => {
    const index = mockFAQs.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockFAQs[index] = { ...mockFAQs[index], ...updates };
    }
    return Promise.resolve(mockFAQs[index]);
  },
  deleteFAQ: (id: string): Promise<void> => {
    const index = mockFAQs.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockFAQs.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Private Events
  getPrivateEvents: (): Promise<PrivateEvent[]> =>
    Promise.resolve([...mockPrivateEvents]),
  updateEventStatus: (
    id: string,
    status: ReservationStatus // restrict to specific values
  ): Promise<PrivateEvent | undefined> => {
    const index = mockPrivateEvents.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockPrivateEvents[index].status = status;
    }
    return Promise.resolve(mockPrivateEvents[index]);
  },

  // Gallery
  getGalleryItems: (): Promise<GalleryItem[]> =>
    Promise.resolve([...mockGalleryItems]),
  createGalleryItem: (
    item: Omit<GalleryItem, "id" | "created_at">
  ): Promise<GalleryItem> => {
    const newItem: GalleryItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockGalleryItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateGalleryItem: (
    id: string,
    updates: Partial<GalleryItem>
  ): Promise<GalleryItem | undefined> => {
    const index = mockGalleryItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockGalleryItems[index] = { ...mockGalleryItems[index], ...updates };
    }
    return Promise.resolve(mockGalleryItems[index]);
  },
  deleteGalleryItem: (id: string): Promise<void> => {
    const index = mockGalleryItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockGalleryItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Social Media
  getSocialMediaItems: (): Promise<SocialMediaItem[]> =>
    Promise.resolve([...mockSocialMediaItems]),
  createSocialMediaItem: (
    item: Omit<SocialMediaItem, "id" | "created_at">
  ): Promise<SocialMediaItem> => {
    const newItem: SocialMediaItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockSocialMediaItems.push(newItem);
    return Promise.resolve(newItem);
  },
  updateSocialMediaItem: (
    id: string,
    updates: Partial<SocialMediaItem>
  ): Promise<SocialMediaItem | undefined> => {
    const index = mockSocialMediaItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockSocialMediaItems[index] = {
        ...mockSocialMediaItems[index],
        ...updates,
      };
    }
    return Promise.resolve(mockSocialMediaItems[index]);
  },
  deleteSocialMediaItem: (id: string): Promise<void> => {
    const index = mockSocialMediaItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockSocialMediaItems.splice(index, 1);
    }
    return Promise.resolve();
  },

  // Settings
  getRestaurantSettings: (): Promise<RestaurantSettings> =>
    Promise.resolve({ ...mockRestaurantSettings }),
  updateRestaurantSettings: (
    updates: Partial<RestaurantSettings>
  ): Promise<RestaurantSettings> => {
    Object.assign(mockRestaurantSettings, updates);
    return Promise.resolve({ ...mockRestaurantSettings });
  },

  // Mock file upload
  uploadFile: (file: File): Promise<string> => {
    return Promise.resolve(
      `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(
        file.name
      )}`
    );
  },
};
