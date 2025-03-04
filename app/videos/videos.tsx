import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import config from "~/services/apis/config";
import {
  getInstagramShortVideos,
  getInstagramVideos,
  getShortVideos,
  getVideos,
} from "~/services/services";

// Utility function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // Convert to "M" for millions
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"; // Convert to "K" for thousands
  }
  return num.toString(); // Return as-is if less than 1000
};

export function Videos() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [searchParams] = useSearchParams(); // useSearchParams hook to get URL parameters
  const linkParam = searchParams.get("link"); // Get the "link" parameter from the URL
  const [videos, setVideos] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [showShorts, setShowShorts] = useState(false); // State for "Short" checkbox

  useEffect(() => {
    // Fetch initial videos on component mount
    fetchVideos(0, showShorts);
  }, [showShorts]);

  const getVideoType = () => {
    if (linkParam?.includes("youtube")) {
      return "Youtube";
    } else {
      return "Instagram";
    }
  };

  const getInstagramUsername = (url: string): string => {
    try {
      const parsedUrl = new URL(url); // Parse the URL
      if (
        parsedUrl.hostname === "instagram.com" ||
        parsedUrl.hostname === "www.instagram.com"
      ) {
        const pathSegments = parsedUrl.pathname.split("/"); // Split the pathname by "/"
        return pathSegments[1]; // The username is the first segment (after the leading "/")
      }
      return ""; // Return null if it's not an Instagram URL
    } catch (err) {
      console.error("Invalid URL:", url);
      return ""; // Return null if the URL is invalid
    }
  };

  const fetchVideos = (currentOffset: number, isShort: boolean) => {
    if (linkParam) {
      setLoading(true);
      if (getVideoType() === "Youtube") {
        const fetchFunction = isShort ? getShortVideos : getVideos; // Decide API to call
        fetchFunction(linkParam, currentOffset, 5)
          .then((res: any) => {
            if (res?.status === 200) {
              setVideos((prevVideos) =>
                currentOffset === 0
                  ? res.data.videos
                  : [...prevVideos, ...res.data.videos]
              ); // Reset if fetching from 0
              setOffset(res.data.next_offset || 0);
              setHasMore(res.data.next_offset !== null);
            }
          })
          .catch((err: any) => {
            console.log("Error fetching videos:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        const fetchFunction = isShort ? getInstagramShortVideos : getInstagramVideos; // Decide API to call
        fetchFunction(getInstagramUsername(linkParam), currentOffset, 5)
          .then((res: any) => {
            if (res?.status === 200) {
              setVideos((prevVideos) =>
                currentOffset === 0
                  ? res.data.videos
                  : [...prevVideos, ...res.data.videos]
              ); // Reset if fetching from 0
              setOffset(res.data.next_offset || 0);
              setHasMore(res.data.next_offset !== null);
            }
          })
          .catch((err: any) => {
            console.log("Error fetching videos:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const openYoutubeVideo = (video_id: string) => {
    window.open(`https://www.youtube.com/watch?v=${video_id}`, "_blank");
  };

  const openInstagramVideo = (url: string) => {
    window.open(url, "_blank");
  }

  const handleLoadMore = () => {
    if (hasMore) {
      fetchVideos(offset, showShorts); // Fetch the next batch of videos
    }
  };

  const handlePrev = () => {
    navigate(-1); // This will go back to the previous screen in history
  };

  const handleNext = () => {
    if (selectedVideoIndex !== -1) {
      const selectedVideo = videos[selectedVideoIndex];
      if (getVideoType() === 'Youtube') {
        navigate(`/scenarios?type=Youtube&ref=${selectedVideo["video_id"]}`);
      } else {
        navigate(`/scenarios?type=Instagram&ref=${encodeURIComponent(selectedVideo["url"])}`);
      }
    } else {
      alert("Please select a video before proceeding.");
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setShowShorts(checked); // Update state for "Short" checkbox
    setVideos([]); // Reset the videos list when toggling between short and normal videos
    setOffset(0); // Reset the offset
  };

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 w-full h-full px-3">
        {/* Input Section */}
        <Label className="self-center text-2xl">Videos</Label>

        {/* Checkbox for "Short" videos */}
        <div className="flex items-center gap-2 self-center">
          <Checkbox
            id="short-videos"
            checked={showShorts}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="short-videos">Short Videos</Label>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full rounded-md border">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 px-2 py-2 ${
                  selectedVideoIndex === index ? "bg-[#eee]" : ""
                }`}
                onClick={(e) => setSelectedVideoIndex(index)}
              >
                <img
                  src={getVideoType() === 'Youtube' ? video.thumbnail:`${config.protocol}://${config.serverURL}/proxy-image?url=${encodeURIComponent(video.thumbnail)}`}
                  className="min-w-16 min-h-16 w-16 h-16 rounded-xl object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (getVideoType() === "Youtube") {
                      openYoutubeVideo(video.video_id);
                    } else {
                      openInstagramVideo(video.url);
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Label className="line-clamp-2">{video.title}</Label>
                  <div className="flex gap-2">
                    <Label>Views {formatNumber(video.views)}</Label>
                    <Label>Likes {formatNumber(video.likes)}</Label>
                    <Label>Duration {video.duration}</Label>
                  </div>
                </div>
              </div>
            ))}

            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex items-center gap-4 px-2 py-2 w-full"
                >
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-8 rounded-xl" />
                    <div className="flex gap-2">
                      <Skeleton className="w-24 h-4 rounded-xl" />
                      <Skeleton className="w-24 h-4 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </div>
        <div className="flex self-center gap-4 mt-auto">
          <Button
            className="w-40 self-center"
            onClick={handleLoadMore}
            disabled={loading || !hasMore}
          >
            {loading ? "Loading..." : "Load More..."}
          </Button>
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
