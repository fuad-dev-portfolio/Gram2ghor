"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Link href="/">
                <Image src="/logo.png" alt="Dashboard" width={200} height={200} />
            </Link>
            <h2>Admin Dashboard</h2>
        </div>
    )
}