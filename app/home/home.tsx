import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Toaster, toast } from "sonner";

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

  const normalizeUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);

      // Handle Instagram URLs, strip query parameters
      if (
        parsedUrl.hostname === "instagram.com" ||
        parsedUrl.hostname === "www.instagram.com"
      ) {
        return parsedUrl.origin + parsedUrl.pathname; // Only keep the base URL (origin + pathname)
      }

      // Handle "youtu.be" shortened URLs
      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.substring(1); // Extract video ID from pathname
        return `https://www.youtube.com/watch?v=${videoId}`; // Convert to full YouTube URL
      }

      // Normalize hostname to "www.youtube.com"
      if (
        parsedUrl.hostname === "youtube.com" ||
        parsedUrl.hostname === "www.youtube.com"
      ) {
        parsedUrl.hostname = "www.youtube.com";
      }

      // If it's a YouTube handle/profile URL (e.g., starts with "/@"), remove query parameters
      if (parsedUrl.pathname.startsWith("/@")) {
        return parsedUrl.origin + parsedUrl.pathname; // Exclude query parameters
      }

      // For all other types of YouTube URLs, preserve query parameters
      return parsedUrl.origin + parsedUrl.pathname + parsedUrl.search;
    } catch (err) {
      console.error("Invalid URL:", url);
      return "";
    }
  };

  const getVideoIdFromUrl = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url); // Parse the URL
      return parsedUrl.searchParams.get("v"); // Get the 'v' query parameter
    } catch (err) {
      console.error("Invalid URL:", url); // Log an error if the URL is invalid
      return null;
    }
  };

  const handleAddProfileLink = () => {
    if (profileLink.trim() !== "") {
      const normalizedLink = normalizeUrl(profileLink.trim()); // Normalize the link
      if (normalizedLink) {
        if (!profileLinks.includes(normalizedLink)) {
          setProfileLinks((prev) => [...prev, normalizedLink]); // Add only if it's not already in the list
        } else {
          toast.error("This profile link is already in the list.");
          // alert("This profile link is already in the list.");
        }
      } else {
        toast.error("Invalid YouTube profile link. Please check and try again.");
        // alert("Invalid YouTube profile link. Please check and try again.");
      }
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
      if (selectedLink.includes("watch?")) {
        const videoId = getVideoIdFromUrl(selectedLink);
        if (videoId !== null) {
          navigate(`/scenarios?video_id=${videoId}`);
        }
      } else {
        navigate(`/videos?link=${encodeURIComponent(selectedLink)}`);
      }
    } else {
      toast.error("Please select a link before proceeding.");
      // alert("Please select a link before proceeding.");
    }
  };

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 max-w-[360px] h-full">
        {/* Input Section */}
        <Label className="self-center text-2xl">Links</Label>
        <div className="flex gap-2">
          <Input
            className="w-[340px]"
            type="text"
            placeholder="Enter your link"
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
      <Toaster position="bottom-center" richColors />
    </main>
  );
}
