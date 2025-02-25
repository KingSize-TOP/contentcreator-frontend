import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";

export function Home() {
  const [profileLink, setProfileLink] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [profileLinks, setProfileLinks] = useState<string[]>([]);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Load profile links from local storage on component mount
  useEffect(() => {
    const storedLinks = localStorage.getItem("profileLinks");
    if (storedLinks) {
      setProfileLinks(JSON.parse(storedLinks)); // Parse and set the stored links
    }
  }, []);

  // Update local storage whenever profileLinks changes
  useEffect(() => {
    if (profileLinks.length > 0) {
      localStorage.setItem("profileLinks", JSON.stringify(profileLinks)); // Store the links in local storage
    }
  }, [profileLinks]);

  const handleAddProfileLink = () => {
    if (profileLink.trim() !== "") {
      setProfileLinks((prev) => [...prev, profileLink]); // Add the new profile link
      setProfileLink(""); // Clear the input field after adding
    }
  };

  const handleDeleteLink = (index: number) => {
    setProfileLinks((prev) => prev.filter((_, i) => i !== index)); // Remove the link at the given index
    if (selectedIndex === index) {
      setSelectedIndex(-1); // Reset selectedIndex if the deleted link was selected
    }
  };

  const handleNext = () => {
    if (selectedIndex !== -1) {
      const selectedLink = profileLinks[selectedIndex];
      navigate(`/videos?link=${encodeURIComponent(selectedLink)}`);
    } else {
      alert("Please select a profile link before proceeding.");
    }
  };

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 max-w-[360px] h-full">
        {/* Input Section */}
        <Label className="self-center text-2xl">Profile Links</Label>
        <div className="flex gap-2">
          <Input
            className="w-[340px]"
            type="text"
            placeholder="Enter your profile link"
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
          />
          <Button onClick={handleAddProfileLink}>Add</Button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1">
          <ScrollArea className="h-full w-full rounded-md border">
            {profileLinks.map((link, index) => (
              <div
                key={index}
                className={`${
                  selectedIndex === index ? "bg-[#eee]" : ""
                } flex py-2 gap-2 px-3`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="text-sm w-full">{link}</div>
                <Trash2
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the `onClick` for selecting the link
                    handleDeleteLink(index);
                  }}
                />
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Button at the Bottom */}
        <div className="mt-auto self-center">
          <Button className="w-40 self-center" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
