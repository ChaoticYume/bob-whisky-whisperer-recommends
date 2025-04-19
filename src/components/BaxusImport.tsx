
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchBaxusBarData } from "@/services/baxusApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export default function BaxusImport() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Fetch bar data from Baxus API
      const barData = await fetchBaxusBarData(values.username);
      
      // Get the current user's ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to import bar data");
      }
      
      // Store the data in Supabase
      const { error } = await supabase
        .from('user_bars')
        .upsert({
          user_id: session.user.id,
          username: values.username,
          bar_data: barData,
          last_fetched: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your Baxus bar data has been imported successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import bar data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-whisky-brown mb-6">Import Your Baxus Bar</h2>
      
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
    </div>
  );
}
