import { Loader2 } from "lucide-react";

interface LoadingIconProps {
  className?: string;
}

export function LoadingIcon({ className }: LoadingIconProps) {
  return <Loader2 className={`animate-spin h-8 w-8 text-blue-700 ${className}`} />;
}
