// This file redirects to the new Home component
import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
