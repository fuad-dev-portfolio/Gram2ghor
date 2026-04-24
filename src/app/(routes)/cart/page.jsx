"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    const getGuestId = () => {
        if (typeof window !== 'undefined') {
            let guestId = localStorage.getItem('guestId');
            if (!guestId) {
                guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                localStorage.setItem('guestId', guestId);
            }
            return guestId;
        }
        return null;
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const guestId = getGuestId();
            const res = await fetch(`${backendUrl}/api/client/cart/get`, {
                headers: { 'guest-id': guestId },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setCart(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        setUpdating(true);
        try {
            const guestId = localStorage.getItem('guestId');
            const res = await fetch(`${backendUrl}/api/client/cart/update`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'guest-id': guestId
                },
                credentials: 'include',
                body: JSON.stringify({ itemId, quantity })
            });
            const data = await res.json();
            if (data.success) {
                setCart(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        setUpdating(true);
        try {
            const guestId = localStorage.getItem('guestId');
            const res = await fetch(`${backendUrl}/api/client/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: { 'guest-id': guestId },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setCart(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-20 flex items-center justify-center">
                <p className="text-gray-500">Loading cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-20 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center">
                <FiShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-4">Add some products to get started</p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
                <span className="text-gray-500">{cart.items.length} items</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div key={item._id} className="bg-white border rounded-lg p-4 flex gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.product?.cover_image ? (
                                    <img
                                        src={item.product.cover_image}
                                        alt={item.product.firstName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.product?.firstName}</h3>
                                {item.weight && (
                                    <p className="text-sm text-gray-500">{item.weight}</p>
                                )}
                                <p className="text-emerald-600 font-bold mt-1">৳{item.price}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={updating}
                                        className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FiMinus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={updating}
                                        className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeItem(item._id)}
                                    disabled={updating}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                                <p className="font-bold text-gray-800">
                                    ৳{item.price * item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white border rounded-lg p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                    <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>৳{cart.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                            <span>Total</span>
                            <span>৳{cart.totalAmount}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/checkout')}
                        disabled={updating}
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}