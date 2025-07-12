import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Users, User, MessageSquare, Settings, LogOut, Home } from 'lucide-react';

export const Layout = () => {
  const { isLoggedIn, user, logout } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation Header */}
      <nav className="bg-card/80 backdrop-blur-md border-b shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link to="/profile">
                    <Button 
                      variant={isActive('/profile') ? 'default' : 'ghost'} 
                      size="sm"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  
                  <Link to="/swap-requests">
                    <Button 
                      variant={isActive('/swap-requests') ? 'default' : 'ghost'} 
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Requests
                    </Button>
                  </Link>

                  {user?.id === 1 && ( // Admin only
                    <Link to="/admin-dashboard">
                      <Button 
                        variant={isActive('/admin-dashboard') ? 'default' : 'ghost'} 
                        size="sm"
                      >
                        <Settings className="w-4 h-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <img 
                      src={user?.photo} 
                      alt={user?.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <Button onClick={logout} variant="outline" size="sm">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="gradient" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 SkillSwap Platform. Connect, Learn, Grow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};