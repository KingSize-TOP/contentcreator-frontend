import { getApi, postApi } from "./apis";

export const getVideos = (link: string, offset: number, limit: number) =>
  getApi(`/videos?profile_url=${link}&offset=${offset}&limit=${limit}`);
export const getTranscript = (video_id: string) =>
  getApi(`/transcript_video?video_id=${video_id}`);
export const generateText = (transcription: string) =>
  getApi(`/generate_text?transcription=${transcription}`);
export const generateVideo = (
  text: string,
  avatar_id: string,
  voice_id: string
) =>
  postApi(
    "/generate_video", {text, avatar_id, voice_id}
  );
export const getAvatarList = () => getApi("/avatar_list");
export const getVoiceList = () => getApi("/voice_list");
export const getTaskStatus = (taskId: string) => {
  return getApi(`/task_status/${taskId}`);
};
