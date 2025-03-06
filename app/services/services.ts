import { getApi, postApi } from "./apis";

export const getVideos = (link: string) =>
  getApi(`/videos?profile_url=${link}`);
export const getShortVideos = (link: string) =>
  getApi(`/short_videos?profile_url=${link}`);
export const getTranscript = (video_id: string) =>
  getApi(`/transcript_video?video_id=${video_id}`);
export const generateText = (transcription: string) =>
  postApi("/generate_text", { transcription });
export const generateVideo = (
  text: string,
  avatar_id: string,
  voice_id: string
) => postApi("/generate_video", { text, avatar_id, voice_id });
export const getAvatarList = () => getApi("/avatar_list");
export const getVoiceList = () => getApi("/voice_list");
export const getTaskStatus = (taskId: string) => {
  return getApi(`/task_status/${taskId}`);
};
export const getInstagramVideos = (
  username: string
) =>
  getApi(`/insta_videos?username=${username}`);
export const getInstagramShortVideos = (
  username: string
) =>
  getApi(
    `/insta_short_videos?username=${username}`
  );
export const getInstaTranscript = (url: string) =>
  getApi(`/insta_transcript?url=${url}`);
