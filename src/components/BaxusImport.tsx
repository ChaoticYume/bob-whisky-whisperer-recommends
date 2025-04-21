
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { fetchBaxusBarData } from "@/services/baxusApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Info } from "lucide-react";
import { WhiskyBottle } from "@/types/whisky";
import RecentBaxusSearches from "./RecentBaxusSearches";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const RECENT_BAXUS_SEARCHES_KEY = "recent_baxus_searches";

interface BaxusImportProps {
  onImportComplete?: (bottles: WhiskyBottle[]) => void;
}

export default function BaxusImport({ onImportComplete }: BaxusImportProps) {
  // State for loading, error, and recent searches
  const [isLoading, setIsLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_BAXUS_SEARCHES_KEY);
    setRecentSearches(stored ? JSON.parse(stored) : []);
  }, []);

  const saveSearch = (username: string) => {
    setRecentSearches((prev) => {
      const searchList = [username, ...prev.filter((u) => u !== username)].slice(0, 5);
      localStorage.setItem(RECENT_BAXUS_SEARCHES_KEY, JSON.stringify(searchList));
      return searchList;
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setImportError(null);

      toast({
        title: "Fetching data",
        description: `Getting bar data for username: ${values.username}...`,
      });

      const barData = await fetchBaxusBarData(values.username);

      if (!barData || !barData.bottles || barData.bottles.length === 0) {
        setImportError("No bottles found in this Baxus bar");
        toast({
          title: "Empty Collection",
          description: "This Baxus profile doesn't have any bottles in its collection.",
          variant: "destructive",
        });
        return;
      }

      saveSearch(values.username);

      // Add username to each bottle for reference
      const bottlesWithUsername = barData.bottles.map((bottle: WhiskyBottle) => ({
        ...bottle,
        username: values.username,
      }));

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_bars')
          .upsert({
            user_id: session.user.id,
            username: values.username,
            bar_data: barData,
            last_fetched: new Date().toISOString(),
          });
      }

      toast({
        title: "Success!",
        description: `Imported ${barData.bottles.length} bottles from ${values.username}'s Baxus bar.`,
      });

      if (onImportComplete) onImportComplete(bottlesWithUsername);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import bar data";
      setImportError(errorMessage);
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecent = (username: string) => {
    form.setValue("username", username);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-whisky-brown mb-6">
        Import Your Baxus Bar
      </h2>

      {importError && (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Import Failed</AlertTitle>
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baxus Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Baxus username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-whisky-amber hover:bg-whisky-gold text-white"
            disabled={isLoading}
          >
            {isLoading ? "Importing..." : "Import Bar Data"}
          </Button>
        </form>
      </Form>

      <RecentBaxusSearches recentSearches={recentSearches} onSelect={handleSelectRecent} />
    </div>
  );
}
