interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "admin@restaurant.com",
    password: "password123",
    name: "Restaurant Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "manager@restaurant.com",
    password: "manager123",
    name: "Restaurant Manager",
    role: "manager",
  },
];

class MockAuth {
  private currentUser: User | null = null;

  async login(
    email: string,
    password: string,
    rememberMe = false
  ): Promise<LoginResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Store user session
    this.currentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Store in localStorage if remember me is checked
    if (rememberMe) {
      localStorage.setItem("restaurant_auth", JSON.stringify(this.currentUser));
    } else {
      sessionStorage.setItem(
        "restaurant_auth",
        JSON.stringify(this.currentUser)
      );
    }

    return {
      success: true,
      user: this.currentUser,
    };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("restaurant_auth");
    sessionStorage.removeItem("restaurant_auth");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check localStorage first
    const storedUser = localStorage.getItem("restaurant_auth");
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    // Check sessionStorage
    const sessionUser = sessionStorage.getItem("restaurant_auth");
    if (sessionUser) {
      this.currentUser = JSON.parse(sessionUser);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  async checkAuth(): Promise<boolean> {
    // Simulate API check
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.isAuthenticated();
  }
}

export const mockAuth = new MockAuth();
