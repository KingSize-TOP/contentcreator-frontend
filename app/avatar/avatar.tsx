import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  generateVideo,
  getAvatarList,
  getTaskStatus,
  getVoiceList,
} from "~/services/services";

export function Avatar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [searchParams] = useSearchParams(); // useSearchParams hook to get URL parameters
  const transcript = searchParams.get("transcript");

  const [avatarList, setAvatarList] = useState([]);
  const [voiceList, setVoiceList] = useState([]);
  const [filteredVoiceList, setFilteredVoiceList] = useState([]); // Filtered list of voices
  const [isLoading, setIsLoading] = useState(true); // Loading while fetching avatars/voices
  const [isGenerating, setIsGenerating] = useState(false); // Loading while generating video
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );

  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null); // Selected avatar
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null); // Selected voice
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null); // Playing video
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null); // Playing audio

  // Filters
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  useEffect(() => {
    // Set loading to true whenever fetching starts
    setIsLoading(true);

    // Fetch both avatar and voice lists
    Promise.all([
      getAvatarList()
        .then((res: any) => {
          if (res?.status === 200) {
            const filteredAvatars = res.data.filter(
              (avatar: any) => avatar.gender !== "unknown"
            );
            setAvatarList(filteredAvatars);
          }
        })
        .catch((err: any) => {
          console.error("Error fetching avatars");
        }),

      getVoiceList()
        .then((res: any) => {
          if (res?.status === 200) {
            const filteredVoices = res.data
              .filter(
                (voice: any) =>
                  voice.language !== "unknown" && voice.gender !== "unknown"
              )
              .map((voice: any) => ({
                ...voice,
                gender: voice.gender.toLowerCase(), // Normalize gender to lowercase
              }));
            setVoiceList(filteredVoices);
            setFilteredVoiceList(filteredVoices); // Initially, show all voices
          }
        })
        .catch((err: any) => {
          console.error("Error fetching voices");
        }),
    ]).finally(() => {
      // Set loading to false after both requests complete
      setIsLoading(false);
    });
  }, []);

  // Update the filtered voices list whenever filters change
  useEffect(() => {
    let filtered = voiceList;

    if (languageFilter !== "all") {
      filtered = filtered.filter(
        (voice: any) => voice.language === languageFilter
      );
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter((voice: any) => voice.gender === genderFilter);
    }

    setFilteredVoiceList(filtered);
  }, [languageFilter, genderFilter, voiceList]);

  const handleGenerateAvatar = () => {
    if (!selectedAvatarId || !selectedVoiceId || !transcript) {
      alert("Please select an avatar and a voice!");
      return;
    }
    setIsGenerating(true);
    generateVideo(transcript, selectedAvatarId, selectedVoiceId)
      .then((res: any) => {
        console.log(res);
        const taskId = res.data.task_id;
        pollTaskStatus(taskId);
      })
      .catch((err: any) => {
        console.error("Error starting video generation:", err);
        alert("Failed to start video generation.");
        setIsGenerating(false);
      });
  };

  const pollTaskStatus = (taskId: string) => {
    const interval = setInterval(() => {
      getTaskStatus(taskId)
        .then((statusRes: any) => {
          if (statusRes.data.status === "completed") {
            setGeneratedVideoUrl(statusRes.data.video_url); // Video is ready
            clearInterval(interval);
            setIsGenerating(false);
          } else if (statusRes.data.status === "failed") {
            alert(`Video generation failed: ${statusRes.data.error}`);
            clearInterval(interval);
            setIsGenerating(false);
          }
        })
        .catch((err: any) => {
          console.error("Error checking task status:", err);
          clearInterval(interval);
          setIsGenerating(false);
        });
    }, 5000); // Poll every 5 seconds
  };

  // Handle avatar selection
  const handleAvatarClick = (avatarId: string, playVideo: boolean) => {
    if (playVideo) {
      // Play video if the image is clicked
      setPlayingVideoId((prevId) => (prevId === avatarId ? null : avatarId));
    } else {
      // Select the avatar if the rest of the item is clicked
      setSelectedAvatarId(avatarId);
      setPlayingVideoId(null); // Stop video playback when selecting
    }
  };

  // Handle voice selection
  const handleVoiceClick = (voiceId: string, playAudio: boolean) => {
    if (playAudio) {
      // Play audio if the name is clicked
      setPlayingAudioId((prevId) => (prevId === voiceId ? null : voiceId));
    } else {
      // Select the voice if the rest of the item is clicked
      setSelectedVoiceId(voiceId);
      setPlayingAudioId(null); // Stop audio playback when selecting
    }
  };

  const handlePrev = () => {
    navigate(-1);
  };

  const handleNext = () => {};

  return (
    <main className="flex items-center justify-center pt-10 pb-4 h-screen">
      <div className="flex flex-col gap-4 min-h-0 w-full h-full px-4">
        {/* Input Section */}
        <Label className="self-center text-2xl">Avatar</Label>
        {/* Show Loading Spinner or Message */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading avatars and voices...</p>
          </div>
        ) : (
          <>
            {/* Avatars Section */}
            <div className="mt-4">
              <Label className="text-lg">Avatars</Label>
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {avatarList.map((avatar: any) => (
                  <div
                    key={avatar.avatar_id}
                    className={`flex flex-col gap-2 p-2 border-b ${
                      selectedAvatarId === avatar.avatar_id
                        ? "bg-gray-200" // Highlight the selected avatar
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Click on the image to play video */}
                      <img
                        src={avatar.preview_image_url}
                        alt={avatar.avatar_name}
                        className="w-12 h-12 rounded-md cursor-pointer"
                        onClick={() =>
                          handleAvatarClick(avatar.avatar_id, true)
                        }
                      />
                      {/* Click elsewhere to select the avatar */}
                      <div
                        className="flex flex-col flex-1 cursor-pointer"
                        onClick={() =>
                          handleAvatarClick(avatar.avatar_id, false)
                        }
                      >
                        <span className="font-semibold">
                          {avatar.avatar_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {avatar.gender}
                        </span>
                      </div>
                    </div>

                    {/* ReactPlayer to play video */}
                    {playingVideoId === avatar.avatar_id && (
                      <div className="mt-2">
                        <ReactPlayer
                          url={avatar.preview_video_url}
                          controls
                          playing
                          width="100%"
                          height="200px"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Voices Section */}
            <div className="mt-4">
              <Label className="text-lg">Voices</Label>
              {/* Filters */}
              <div className="flex gap-4 mb-3">
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Languages</option>
                  {[
                    ...new Set(voiceList.map((voice: any) => voice.language)),
                  ].map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>

                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Genders</option>
                  {[
                    ...new Set(voiceList.map((voice: any) => voice.gender)),
                  ].map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {filteredVoiceList.map((voice: any) => (
                  <div
                    key={voice.voice_id}
                    className={`flex flex-col gap-2 p-2 border-b ${
                      selectedVoiceId === voice.voice_id
                        ? "bg-gray-200" // Highlight the selected voice
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Click on the name to play audio */}
                      <span
                        className="font-semibold cursor-pointer"
                        onClick={() => handleVoiceClick(voice.voice_id, true)}
                      >
                        {voice.name}
                      </span>
                      {/* Click elsewhere to select the voice */}
                      <div
                        className="flex flex-1 cursor-pointer"
                        onClick={() => handleVoiceClick(voice.voice_id, false)}
                      >
                        <span className="text-xs text-gray-500">
                          {voice.language} | {voice.gender}
                        </span>
                      </div>
                    </div>

                    {/* Audio player */}
                    {playingAudioId === voice.voice_id && (
                      <audio controls autoPlay className="w-full">
                        <source src={voice.preview_audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Generate Avatar Button */}
        <Button
          className="w-full mt-4"
          onClick={handleGenerateAvatar}
          disabled={isGenerating} // Disable button while generating
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="loader border-t-4 border-white border-solid rounded-full w-5 h-5 animate-spin mr-2"></div>
              Generating...
            </div>
          ) : (
            "Generate Avatar"
          )}
        </Button>

        {/* Show Generated Video */}
        {generatedVideoUrl && (
          <ReactPlayer
            url={generatedVideoUrl}
            controls
            width="100%"
            height="200px"
            className="mt-4"
          />
        )}

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
