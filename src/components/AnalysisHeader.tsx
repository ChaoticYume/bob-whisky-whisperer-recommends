
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AnalysisHeaderProps {
  errorMessage: string | null;
}

export default function AnalysisHeader({ errorMessage }: AnalysisHeaderProps) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-whisky-brown mb-4">
        Analyze Your Whisky Collection
      </h1>
      <p className="text-whisky-wood/80">
        Upload your whisky collection data in CSV format, and Bob will analyze your preferences 
        and recommend new bottles that perfectly match your taste profile.
      </p>

      {errorMessage && (
        <Alert variant="destructive" className="mt-6 max-w-3xl mx-auto text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
