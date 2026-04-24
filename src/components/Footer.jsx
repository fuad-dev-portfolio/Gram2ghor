"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section - Logo & Info */}
                    <div>
                        <div className="mb-4">
                            <Image
                                src="/logo.png"
                                alt="Gram2Ghor Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-gray-300 mb-4">
                            Gram2ghor is an e-commerce platform dedicated to providing safe and reliable food to every home.
                        </p>
                        <div className="space-y-2 text-gray-300">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-emerald-500" />
                                <span>Rampura, Dhaka, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiPhone className="text-emerald-500" />
                                <span>09642922922</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail className="text-emerald-500" />
                                <span>contact@ghorerbazar.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section - Customer Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/corporate-deal" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Corporate deal
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-returns" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Refund and returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section - Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Information</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-condition" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Terms & Condition
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-gray-300 hover:text-emerald-500 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom - Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Gram2ghor. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}