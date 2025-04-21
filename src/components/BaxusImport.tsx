
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { fetchBaxusBarData } from "@/services/baxusApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Info } from "lucide-react";
import { WhiskyBottle } from "@/types/whisky";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

interface BaxusImportProps {
  onImportComplete?: (bottles: WhiskyBottle[]) => void;
}

export default function BaxusImport({ onImportComplete }: BaxusImportProps) {
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

  // Load recent searches on component mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const { data, error } = await supabase
          .from('baxus_searches')
          .select('username')
          .order('searched_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data) {
          setRecentSearches(data.map(item => item.username));
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };
    
    loadRecentSearches();
  }, []);

  const saveSearch = async (username: string) => {
    try {
      const { error } = await supabase
        .from('baxus_searches')
        .upsert({
          username,
          searched_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update recent searches
      setRecentSearches(prev => 
        [username, ...prev.filter(u => u !== username)].slice(0, 5)
      );
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setImportError(null);
      
      // Fetch bar data from Baxus API
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
      
      // Save this search to the database
      await saveSearch(values.username);
      
      // Add username to each bottle for reference
      const bottlesWithUsername = barData.bottles.map(bottle => ({
        ...bottle,
        username: values.username
      }));
      
      // Get the current user's ID
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Store the data in Supabase if user is logged in
        const { error } = await supabase
          .from('user_bars')
          .upsert({
            user_id: session.user.id,
            username: values.username,
            bar_data: barData,
            last_fetched: new Date().toISOString(),
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Success!",
        description: `Imported ${barData.bottles.length} bottles from ${values.username}'s Baxus bar.`,
      });
      
      // Pass the imported bottles to the parent component
      if (onImportComplete) {
        onImportComplete(bottlesWithUsername);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to import bar data";
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
      <h2 className="text-2xl font-bold text-whisky-brown mb-6">Import Your Baxus Bar</h2>
      
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
      
      {recentSearches.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-whisky-wood mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(username => (
              <Badge 
                key={username} 
                className="cursor-pointer bg-whisky-amber/20 hover:bg-whisky-amber/40 text-whisky-brown"
                onClick={() => handleSelectRecent(username)}
              >
                {username}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
