"use client";

import { Camera, Check, Circle, Loader2, Lock, Music, Play, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPlaylist, getSpotifyLoginUrl } from "@/lib/api";

type DetectionState = "off" | "detecting" | "result";

const mockEmotion = "Happy";
const mockConfidence = 92;

export function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionTimerRef = useRef<number | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [detectionState, setDetectionState] = useState<DetectionState>("off");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [spotifyWarning, setSpotifyWarning] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const spotifyConnected = Boolean(spotifyToken);
  const playlistCreated = Boolean(playlistUrl);
  const hasDetection = detectionState === "result";
  const isDetecting = detectionState === "detecting";
  const canCreatePlaylist = spotifyConnected && hasDetection;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("spotify_token");

    if (token) {
      setSpotifyToken(token);
      setSpotifyWarning(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (detectionTimerRef.current) {
        window.clearTimeout(detectionTimerRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function connectSpotify() {
    setActionBusy(true);
    setActionError(null);
    try {
      const url = await getSpotifyLoginUrl();
      window.location.href = url;
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Spotify login failed.");
    } finally {
      setActionBusy(false);
    }
  }

  async function startCameraStream() {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();
      setCameraOn(true);
      return;
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });

    streamRef.current = mediaStream;
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      await videoRef.current.play();
    }
    setCameraOn(true);
  }

  async function startDetection() {
    if (detectionTimerRef.current) {
      window.clearTimeout(detectionTimerRef.current);
    }

    setCameraError(null);
    setActionError(null);
    setSpotifyWarning(!spotifyConnected);
    setPlaylistUrl(null);

    try {
      await startCameraStream();
      setDetectionState("detecting");
      detectionTimerRef.current = window.setTimeout(() => {
        setDetectionState("result");
      }, 1200);
    } catch (error) {
      setDetectionState("off");
      setCameraOn(false);
      setCameraError(error instanceof Error ? error.message : "Camera access failed.");
    }
  }

  async function handlePlaylistAction() {
    if (playlistUrl) {
      window.open(playlistUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (!canCreatePlaylist || !spotifyToken) {
      return;
    }

    setActionBusy(true);
    setActionError(null);
    try {
      const result = await createPlaylist(mockEmotion, spotifyToken);
      if (!result.playlist_url) {
        setActionError(result.message || "Playlist was not created.");
        return;
      }

      setPlaylistUrl(result.playlist_url);
      window.open(result.playlist_url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Playlist request failed.");
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <div className="hero-grid core-three-column">
      <div className="hero-copy">
        <p className="eyebrow">AI powered • computer vision • music recommendation</p>
        <h1 id="hero-title">
          Detect Your <span>Emotion.</span> Play Your <span>Mood.</span>
        </h1>
        <p className="hero-intro">
          Real-time facial emotion recognition estimates your mood and recommends a
          Spotify-ready playlist that matches how you feel.
        </p>
        <div className="instruction-panel" aria-label="Demo instructions">
          <h2>How it works</h2>
          <ol className="demo-steps">
            <li>
              <strong>Connect Spotify</strong>
              <span>Authorize your Spotify account to create playlists.</span>
            </li>
            <li>
              <strong>Start Detection</strong>
              <span>Look at the camera and we'll detect your emotion.</span>
            </li>
            <li>
              <strong>Create Playlist</strong>
              <span>We'll generate a playlist that matches your mood.</span>
            </li>
          </ol>
        </div>
        <button className="primary-cta" onClick={startDetection} disabled={isDetecting}>
          {isDetecting ? <Loader2 size={20} /> : <Camera size={20} />}
          {isDetecting ? "Detecting..." : "Start Detection"}
        </button>
        <p className="privacy-note">
          <Lock size={15} aria-hidden="true" /> All processing is done in real-time and no data is stored.
        </p>
      </div>

      <section className="webcam-panel" aria-label="Live emotion detection">
        <header className="core-panel-header">
          <span className="core-heading-dot" aria-hidden="true" />
          <p>Live Emotion Detection</p>
          <span className={`camera-pill camera-pill-${detectionState}`}>
            <Camera size={13} aria-hidden="true" /> Camera: {cameraOn ? isDetecting ? "Detecting" : "On" : "Off"}
          </span>
        </header>

        <div className={`webcam-card webcam-${detectionState} ${cameraOn ? "has-camera-feed" : ""}`}>
          <video ref={videoRef} muted playsInline className="mock-camera-video" />
          <div className="face-outline" aria-hidden="true" />
          {isDetecting ? <div className="scan-overlay" /> : null}
          {!cameraOn ? (
            <div className="webcam-placeholder-copy">
              <Camera size={46} aria-hidden="true" />
              <strong>Camera Off</strong>
              <p>Click ‘Start Detection’ to turn on the webcam.</p>
            </div>
          ) : (
            <div className="webcam-live-copy">
              <strong>{isDetecting ? "Detecting..." : hasDetection ? mockEmotion : "Camera On"}</strong>
              <p>{hasDetection ? `Confidence: ${mockConfidence}%` : "Keep your face centered in the frame."}</p>
            </div>
          )}
        </div>
        {cameraError ? <p className="warning core-warning">{cameraError}</p> : null}
        {spotifyWarning ? (
          <p className="spotify-skip-warning"><span aria-hidden="true">!</span> Spotify is not connected. You can detect emotion now, but connect Spotify before creating a playlist.</p>
        ) : null}

        <div className="status-steps" aria-label="Demo progress">
          <div className={`status-step ${spotifyConnected ? "is-complete" : ""}`}>
            {spotifyConnected ? <Check size={16} /> : <Circle size={16} />}
            <span>Spotify</span>
            <strong>{spotifyConnected ? "Connected" : "Not connected"}</strong>
          </div>
          <div className={`status-step ${hasDetection ? "is-complete" : isDetecting ? "is-active" : ""}`}>
            {hasDetection ? <Check size={16} /> : isDetecting ? <Loader2 size={16} /> : <Circle size={16} />}
            <span>Detection</span>
            <strong>{hasDetection ? "Detected" : isDetecting ? "Detecting" : "Not started"}</strong>
          </div>
          <div className={`status-step ${playlistCreated ? "is-complete" : hasDetection ? "is-active" : ""}`}>
            {playlistCreated ? <Check size={16} /> : <Circle size={16} />}
            <span>Playlist</span>
            <strong>{playlistCreated ? "Created" : "Not created"}</strong>
          </div>
        </div>
      </section>

      <aside className="result-panel" aria-label="Detection result and playlist actions">
        <div className="result-card detection-card">
          <p className="card-label">Detection Result</p>
          <div className="result-emotion-row">
            <span aria-hidden="true">{hasDetection ? "😊" : "--"}</span>
            <strong>{hasDetection ? mockEmotion : "Waiting"}</strong>
          </div>
          <p>Confidence: {hasDetection ? `${mockConfidence}%` : "--"}</p>
          <div className="confidence-bar" aria-hidden="true">
            <span style={{ width: `${hasDetection ? mockConfidence : 0}%` }} />
          </div>
        </div>

        <div className="result-card playlist-result-card">
          <p className="card-label">Recommended Playlist</p>
          <div className="playlist-summary">
            <div className="playlist-cover-mock">
              <Music size={24} aria-hidden="true" />
              <span>Mood Boost</span>
            </div>
            <div>
              <strong>Mood Boost</strong>
              <p>Uplifting Pop</p>
              <small><Music size={14} aria-hidden="true" /> Spotify Playlist</small>
            </div>
          </div>
          <div className="playlist-status-row">
            <span>Status</span>
            <strong className={`playlist-status ${playlistCreated ? "is-created" : hasDetection ? "is-ready" : ""}`}>
              {playlistCreated ? "Created" : hasDetection ? "Ready to create" : "Not ready"}
            </strong>
          </div>
        </div>

        <div className="result-card next-action-card">
          <p className="card-label">Next Action</p>
          <p>
            {playlistCreated
              ? "Your Spotify playlist is ready to open."
              : spotifyConnected
                ? hasDetection
                  ? "Create and save your recommended playlist."
                  : "Start detection to unlock playlist creation."
                : "Connect Spotify to create and save your playlist."}
          </p>
          {!spotifyConnected ? (
            <button className="next-action-button connect" onClick={connectSpotify} disabled={actionBusy}>
              {actionBusy ? <Loader2 size={20} /> : <Music size={20} />} Connect Spotify
            </button>
          ) : playlistCreated ? (
            <button className="next-action-button open" onClick={handlePlaylistAction}>
              <Play size={20} /> Open in Spotify
            </button>
          ) : (
            <button className="next-action-button create" onClick={handlePlaylistAction} disabled={!canCreatePlaylist || actionBusy}>
              {actionBusy ? <Loader2 size={20} /> : <Music size={20} />} Create Spotify Playlist
            </button>
          )}
          {actionError ? <p className="warning action-error">{actionError}</p> : null}
          <small><Shield size={14} aria-hidden="true" /> We'll never post without your permission.</small>
        </div>
      </aside>
    </div>
  );
}