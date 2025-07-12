import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, MessageSquare, ArrowLeft } from 'lucide-react';

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { users, isLoggedIn, user } = useApp();
  
  const profileUser = users.find(u => u.id === parseInt(id || '0'));

  if (!profileUser) {
    return <Navigate to="/" replace />;
  }

  const isOwnProfile = user?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-start space-x-6">
                <img
                  src={profileUser.photo}
                  alt={profileUser.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                      <div className="flex items-center space-x-4 text-muted-foreground mt-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profileUser.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-accent fill-current" />
                          {profileUser.rating} rating
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Available: {profileUser.availability}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Skills Offered */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Skills I Can Offer</CardTitle>
              </CardHeader>
              <CardContent>
                {profileUser.skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skillsOffered.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills listed yet</p>
                )}
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Skills I Want to Learn</CardTitle>
              </CardHeader>
              <CardContent>
                {profileUser.skillsWanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills listed yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1">
          <Card className="shadow-medium sticky top-24">
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOwnProfile && (
                <>
                  {isLoggedIn ? (
                    <Link to={`/request?userId=${profileUser.id}`} className="block">
                      <Button variant="gradient" className="w-full" size="lg">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Swap Request
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="gradient" className="w-full" size="lg" disabled>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Swap Request
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        <Link to="/login" className="text-primary hover:underline">
                          Login
                        </Link>{" "}
                        to send a swap request
                      </p>
                    </div>
                  )}
                </>
              )}

              {isOwnProfile && (
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Edit Profile
                  </Button>
                </Link>
              )}

              {/* Profile Stats */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Profile Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills Offered:</span>
                    <span className="font-medium">{profileUser.skillsOffered.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills Wanted:</span>
                    <span className="font-medium">{profileUser.skillsWanted.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 text-accent fill-current" />
                      {profileUser.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};