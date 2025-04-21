
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import { WhiskyBottle } from "@/types/whisky";
import { generateRecommendations } from "@/utils/whiskyAnalysis";
import { getAiRecommendations } from "@/services/baxusApi";
import { useToast } from "@/hooks/use-toast";
import AnalysisHeader from "@/components/AnalysisHeader";
import AnalysisResults from "@/components/AnalysisResults";
import BaxusImport from "@/components/BaxusImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAnalyzeState from "@/hooks/useAnalyzeState";

const Analyze = () => {
  const {
    userBottles,
    recommendations,
    analysisComplete,
    isLoadingAi,
    errorMessage,
    setErrorMessage,
    setUserBottles,
    setRecommendations,
    setAnalysisComplete,
    setIsLoadingAi,
  } = useAnalyzeState();

  const { toast } = useToast();

  const handleFileUpload = async (bottles: WhiskyBottle[]) => {
    setErrorMessage(null);
    setUserBottles(bottles);

    if (bottles.length === 0) {
      setErrorMessage("Your uploaded collection is empty. Please upload a file with whisky bottle data.");
      return;
    }

    // Using mockDatabaseBottles from inside the hook for recommendations
    const newRecommendations = generateRecommendations(bottles, useAnalyzeState.mockDatabaseBottles);
    setRecommendations(newRecommendations);

    if (typeof window !== "undefined" && (window as any).updateWhiskyRecommendations) {
      (window as any).updateWhiskyRecommendations(newRecommendations);
    }

    setAnalysisComplete(true);

    toast({
      title: "Collection Processed",
      description: `Analyzed ${bottles.length} bottles and generated ${newRecommendations.length} recommendations.`,
    });

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBaxusImport = (bottles: WhiskyBottle[]) => {
    handleFileUpload(bottles);
  };

  const handleAiRecommendations = async () => {
    setErrorMessage(null);

    if (userBottles.length === 0) {
      setErrorMessage("Your whisky collection is empty. Please upload your collection first.");
      return;
    }

    try {
      setIsLoadingAi(true);

      const aiRecommendations = await getAiRecommendations(userBottles);

      if (!aiRecommendations || aiRecommendations.length === 0) {
        setErrorMessage("No AI recommendations could be generated. Try again or use the standard recommendations.");
        return;
      }

      const formattedRecommendations = aiRecommendations.map((rec: any) => ({
        bottle: {
          id: `ai-${Math.random().toString(36).substring(2, 9)}`,
          name: rec.name,
          distillery: rec.distillery,
          country: "AI Recommendation",
          type: "AI Recommendation",
          abv: 43,
          flavor_profile: rec.flavor_profile || {},
        },
        reason: rec.reason,
      }));

      setRecommendations(formattedRecommendations);

      if (typeof window !== "undefined" && (window as any).updateWhiskyRecommendations) {
        (window as any).updateWhiskyRecommendations(formattedRecommendations);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to get AI recommendations");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleBottleUpdate = (updatedBottle: WhiskyBottle) => {
    // Update bottle in userBottles if it exists there
    setUserBottles((prev) =>
      prev.map((bottle) => (bottle.id === updatedBottle.id ? updatedBottle : bottle))
    );

    // Update bottle in recommendations if it exists there
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.bottle.id === updatedBottle.id ? { ...rec, bottle: updatedBottle } : rec
      )
    );

    if (typeof window !== "undefined" && (window as any).updateWhiskyRecommendations) {
      (window as any).updateWhiskyRecommendations(
        recommendations.map((rec) =>
          rec.bottle.id === updatedBottle.id ? { ...rec, bottle: updatedBottle } : rec
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow whisky-bg py-8">
        <div className="container mx-auto px-4">
          <AnalysisHeader errorMessage={errorMessage} />

          <div className="mb-16">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                <TabsTrigger value="baxus">Import from Baxus</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FileUpload onUpload={handleFileUpload} />
              </TabsContent>
              <TabsContent value="baxus">
                <BaxusImport onImportComplete={handleBaxusImport} />
              </TabsContent>
            </Tabs>
          </div>

          {analysisComplete && (
            <AnalysisResults
              userBottles={userBottles}
              onGetAiRecommendations={handleAiRecommendations}
              isLoadingAi={isLoadingAi}
              onBottleUpdate={handleBottleUpdate}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
