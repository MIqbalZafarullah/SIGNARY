import { useEffect, useRef, useState } from 'react';
// File WASM MediaPipe dibundel bersama aplikasi (tanpa CDN pihak ketiga).
import wasmLoaderPath from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import wasmBinaryPath from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';

// Model resmi MediaPipe Hand Landmarker (sekitar 7,8 MB, diunduh sekali lalu di-cache browser).
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

let landmarkerPromise = null;

async function createLandmarker() {
  const { HandLandmarker } = await import('@mediapipe/tasks-vision');
  const fileset = { wasmLoaderPath, wasmBinaryPath };
  const options = (delegate) => ({
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: 'VIDEO',
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  try {
    return { landmarker: await HandLandmarker.createFromOptions(fileset, options('GPU')), connections: HandLandmarker.HAND_CONNECTIONS };
  } catch {
    // Sebagian perangkat tidak mendukung WebGL/GPU delegate: pakai CPU.
    return { landmarker: await HandLandmarker.createFromOptions(fileset, options('CPU')), connections: HandLandmarker.HAND_CONNECTIONS };
  }
}

function loadLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarker().catch((err) => {
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

const HAND_COLORS = { Left: '#22d3ee', Right: '#f97316' };

function draw(ctx, result, connections, w, h, colorOverride) {
  ctx.clearRect(0, 0, w, h);
  result.landmarks.forEach((points, i) => {
    const label = result.handedness?.[i]?.[0]?.categoryName;
    const color = colorOverride || HAND_COLORS[label] || '#38bdf8';
    ctx.lineWidth = Math.max(2, w / 220);
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    connections.forEach(({ start, end }) => {
      const a = points[start];
      const b = points[end];
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    });
    points.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, idx === 0 ? w / 110 : w / 170, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, w / 400);
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  });
}

/**
 * Tracking 21 titik sendi tangan secara langsung dari elemen <video>.
 * Semua pemrosesan gambar berjalan di perangkat pengguna.
 */
export default function useHandTracking(videoRef, canvasRef, enabled, { onResult, color } = {}) {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  // Callback & warna disimpan di ref agar loop tidak perlu dibuat ulang
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const colorRef = useRef(color);
  colorRef.current = color;
  const [handCount, setHandCount] = useState(0);
  const [fps, setFps] = useState(0);
  const lastCount = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      setHandCount(0);
      lastCount.current = 0;
      return undefined;
    }
    const canvasEl = canvasRef.current;
    let cancelled = false;
    let raf = 0;
    let lastVideoTime = -1;
    let frames = 0;
    let fpsStart = performance.now();

    setStatus('loading');
    loadLandmarker()
      .then(({ landmarker, connections }) => {
        if (cancelled) return;
        setStatus('ready');
        const loop = () => {
          if (cancelled) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
            if (video.currentTime !== lastVideoTime) {
              lastVideoTime = video.currentTime;
              const result = landmarker.detectForVideo(video, performance.now());
              draw(canvas.getContext('2d'), result, connections, canvas.width, canvas.height, colorRef.current);
              onResultRef.current?.(result);
              const count = result.landmarks.length;
              if (count !== lastCount.current) {
                lastCount.current = count;
                setHandCount(count);
              }
              frames += 1;
            }
            const now = performance.now();
            if (now - fpsStart >= 1000) {
              setFps(Math.round((frames * 1000) / (now - fpsStart)));
              frames = 0;
              fpsStart = now;
            }
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      canvasEl?.getContext('2d')?.clearRect(0, 0, canvasEl.width, canvasEl.height);
    };
  }, [enabled, videoRef, canvasRef]);

  return { status, handCount, fps };
}
