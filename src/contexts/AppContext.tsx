import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  photo: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  profileVisibility: 'public' | 'private';
  rating: number;
  banned?: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: number;
  toUserId: number;
  offeredSkill: string;
  wantedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => void;
  sendSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt'>) => void;
  updateSwapRequestStatus: (requestId: string, status: 'accepted' | 'rejected') => void;
  deleteSwapRequest: (requestId: string) => void;
  banUser: (userId: number) => void;
  unbanUser: (userId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: 1,
    name: "Marc Demo",
    email: "marc@example.com",
    location: "Ahmedabad",
    photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Photoshop", "React"],
    skillsWanted: ["Excel", "Node.js"],
    availability: "Weekends",
    profileVisibility: "public",
    rating: 3.9
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    location: "Mumbai",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Python", "Data Analysis"],
    skillsWanted: ["Machine Learning", "AWS"],
    availability: "Evenings",
    profileVisibility: "public",
    rating: 4.5
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    location: "Bangalore",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["JavaScript", "Node.js"],
    skillsWanted: ["React Native", "Flutter"],
    availability: "Weekdays",
    profileVisibility: "public",
    rating: 4.2
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@example.com",
    location: "Delhi",
    photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["UI/UX Design", "Figma"],
    skillsWanted: ["Frontend Development", "Vue.js"],
    availability: "Weekends",
    profileVisibility: "public",
    rating: 4.8
  },
  {
    id: 5,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    location: "Chennai",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Digital Marketing", "SEO"],
    skillsWanted: ["Content Writing", "Social Media"],
    availability: "Flexible",
    profileVisibility: "public",
    rating: 4.1
  },
  {
    id: 6,
    name: "Maya Patel",
    email: "maya@example.com",
    location: "Pune",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Excel", "Data Visualization"],
    skillsWanted: ["SQL", "Tableau"],
    availability: "Weekdays",
    profileVisibility: "public",
    rating: 4.3
  },

  {
    id: 7,
    name: "John Doe",
    email: "john@example.com",
    location: "Surat",
    photo: "https://images.unsplash.com/photo-1502767089025-6572583495fe?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Flutter", "Firebase"],
    skillsWanted: ["Design", "Marketing"],
    availability: "Flexible",
    profileVisibility: "public",
    rating: 4.6
  },
  {
    id: 8,
    name: "Anjali Mehta",
    email: "anjali@example.com",
    location: "Rajkot",
    photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    skillsOffered: ["Vue.js", "TailwindCSS"],
    skillsWanted: ["Backend", "MongoDB"],
    availability: "Weekends",
    profileVisibility: "public",
    rating: 4.4
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load data from localStorage on app start
    const savedUser = localStorage.getItem('skillSwapUser');
    const savedRequests = localStorage.getItem('skillSwapRequests');
    const savedUsers = localStorage.getItem('skillSwapUsers');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
    
    if (savedRequests) {
      setSwapRequests(JSON.parse(savedRequests));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple login logic - in real app, this would validate against backend
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser && password === 'password') {
      setUser(existingUser);
      setIsLoggedIn(true);
      localStorage.setItem('skillSwapUser', JSON.stringify(existingUser));
      return true;
    }
    
    // For demo purposes, allow any email/password combination
    if (email && password) {
      const newUser: User = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        location: "Your City",
        photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face",
        skillsOffered: [],
        skillsWanted: [],
        availability: "Weekdays",
        profileVisibility: "public",
        rating: 0
      };
      
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('skillSwapUser', JSON.stringify(newUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('skillSwapUser');
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('skillSwapUser', JSON.stringify(updatedUser));
      
      // Update in users list too
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('skillSwapUsers', JSON.stringify(updatedUsers));
    }
  };

  const sendSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedRequests = [...swapRequests, newRequest];
    setSwapRequests(updatedRequests);
    localStorage.setItem('skillSwapRequests', JSON.stringify(updatedRequests));
  };

  const updateSwapRequestStatus = (requestId: string, status: 'accepted' | 'rejected') => {
    const updatedRequests = swapRequests.map(req =>
      req.id === requestId ? { ...req, status } : req
    );
    setSwapRequests(updatedRequests);
    localStorage.setItem('skillSwapRequests', JSON.stringify(updatedRequests));
  };

  const deleteSwapRequest = (requestId: string) => {
    const updatedRequests = swapRequests.filter(req => req.id !== requestId);
    setSwapRequests(updatedRequests);
    localStorage.setItem('skillSwapRequests', JSON.stringify(updatedRequests));
  };

  const banUser = (userId: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, banned: true } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('skillSwapUsers', JSON.stringify(updatedUsers));
  };

  const unbanUser = (userId: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, banned: false } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('skillSwapUsers', JSON.stringify(updatedUsers));
  };

  return (
    <AppContext.Provider value={{
      user,
      users,
      swapRequests,
      isLoggedIn,
      login,
      logout,
      updateProfile,
      sendSwapRequest,
      updateSwapRequestStatus,
      deleteSwapRequest,
      banUser,
      unbanUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};