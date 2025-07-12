import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Settings, 
  MessageSquare, 
  Star, 
  Ban, 
  UserCheck, 
  Check, 
  X,
  AlertCircle,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const { user, users, swapRequests, banUser, unbanUser, isLoggedIn } = useApp();
  const { toast } = useToast();
  const [announcement, setAnnouncement] = useState('');

  // Only allow admin (user with id 1) to access
  if (!isLoggedIn || !user || user.id !== 1) {
    return <Navigate to="/" replace />;
  }

  const handleBanUser = (userId: number) => {
    const targetUser = users.find(u => u.id === userId);
    banUser(userId);
    toast({
      title: "User banned",
      description: `${targetUser?.name} has been banned from the platform.`,
      variant: "destructive"
    });
  };

  const handleUnbanUser = (userId: number) => {
    const targetUser = users.find(u => u.id === userId);
    unbanUser(userId);
    toast({
      title: "User unbanned",
      description: `${targetUser?.name} has been unbanned.`,
    });
  };

  const sendAnnouncement = () => {
    if (announcement.trim()) {
      toast({
        title: "Announcement sent!",
        description: "Your announcement has been broadcast to all users.",
      });
      setAnnouncement('');
    }
  };

  // Mock skills data
  const mockSkills = [
    { id: 1, name: 'React', category: 'Programming', status: 'approved', submittedBy: 'John Doe' },
    { id: 2, name: 'Digital Marketing', category: 'Marketing', status: 'pending', submittedBy: 'Sarah Wilson' },
    { id: 3, name: 'Blockchain Development', category: 'Programming', status: 'pending', submittedBy: 'Alex Johnson' },
    { id: 4, name: 'UI/UX Design', category: 'Design', status: 'approved', submittedBy: 'Priya Sharma' },
    { id: 5, name: 'Content Writing', category: 'Writing', status: 'rejected', submittedBy: 'Maya Patel' },
  ];

  // Mock feedback data
  const mockFeedback = [
    { id: 1, user: 'Marc Demo', rating: 5, comment: 'Great platform for skill exchange!', date: '2024-01-15' },
    { id: 2, user: 'Sarah Wilson', rating: 4, comment: 'Love the interface, but needs more users.', date: '2024-01-14' },
    { id: 3, user: 'Alex Johnson', rating: 5, comment: 'Found my perfect skill exchange partner!', date: '2024-01-13' },
    { id: 4, user: 'Priya Sharma', rating: 3, comment: 'Good concept, but matching algorithm could be better.', date: '2024-01-12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, skills, and platform settings
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="swaps">Swaps</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-card p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <div className="bg-gradient-card p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                    <p className="text-2xl font-bold">{users.filter(u => !u.banned).length}</p>
                  </div>
                  <div className="bg-gradient-card p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Banned Users</h3>
                    <p className="text-2xl font-bold">{users.filter(u => u.banned).length}</p>
                  </div>
                  <div className="bg-gradient-card p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Public Profiles</h3>
                    <p className="text-2xl font-bold">{users.filter(u => u.profileVisibility === 'public').length}</p>
                  </div>
                </div>

                {/* User Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.photo}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{user.skillsOffered.length} offered</p>
                            <p>{user.skillsWanted.length} wanted</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-accent fill-current" />
                            <span>{user.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.id !== 1 && ( // Don't allow banning admin
                            <>
                              {user.banned ? (
                                <Button
                                  onClick={() => handleUnbanUser(user.id)}
                                  variant="success"
                                  size="sm"
                                >
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Unban
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleBanUser(user.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Ban
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Skill Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>{skill.category}</TableCell>
                      <TableCell>{skill.submittedBy}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(skill.status)}`}>
                          {skill.status.charAt(0).toUpperCase() + skill.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {skill.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => toast({ title: "Skill approved", description: `${skill.name} has been approved.` })}
                              variant="success"
                              size="sm"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => toast({ title: "Skill rejected", description: `${skill.name} has been rejected.` })}
                              variant="destructive"
                              size="sm"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Swaps Tab */}
        <TabsContent value="swaps" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Swap Requests Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Requests</h3>
                  <p className="text-2xl font-bold">{swapRequests.length}</p>
                </div>
                <div className="bg-gradient-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                  <p className="text-2xl font-bold">{swapRequests.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="bg-gradient-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  <p className="text-2xl font-bold">{swapRequests.filter(r => r.status === 'accepted').length}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Exchange</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swapRequests.slice(0, 10).map((request) => {
                    const fromUser = users.find(u => u.id === request.fromUserId);
                    const toUser = users.find(u => u.id === request.toUserId);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>{fromUser?.name || 'Unknown'}</TableCell>
                        <TableCell>{toUser?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {request.offeredSkill} ↔ {request.wantedSkill}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Announcement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Send important announcements to all platform users.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Announcement Message</label>
                  <Textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Enter your announcement message..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                
                <Button
                  onClick={sendAnnouncement}
                  variant="gradient"
                  disabled={!announcement.trim()}
                  className="w-full sm:w-auto"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>User Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{feedback.user}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating 
                                ? 'text-accent fill-current' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                    <p className="text-xs text-muted-foreground">{feedback.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};