import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { generateText, getTranscript } from "~/services/services";

export function Scenarios() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [searchParams] = useSearchParams(); // useSearchParams hook to get URL parameters
  const video_id = searchParams.get("video_id");
  const [transcript, setTranscript] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (video_id) {
      setLoading(true);
      getTranscript(video_id)
        .then((res: any) => {
          if (res?.status === 200) {
            setTranscript(res?.data);
          }
        })
        .catch((err: any) => {
          console.log("Error");
        })
        .finally(() => {
          setLoading(false);
        });
      // setTranscript(`I've been spending millions of dollars trying to create the perfect diet. What I did is I asked all my organs of the body. Hey, heart liver and kidney, what do you need to be your best self? We looked at scientific evidence and this is the result a diet. Exactly mapped to produce 50, perfect biomarkers. My speed of Aging is currently slower than the average 10 year old. So let me show you what I do on a daily basis. When I wake up in the morning, I drink the Green Giant collagen peptides, cinnamon spermidine via chlorella powder. Amino acids, 57 pills. I didn't work out for 1 hour. I come back.
      // Back inside, I have super veggie which is a few pounds of broccoli, cauliflower, mushrooms, black lentils, ginger and garlic extra virgin olive oil. I have a very special type and 100% dark chocolate, which is bitter. And I pair this with the vegetables 1 hour, later nutty pudding, which is macadamia nuts. Walnuts flax seeds, berries, sunflower lechin, pea protein, an additional roughly 40 pills. I'll have a third meal of the day which includes vegetables, berries and nuts. And some more olive. Oil altogether is 2,000 calories.`);
    }
  }, [video_id]);

  const handleGenerateText = () => {
    if (transcript.length > 0) {
      setGenerating(true);
      generateText(transcript.substring(0, 650))
        .then((res: any) => {
          if (res?.status === 200) {
            setGeneratedText(res?.data);
          }
        })
        .catch((err: any) => {
          console.log("Error");
        })
        .finally(() => {
          setGenerating(false); // Set loading to false after the fetch is complete
        });
    }
  };

  const handlePrev = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (selectedIndex !== -1) {
      const selectedTranscript =
        selectedIndex === 0
          ? `I've been spending millions of dollars trying to create the perfect diet. What I did is I asked all my organs of the body. Hey, heart liver and kidney, what do you need to be your best self? We looked at scientific evidence and this is the result a diet. Exactly mapped to produce 50, perfect biomarkers. My speed of Aging is currently slower than the average 10 year old. So let me show you what I do on a daily basis. When I wake up in the morning, I drink the Green Giant collagen peptides, cinnamon spermidine via chlorella powder. Amino acids, 57 pills. I didn't work out for 1 hour. I come back.
Back inside, I have super veggie which is a few pounds of broccoli, cauliflower, mushrooms, black lentils, ginger and garlic extra virgin olive oil. I have a very special type and 100% dark chocolate, which is bitter. And I pair this with the vegetables 1 hour, later nutty pudding, which is macadamia nuts. Walnuts flax seeds, berries, sunflower lechin, pea protein, an additional roughly 40 pills. I'll have a third meal of the day which includes vegetables, berries and nuts. And some more olive. Oil altogether is 2,000 calories.`
          : generatedText[selectedIndex - 1];
      navigate(`/avatar?transcript=${encodeURIComponent(selectedTranscript)}`);
    } else {
      alert("Please select a transcript before proceeding.");
    }
  };

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 w-full max-w-md h-full px-4">
        {/* Input Section */}
        <Label className="self-center text-2xl">Scenarios</Label>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div
              className={`${
                selectedIndex === 0 ? "bg-[#666]" : "bg-[#eee]"
              } h-40 px-4 py-2 flex items-center justify-center`}
              onClick={() => setSelectedIndex(0)}
            >
              {loading ? (
                // Show loading indicator when loading
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                </div>
              ) : (
                // Show transcript when loading is complete
                <Label
                  className={`line-clamp-10 ${
                    selectedIndex === 0 ? "text-white" : "text-black"
                  }`}
                >
                  {transcript || "No transcript available"}
                </Label>
              )}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => handleGenerateText()}
              disabled={generating}
            >
              {generating ? "Loading..." : "Generate Text"}
            </Button>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${
                  selectedIndex === index + 1 ? "bg-[#666]" : "bg-[#eee]"
                } min-h-[160px] max-h-[320px] px-4 py-2 mt-4 flex items-center justify-center`}
                onClick={() => setSelectedIndex(index + 1)}
              >
                {generating ? (
                  // Show spinner when generating
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                ) : (
                  // Show generated text (if available) when done
                  <Label
                    className={`line-clamp-10 ${
                      selectedIndex === index + 1 ? "text-white" : "text-black"
                    }`}
                  >
                    {generatedText[index] || "No text generated yet"}
                  </Label>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Button at the Bottom */}
        <div className="flex gap-4 mt-3 pb-4">
          {/* Prev Button */}
          <Button className="flex-1" onClick={handlePrev}>
            Prev
          </Button>
          {/* Next Button */}
          <Button className="flex-1" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
