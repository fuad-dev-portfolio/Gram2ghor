"use client";
import React, { useState, useEffect, useCallback } from "react";

export default function Showcase() {
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(0);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/client/header/headers`);
                const data = await res.json();
                if (data.success) {
                    setHeaders(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Failed to fetch header images");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHeaders();
    }, [backendUrl]);

    useEffect(() => {
        if (headers.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % headers.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [headers.length]);

    const goTo = useCallback((index) => {
        setCurrent(index);
    }, []);

    if (loading) {
        return (
            <div className="mt-2 sm:mt-6 w-full h-[40vh] sm:h-[60vh] md:h-[80vh] flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm tracking-wide">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[40vh] sm:h-[60vh] md:h-[80vh] flex items-center justify-center bg-gray-100">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (headers.length === 0) {
        return (
            <div className="w-full h-[40vh] sm:h-[60vh] md:h-[80vh] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No header images available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {headers.map((header) => (
                    <div key={header._id} className="min-w-full flex-shrink-0">
                        {header.url ? (
                            <a href={header.url} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                    src={header.image}
                                    alt="Header"
                                    className="w-full h-[40vh] sm:h-[60vh] md:h-[80vh] object-cover"
                                />
                            </a>
                        ) : (
                            <img
                                src={header.image}
                                alt="Header"
                                className="w-full h-[40vh] sm:h-[60vh] md:h-[80vh] object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>

            {headers.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {headers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`rounded-full transition-all duration-300 focus:outline-none ${
                                index === current
                                    ? "w-5 sm:w-6 h-2 sm:h-3 bg-white shadow-md"
                                    : "w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            )}

            {headers.length > 1 && (
                <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            )}
        </div>
    );
}