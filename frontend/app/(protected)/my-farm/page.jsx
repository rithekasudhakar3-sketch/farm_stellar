"use client";

import { useEffect, useState } from 'react';
import FarmRegistrationForm from '@/components/features/farmer/farm-registration-form';
import PhotoVerification from '@/components/features/farmer/photo-verification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function MyFarmPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [farmDetails, setFarmDetails] = useState(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
            const res = await fetch(`${backendUrl}/api/verification/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStatus(data.status);
            setFarmDetails(data.farmDetails);
        } catch (error) {
            console.error("Error fetching status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleRegistrationComplete = (data) => {
        setStatus('Pending');
        setFarmDetails(data);
    };

    const handleVerificationComplete = () => {
        fetchStatus();
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Farm</h1>
                <p className="text-muted-foreground">
                    Manage your farm registration and verify your location to unlock features.
                </p>
            </div>

            {/* Status Indicator */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <StatusIcon status={status} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{status || 'Unknown'}</div>
                        <p className="text-xs text-muted-foreground">
                            Current verification state
                        </p>
                    </CardContent>
                </Card>
                {farmDetails && (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Land Size</CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{farmDetails.landSize} {farmDetails.unit}</div>
                                <p className="text-xs text-muted-foreground">
                                    Geofence Radius: {farmDetails.geofence?.radius}m
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Location</CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-mono">
                                    {farmDetails.farmLocation?.lat.toFixed(4)}, {farmDetails.farmLocation?.lng.toFixed(4)}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Main Action Area */}
            <div className="mt-8">
                {status === 'Not Registered' && (
                    <FarmRegistrationForm onComplete={handleRegistrationComplete} />
                )}

                {status === 'Pending' && (
                    <div className="space-y-6">
                        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <AlertTriangle className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
                                    <div>
                                        <h3 className="font-semibold text-lg text-yellow-900 dark:text-yellow-400">Verification Required</h3>
                                        <p className="text-yellow-800 dark:text-yellow-300">
                                            Your farm is registered but location is not verified.
                                            Please verify your location to access all features.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <PhotoVerification onComplete={handleVerificationComplete} />
                    </div>
                )}

                {status === 'Verified' && (
                    <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-green-900 dark:text-green-400">You are Verified!</h2>
                                <p className="text-green-700 dark:text-green-300 max-w-md mx-auto mt-2">
                                    Your farm location has been confirmed. You now have full access to marketplace and subsidies.
                                </p>
                            </div>
                            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                                Check Status
                            </Button>
                        </CardContent>
                    </Card>
                )}
                {(status === 'Rejected' || status === 'Flagged') && (
                    <div className="space-y-6">
                        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
                                    <div>
                                        <h3 className="font-semibold text-lg text-red-900 dark:text-red-400">Verification Failed</h3>
                                        <p className="text-red-800 dark:text-red-300">
                                            {status === 'Flagged'
                                                ? "Your verification was flagged for suspicious activity. Please contact support."
                                                : "Your verification photo location did not match your registered farm location."}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="text-center">
                            <p className="mb-4 text-muted-foreground">You can try verifying again if you are at the correct location.</p>
                            <Button onClick={() => setStatus('Pending')}>Retry Verification</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusIcon({ status }) {
    switch (status) {
        case 'Verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'Rejected':
        case 'Flagged': return <XCircle className="h-4 w-4 text-red-500" />;
        default: return <MapPin className="h-4 w-4 text-muted-foreground" />;
    }
}
