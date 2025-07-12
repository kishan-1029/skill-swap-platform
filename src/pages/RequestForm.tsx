import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RequestForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, users, isLoggedIn, sendSwapRequest } = useApp();
  const { toast } = useToast();
  
  const targetUserId = parseInt(searchParams.get('userId') || '0');
  const targetUser = users.find(u => u.id === targetUserId);
  
  const [formData, setFormData] = useState({
    offeredSkill: '',
    wantedSkill: '',
    message: ''
  });

  useEffect(() => {
    if (!targetUser || !isLoggedIn || !user) {
      return;
    }
    
    // Pre-fill if there are matching skills
    const matchingOffered = user.skillsOffered.find(skill => 
      targetUser.skillsWanted.includes(skill)
    );
    const matchingWanted = targetUser.skillsOffered.find(skill => 
      user.skillsWanted.includes(skill)
    );
    
    if (matchingOffered) {
      setFormData(prev => ({ ...prev, offeredSkill: matchingOffered }));
    }
    if (matchingWanted) {
      setFormData(prev => ({ ...prev, wantedSkill: matchingWanted }));
    }
  }, [targetUser, user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!targetUser) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.offeredSkill || !formData.wantedSkill || !formData.message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to send a swap request.",
        variant: "destructive"
      });
      return;
    }

    sendSwapRequest({
      fromUserId: user.id,
      toUserId: targetUser.id,
      offeredSkill: formData.offeredSkill,
      wantedSkill: formData.wantedSkill,
      message: formData.message.trim(),
      status: 'pending'
    });

    toast({
      title: "Request sent!",
      description: `Your swap request has been sent to ${targetUser.name}.`
    });

    navigate('/swap-requests');
  };

  // Get relevant skills for dropdowns
  const availableOfferedSkills = user.skillsOffered.filter(skill => 
    targetUser.skillsWanted.includes(skill)
  );
  const availableWantedSkills = targetUser.skillsOffered.filter(skill => 
    user.skillsWanted.includes(skill)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to={`/user/${targetUser.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Send Swap Request</h1>
        <p className="text-muted-foreground">
          Request a skill exchange with {targetUser.name}
        </p>
      </div>

      {/* Target User Info */}
      <Card className="shadow-soft mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <img
              src={targetUser.photo}
              alt={targetUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <p className="text-sm text-muted-foreground">{targetUser.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Skill Exchange Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill I Offer */}
            <div className="space-y-2">
              <Label htmlFor="offeredSkill">Skill I Can Offer</Label>
              <Select 
                value={formData.offeredSkill} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, offeredSkill: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill you can teach" />
                </SelectTrigger>
                <SelectContent>
                  {availableOfferedSkills.length > 0 ? (
                    availableOfferedSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))
                  ) : (
                    user.skillsOffered.map(skill => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {availableOfferedSkills.length === 0 && user.skillsOffered.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Note: {targetUser.name} isn't looking for your listed skills, but you can still make an offer.
                </p>
              )}
              {user.skillsOffered.length === 0 && (
                <p className="text-sm text-destructive">
                  You need to add skills to your profile first. 
                  <Link to="/profile" className="underline ml-1">Update profile</Link>
                </p>
              )}
            </div>

            {/* Skill I Want */}
            <div className="space-y-2">
              <Label htmlFor="wantedSkill">Skill I Want to Learn</Label>
              <Select 
                value={formData.wantedSkill} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, wantedSkill: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill you want to learn" />
                </SelectTrigger>
                <SelectContent>
                  {availableWantedSkills.length > 0 ? (
                    availableWantedSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))
                  ) : (
                    targetUser.skillsOffered.map(skill => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {availableWantedSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Note: This skill isn't in your wanted list, but you can still request it.
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Introduce yourself and explain why you'd like to exchange skills..."
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Tell {targetUser.name} a bit about yourself and why you're interested in this exchange.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={!formData.offeredSkill || !formData.wantedSkill || !formData.message.trim()}
              >
                Send Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Skill Compatibility */}
      {(availableOfferedSkills.length > 0 || availableWantedSkills.length > 0) && (
        <Card className="shadow-soft mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Perfect Match!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableOfferedSkills.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  You can offer skills they want:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableOfferedSkills.map(skill => (
                    <span key={skill} className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {availableWantedSkills.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  They can teach skills you want:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableWantedSkills.map(skill => (
                    <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};