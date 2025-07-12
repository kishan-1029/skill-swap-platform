import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, Check, X, Trash2, User, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SwapRequests = () => {
  const { user, users, swapRequests, isLoggedIn, updateSwapRequestStatus, deleteSwapRequest } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('received');

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Filter requests
  const receivedRequests = swapRequests.filter(req => req.toUserId === user.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === user.id);

  const pendingReceived = receivedRequests.filter(req => req.status === 'pending');
  const acceptedReceived = receivedRequests.filter(req => req.status === 'accepted');
  const rejectedReceived = receivedRequests.filter(req => req.status === 'rejected');

  const pendingSent = sentRequests.filter(req => req.status === 'pending');
  const acceptedSent = sentRequests.filter(req => req.status === 'accepted');
  const rejectedSent = sentRequests.filter(req => req.status === 'rejected');

  const handleAccept = (requestId: string) => {
    updateSwapRequestStatus(requestId, 'accepted');
    toast({
      title: "Request accepted!",
      description: "You can now coordinate your skill exchange."
    });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequestStatus(requestId, 'rejected');
    toast({
      title: "Request rejected",
      description: "The request has been declined."
    });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
    toast({
      title: "Request deleted",
      description: "The request has been removed."
    });
  };

  const getUserById = (id: number) => users.find(u => u.id === id);

  const RequestCard = ({ request, type }: { request: any; type: 'sent' | 'received' }) => {
    const otherUser = getUserById(type === 'sent' ? request.toUserId : request.fromUserId);
    if (!otherUser) return null;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-warning/10 text-warning';
        case 'accepted': return 'bg-success/10 text-success';
        case 'rejected': return 'bg-destructive/10 text-destructive';
        default: return 'bg-muted';
      }
    };

    return (
      <Card key={request.id} className="shadow-soft hover:shadow-medium transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={otherUser.photo}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{otherUser.name}</h4>
                <p className="text-sm text-muted-foreground">{otherUser.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
              <Link to={`/user/${otherUser.id}`}>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Skill Exchange Details */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center flex-1">
                <p className="text-muted-foreground mb-1">
                  {type === 'sent' ? 'You offer' : 'They offer'}
                </p>
                <Badge variant="secondary">{request.offeredSkill}</Badge>
              </div>
              
              <ArrowUpDown className="w-4 h-4 text-muted-foreground mx-3" />
              
              <div className="text-center flex-1">
                <p className="text-muted-foreground mb-1">
                  {type === 'sent' ? 'You want' : 'They want'}
                </p>
                <Badge variant="outline">{request.wantedSkill}</Badge>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Message:</p>
            <p className="text-sm bg-background p-3 rounded border">{request.message}</p>
          </div>

          {/* Timestamp */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            {type === 'received' && request.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleAccept(request.id)}
                  variant="success"
                  size="sm"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(request.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {type === 'sent' && request.status === 'pending' && (
              <Button
                onClick={() => handleDelete(request.id)}
                variant="destructive"
                size="sm"
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
            
            {request.status !== 'pending' && (
              <Button
                onClick={() => handleDelete(request.id)}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
        <p className="text-muted-foreground">
          Manage your incoming and outgoing skill exchange requests
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="relative">
            Received
            {pendingReceived.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingReceived.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent
            {pendingSent.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingSent.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Received Requests */}
        <TabsContent value="received" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-warning" />
                Pending ({pendingReceived.length})
              </h3>
              <div className="space-y-4">
                {pendingReceived.length > 0 ? (
                  pendingReceived.map(request => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No pending requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Accepted */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Check className="w-4 h-4 mr-2 text-success" />
                Accepted ({acceptedReceived.length})
              </h3>
              <div className="space-y-4">
                {acceptedReceived.length > 0 ? (
                  acceptedReceived.map(request => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <Check className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No accepted requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Rejected */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <X className="w-4 h-4 mr-2 text-destructive" />
                Rejected ({rejectedReceived.length})
              </h3>
              <div className="space-y-4">
                {rejectedReceived.length > 0 ? (
                  rejectedReceived.map(request => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <X className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No rejected requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Sent Requests */}
        <TabsContent value="sent" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-warning" />
                Pending ({pendingSent.length})
              </h3>
              <div className="space-y-4">
                {pendingSent.length > 0 ? (
                  pendingSent.map(request => (
                    <RequestCard key={request.id} request={request} type="sent" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No pending requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Accepted */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Check className="w-4 h-4 mr-2 text-success" />
                Accepted ({acceptedSent.length})
              </h3>
              <div className="space-y-4">
                {acceptedSent.length > 0 ? (
                  acceptedSent.map(request => (
                    <RequestCard key={request.id} request={request} type="sent" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <Check className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No accepted requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Rejected */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <X className="w-4 h-4 mr-2 text-destructive" />
                Rejected ({rejectedSent.length})
              </h3>
              <div className="space-y-4">
                {rejectedSent.length > 0 ? (
                  rejectedSent.map(request => (
                    <RequestCard key={request.id} request={request} type="sent" />
                  ))
                ) : (
                  <Card className="shadow-soft">
                    <CardContent className="text-center py-8">
                      <X className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No rejected requests</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};