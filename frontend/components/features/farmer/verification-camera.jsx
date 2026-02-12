import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';

const VerificationCamera = ({ onCapture, isLocationReady }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer rear camera
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Camera error:", err);
            setError("Unable to access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImage(dataUrl);
        stopCamera();
        onCapture(dataUrl);
    }, [stream, onCapture]);

    const retake = () => {
        setImage(null);
        startCamera();
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {error && <div className="text-red-500 font-medium">{error}</div>}

            <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-border">
                {!image ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!stream && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button onClick={startCamera} variant="outline">
                                    <Camera className="mr-2 h-4 w-4" /> Start Camera
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <img src={image} alt="Captured" className="w-full h-full object-cover" />
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-4">
                {stream && !image && (
                    <Button
                        onClick={capturePhoto}
                        disabled={!isLocationReady}
                        className="w-full"
                    >
                        {isLocationReady ? "Capture Photo" : "Waiting for GPS..."}
                    </Button>
                )}
                {image && (
                    <Button onClick={retake} variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> Retake
                    </Button>
                )}
            </div>
        </div>
    );
};

export default VerificationCamera;
