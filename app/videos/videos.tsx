import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { getVideos } from "~/services/services";

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

  useEffect(() => {
    // Fetch initial videos on component mount
    fetchVideos(0);
  }, []);

  const fetchVideos = (currentOffset: number) => {
    if (linkParam) {
      setLoading(true);
      getVideos(linkParam, currentOffset, 5)
        .then((res: any) => {
          if (res?.status === 200) {
            setVideos((prevVideos) => [...prevVideos, ...res.data.videos]);
            setOffset(res.data.next_offset || 0);
            setHasMore(res.data.next_offset !== null);
          }
        })
        .catch((err: any) => {
          console.log("Error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const openVideo = (video_id: string) => {
    window.open(`https://www.youtube.com/watch?v=${video_id}`, "_blank");
  };

  const handleLoadMore = () => {
    if (hasMore) {
      fetchVideos(offset); // Fetch the next batch of videos
    }
  };

  const handlePrev = () => {
    navigate(-1); // This will go back to the previous screen in history
  };

  const handleNext = () => {
    if (selectedVideoIndex !== -1) {
      const selectedVideo = videos[selectedVideoIndex];
      navigate(`/scenarios?video_id=${selectedVideo["video_id"]}`);
    } else {
      alert("Please select a video before proceeding.");
    }
  };

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 w-full h-full px-3">
        {/* Input Section */}
        <Label className="self-center text-2xl">Videos</Label>

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
                  src={video.thumbnail}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openVideo(video.video_id);
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
