'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For redirecting the user after logout
import { CommonHelper } from "@/helper/helper";

const AutoLogout = () => {
    const router = useRouter();
    const idleTimeout = 60 * 3000;

    useEffect(() => {
        let timeoutId: string | number | NodeJS.Timeout | undefined;

        // Function to reset the inactivity timer
        const resetTimer = () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Clear the previous timer if any
            }
            timeoutId = setTimeout(() => {
                handleLogout();
            }, idleTimeout);
        };

        // Function to log the user out
        const handleLogout = () => {
            router.push("/auth/cover-lockscreen");
            CommonHelper.ErrorToaster('Logging out due to inactivity');
        };

        // Listen for user interactions
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);

        // Start the inactivity timer
        resetTimer();

        // Cleanup event listeners and timeout on component unmount
        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures the effect runs only once on mount

    return null; // This component does not render anything
};

export default AutoLogout;
