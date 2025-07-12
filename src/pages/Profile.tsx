import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Clock, Globe, Lock, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const { user, updateProfile, isLoggedIn } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availability: '',
    photo: '',
    profileVisibility: 'public' as 'public' | 'private',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[]
  });
  
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location,
        availability: user.availability,
        photo: user.photo,
        profileVisibility: user.profileVisibility,
        skillsOffered: [...user.skillsOffered],
        skillsWanted: [...user.skillsWanted]
      });
    }
  }, [user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(skill => skill !== skillToRemove)
    }));
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Your city, country"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo URL</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                    placeholder="https://example.com/your-photo.jpg"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <Clock className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Weekends">Weekends</SelectItem>
                      <SelectItem value="Evenings">Evenings</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {formData.profileVisibility === 'public' ? (
                      <Globe className="w-5 h-5 text-success" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor="visibility">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.profileVisibility === 'public' 
                          ? 'Your profile is visible to everyone' 
                          : 'Your profile is private'
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="visibility"
                    checked={formData.profileVisibility === 'public'}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        profileVisibility: checked ? 'public' : 'private' 
                      }))
                    }
                  />
                </div>

                {/* Skills Offered */}
                <div className="space-y-4">
                  <Label>Skills I Can Offer</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skillsOffered.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillOffered(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      placeholder="Add a skill you can teach"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                    />
                    <Button type="button" onClick={addSkillOffered} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="space-y-4">
                  <Label>Skills I Want to Learn</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillWanted(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      placeholder="Add a skill you want to learn"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                    />
                    <Button type="button" onClick={addSkillWanted} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button type="submit" variant="gradient" className="w-full">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview */}
        <div className="lg:col-span-1">
          <Card className="shadow-medium sticky top-24">
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img
                  src={formData.photo || user?.photo}
                  alt={formData.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-primary/20"
                />
                <h3 className="font-semibold text-lg">{formData.name || 'Your Name'}</h3>
                <p className="text-muted-foreground text-sm flex items-center justify-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {formData.location || 'Your Location'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.skillsOffered.length > 0 ? (
                      formData.skillsOffered.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No skills added yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Looking For</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.skillsWanted.length > 0 ? (
                      formData.skillsWanted.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No skills added yet</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  Available: {formData.availability || 'Not set'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};