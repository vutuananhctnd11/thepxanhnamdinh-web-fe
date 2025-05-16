import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { PhoneMissedIcon } from "lucide-react";

const VideoCall = ({ appId, channel, uid, onLeave }) => {
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localTracks, setLocalTracks] = useState({
    videoTrack: null,
    audioTrack: null,
  });
  const [remoteUser, setRemoteUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsConnecting(true);
        // console.log("Initializing Agora client...");
        // console.log("appId:", appId);
        // console.log("channel:", channel);
        // console.log("uid:", uid);

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        let token = "";
        try {
          const res = await fetchWithAuth(
            `${
              import.meta.env.VITE_API_URL
            }/call/token?channel=${channel}&uid=${uid}`,
            {
              method: "GET",
            }
          );
          const response = await res.json();

          if (response.status === "success") {
            token = response.data;
          }
        } catch (error) {
          console.log("Có lỗi khi gọi api: ", error);
        }

        clientRef.current = client;

        setupEventListeners(client);

        await client.join(appId, channel, token, uid);

        const [microphoneTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            {
              encoderConfig: "high_quality",
            },
            {
              encoderConfig: {
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
                frameRate: 30,
              },
            }
          );

        setLocalTracks({
          audioTrack: microphoneTrack,
          videoTrack: cameraTrack,
        });

        if (localVideoRef.current) {
          cameraTrack.play(localVideoRef.current);
        }

        await client.publish([microphoneTrack, cameraTrack]);
        console.log("Published local tracks successfully");

        setIsConnecting(false);
      } catch (error) {
        console.error("Error joining channel:", error);
        setIsConnecting(false);
        alert("Không thể tham gia cuộc gọi: " + error.message);
        onLeave();
      }
    };

    const setupEventListeners = (client) => {
      client.on("user-published", async (user, mediaType) => {
        console.log("Remote user published:", user.uid, mediaType);

        try {
          await client.subscribe(user, mediaType);
          console.log("Subscribed to remote user:", user.uid, mediaType);

          if (mediaType === "video") {
            setRemoteUser(user);
            if (remoteVideoRef.current) {
              user.videoTrack.play(remoteVideoRef.current);
            }
          }

          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        } catch (error) {
          console.error("Error subscribing to remote user:", error);
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        // console.log("Remote user unpublished:", user.uid, mediaType);

        if (mediaType === "video" && remoteVideoRef.current) {
          // Xóa hiển thị video từ xa khi người dùng hủy xuất bản
          if (remoteUser?.uid === user.uid) {
            remoteVideoRef.current.innerHTML = "";
          }
        }
      });

      client.on("user-left", (user) => {
        // console.log("Remote user left:", user.uid);

        if (remoteUser?.uid === user.uid) {
          setRemoteUser(null);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = "";
          }
        }
      });

      // client.on("exception", (event) => {
      //   console.warn("Agora exception:", event);
      // });
    };

    if (appId && channel && uid) {
      init();
    } else {
      // console.error("Missing required props for VideoCall");
      onLeave();
    }

    return () => {
      leaveCall();
    };
  }, [appId, channel, uid]);

  const leaveCall = async () => {
    try {
      if (localTracks.videoTrack) {
        localTracks.videoTrack.stop();
        localTracks.videoTrack.close();
      }
      if (localTracks.audioTrack) {
        localTracks.audioTrack.stop();
        localTracks.audioTrack.close();
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        console.log("Left channel successfully");
      }
    } catch (error) {
      console.error("Error during leave:", error);
    } finally {
      onLeave();
    }
  };

  const toggleAudio = async () => {
    if (localTracks.audioTrack) {
      if (isMuted) {
        await localTracks.audioTrack.setEnabled(true);
      } else {
        await localTracks.audioTrack.setEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localTracks.videoTrack) {
      if (isVideoOff) {
        await localTracks.videoTrack.setEnabled(true);
      } else {
        await localTracks.videoTrack.setEnabled(false);
      }
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white text-2xl">Đang kết nối...</div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4">
        {/* Another user*/}
        <div
          ref={remoteVideoRef}
          className="w-full md:w-3/4 h-96 md:h-3/4 bg-black/50 rounded-xl mb-4 md:mb-0 md:mr-4 relative flex items-center justify-center overflow-hidden"
        >
          {!remoteUser && (
            <div className="text-white/70 font-medium">
              Đang chờ người khác tham gia...
            </div>
          )}
        </div>

        {/* Me */}
        <div className="relative">
          <div
            ref={localVideoRef}
            className="w-64 h-48 bg-black/50 rounded-xl overflow-hidden"
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <span className="text-white">Camera đã tắt</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex justify-center items-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isVideoOff ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isVideoOff ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={leaveCall}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
        >
          <PhoneMissedIcon className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
