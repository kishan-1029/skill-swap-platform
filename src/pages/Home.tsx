import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Star, Users, ArrowLeft, ArrowRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const Home = () => {
  const { users, isLoggedIn } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter users based on search and availability
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.profileVisibility !== 'public' || user.banned) return false;
      
      const matchesSearch = searchTerm === '' || 
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = availabilityFilter === 'all' || 
        user.availability.toLowerCase() === availabilityFilter.toLowerCase();
      
      return matchesSearch && matchesAvailability;
    });
  }, [users, searchTerm, availabilityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const availabilityOptions = ['all', 'weekdays', 'weekends', 'evenings', 'flexible'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-strong mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Exchange Skills,
            <br />
            <span className="text-accent">Grow Together</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Connect with skilled professionals, learn new abilities, and share your expertise 
            in our vibrant skill-swapping community.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by skill name or person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option === 'all' ? 'All Availability' : option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {paginatedUsers.length} of {filteredUsers.length} profiles
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedUsers.map((user) => (
          <Card key={user.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {user.location}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="text-sm font-medium">{user.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Available: {user.availability}
              </div>
            </CardContent>
            
            <CardFooter className="pt-3">
              <div className="flex space-x-2 w-full">
                <Link to={`/user/${user.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Profile
                  </Button>
                </Link>
                
                {isLoggedIn ? (
                  <Link to={`/request?userId=${user.id}`} className="flex-1">
                    <Button variant="gradient" className="w-full" size="sm">
                      Request Swap
                    </Button>
                  </Link>
                ) : (
                  <Button variant="gradient" className="w-full" size="sm" disabled>
                    Login to Request
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};