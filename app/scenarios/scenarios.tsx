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

  useEffect(() => {
    if (video_id) {
      // getTranscript(video_id)
      //   .then((res: any) => {
      //     if (res?.status === 200) {
      //       setTranscript(res?.data);
      //     }
      //   })
      //   .catch((err: any) => {
      //     console.log("Error");
      //   });
      setTranscript(`I've been spending millions of dollars trying to create the perfect diet. What I did is I asked all my organs of the body. Hey, heart liver and kidney, what do you need to be your best self? We looked at scientific evidence and this is the result a diet. Exactly mapped to produce 50, perfect biomarkers. My speed of Aging is currently slower than the average 10 year old. So let me show you what I do on a daily basis. When I wake up in the morning, I drink the Green Giant collagen peptides, cinnamon spermidine via chlorella powder. Amino acids, 57 pills. I didn't work out for 1 hour. I come back.
Back inside, I have super veggie which is a few pounds of broccoli, cauliflower, mushrooms, black lentils, ginger and garlic extra virgin olive oil. I have a very special type and 100% dark chocolate, which is bitter. And I pair this with the vegetables 1 hour, later nutty pudding, which is macadamia nuts. Walnuts flax seeds, berries, sunflower lechin, pea protein, an additional roughly 40 pills. I'll have a third meal of the day which includes vegetables, berries and nuts. And some more olive. Oil altogether is 2,000 calories.`);
    }
  }, [video_id]);

  const handleGenerateText = () => {
    generateText(transcript)
      .then((res: any) => {
        if (res?.status === 200) {
          setGeneratedText(res?.data);
        }
      })
      .catch((err: any) => {
        console.log("Error");
      });
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
      <div className="flex flex-col gap-4 min-h-0 max-w-[360px] h-full">
        {/* Input Section */}
        <Label className="self-center text-2xl">Scenarios</Label>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div
              className={`${
                selectedIndex === 0 ? "bg-[#666]" : "bg-[#eee]"
              } h-40 px-4 py-2`}
              onClick={() => setSelectedIndex(0)}
            >
              <Label
                className={`line-clamp-10 ${
                  selectedIndex === 0 ? "text-white" : "text-black"
                }`}
              >
                {transcript}
              </Label>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => handleGenerateText()}
            >
              Generate Text
            </Button>
            <div
              className={`${
                selectedIndex === 1 ? "bg-[#666]" : "bg-[#eee]"
              } h-40 px-4 py-2 mt-4`}
              onClick={() => setSelectedIndex(1)}
            >
              {generatedText.length > 0 && (
                <Label
                  className={`line-clamp-10 ${
                    selectedIndex === 1 ? "text-white" : "text-black"
                  }`}
                >
                  {generatedText[0]}
                </Label>
              )}
            </div>
            <div
              className={`${
                selectedIndex === 2 ? "bg-[#666]" : "bg-[#eee]"
              } h-40 px-4 py-2 mt-4`}
              onClick={() => setSelectedIndex(2)}
            >
              {generatedText.length > 0 && (
                <Label
                  className={`line-clamp-10 ${
                    selectedIndex === 2 ? "text-white" : "text-black"
                  }`}
                >
                  {generatedText[1]}
                </Label>
              )}
            </div>
            <div
              className={`${
                selectedIndex === 3 ? "bg-[#666]" : "bg-[#eee]"
              } h-40 px-4 py-2 mt-4`}
              onClick={() => setSelectedIndex(3)}
            >
              {generatedText.length > 0 && (
                <Label
                  className={`line-clamp-10 ${
                    selectedIndex === 3 ? "text-white" : "text-black"
                  }`}
                >
                  {generatedText[2]}
                </Label>
              )}
            </div>
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
