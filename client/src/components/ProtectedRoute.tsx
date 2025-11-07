interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Since we've removed authentication, this component simply renders its children
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
