import { useState, useEffect } from 'react';
import VerificationCamera from './verification-camera';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from 'lucide-react';
import { useGeolocation } from '@/app/hooks/use-geolocation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function PhotoVerification({ onComplete }) {
    const [capturedImage, setCapturedImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    const { location, loading: gpsLoading, error: gpsError, getLocation } = useGeolocation();
    const { toast } = useToast();

    useEffect(() => {
        // Start getting location immediately when this component mounts
        getLocation();
    }, []);

    const handleCapture = (imageData) => {
        setCapturedImage(imageData);
    };

    const handleSubmit = async () => {
        if (!capturedImage || !location) {
            toast({
                title: "Wait!",
                description: "Please capture a photo and ensure GPS location is ready.",
                variant: "destructive"
            });
            return;
        }

        setSubmitting(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        try {
            const response = await fetch(`${backendUrl}/api/verification/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    photoUrl: capturedImage,
                    location: { lat: location.lat, lng: location.lng },
                    deviceAccuracy: location.accuracy,
                    isMockGPS: location.isMock,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus(data.data);
                if (data.data.status === 'Verified') {
                    toast({ title: "Verified!", description: "Location verified successfully." });
                    onComplete(data.data);
                } else {
                    toast({ title: "Verification Failed", description: data.data.message || "Location mismatch.", variant: "destructive" });
                }
            } else {
                throw new Error(data.message || 'Verification failed');
            }

        } catch (error) {
            console.error("Verification error", error);
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setStatus(null);
        getLocation(); // Refresh location
    };

    if (status && status.status === 'Verified') {
        return (
            <div className="text-center p-8 space-y-4">
                <div className="text-green-500 text-6xl">✓</div>
                <h2 className="text-2xl font-bold">Verification Successful!</h2>
                <p>Confidence Score: {status.confidenceScore}%</p>
                <Button onClick={onComplete}>Continue</Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Verify Location</CardTitle>
                <CardDescription>
                    Please stand at your farm center and take a photo.
                    Ensure you have good GPS signal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {gpsError && (
                    <Alert variant="destructive">
                        <AlertTitle>GPS Error</AlertTitle>
                        <AlertDescription>{gpsError}. Please enable location permissions.</AlertDescription>
                    </Alert>
                )}

                {/* GPS Status Indicator */}
                <div className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <span>GPS Signal:</span>
                    {gpsLoading ? (
                        <span className="flex items-center text-yellow-600"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Mapped...</span>
                    ) : location ? (
                        <span className="text-green-600 font-medium">Ready ({location.accuracy?.toFixed(0)}m)</span>
                    ) : (
                        <span className="text-red-500">Not Ready</span>
                    )}
                </div>

                {!capturedImage ? (
                    <VerificationCamera
                        onCapture={handleCapture}
                        isLocationReady={!!location}
                    />
                ) : (
                    <div className="relative rounded-lg overflow-hidden">
                        <img src={capturedImage} alt="Captured" className="w-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs text-center">
                            Captured at {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                )}

                {status && status.status !== 'Verified' && (
                    <Alert variant="destructive">
                        <AlertTitle>Verification Failed</AlertTitle>
                        <AlertDescription>
                            Status: {status.status}. Score: {status.confidenceScore}. {status.message}
                        </AlertDescription>
                    </Alert>
                )}

            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                {capturedImage && (
                    <>
                        <Button variant="outline" onClick={handleRetake} disabled={submitting}>
                            <RefreshCcw className="mr-2 h-4 w-4" /> Retake
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Verify Now
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
