import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGeolocation } from '@/app/hooks/use-geolocation';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export default function FarmRegistrationForm({ onComplete }) {
    const { location, loading: gpsLoading, error: gpsError, getLocation } = useGeolocation();
    const [landSize, setLandSize] = useState('');
    const [unit, setUnit] = useState('acres');
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleRegister = async () => {
        if (!landSize || !location) {
            toast({
                title: "Error",
                description: "Please enter land size and capture location.",
                variant: "destructive"
            });
            return;
        }

        setSubmitting(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        try {
            const response = await fetch(`${backendUrl}/api/farm/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    landSize: parseFloat(landSize),
                    unit,
                    farmLocation: { lat: location.lat, lng: location.lng },
                    deviceAccuracy: location.accuracy
                })
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Registration Successful",
                    description: "Your farm has been registered. Please proceed to verification."
                });
                onComplete(data.data);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error", error);
            toast({
                title: "Error",
                description: error.message || "Failed to register farm.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Register Your Farm</CardTitle>
                <CardDescription>Enter your land details and capture your current location at the center of your farm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="landSize">Land Size</Label>
                    <div className="flex gap-2">
                        <Input
                            id="landSize"
                            type="number"
                            placeholder="e.g. 2.5"
                            value={landSize}
                            onChange={(e) => setLandSize(e.target.value)}
                        />
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="acres">Acres</SelectItem>
                                <SelectItem value="hectares">Hectares</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Farm Location</Label>
                    <div className="p-4 border rounded-md bg-muted/50 flex flex-col items-center justify-center min-h-[100px]">
                        {location ? (
                            <div className="text-sm text-center">
                                <p className="font-medium text-green-600">Location Captured!</p>
                                <p className="text-muted-foreground">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
                                <p className="text-xs text-muted-foreground">Accuracy: {location.accuracy?.toFixed(1)}m</p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground text-sm">
                                {gpsError ? <span className="text-red-500">{gpsError}</span> : "Location not captured yet"}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={getLocation}
                            disabled={gpsLoading}
                        >
                            {gpsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {location ? "Update Location" : "Mark My Farm"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Stand at the center of your farm for best accuracy.
                    </p>
                </div>

                <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={!location || !landSize || submitting}
                >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit Registration
                </Button>
            </CardContent>
        </Card>
    );
}
