import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const { login, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isLoggedIn) {
    return <Navigate to="/swap-requests" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/swap-requests');
    } else {
      setError('Invalid credentials. Try any email with password "password"');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your SkillSwap account
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Instructions */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Demo Instructions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use any email address</li>
                <li>• Password: <span className="font-mono bg-background px-1 rounded">password</span></li>
                <li>• Or try: marc@example.com for admin access</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Don't have an account? Create one by logging in with any email!</p>
        </div>
      </div>
    </div>
  );
};