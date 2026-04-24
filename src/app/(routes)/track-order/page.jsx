"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiPackage, FiCheck, FiTruck, FiClock } from "react-icons/fi";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        } else {
            fetchMyOrders();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/client/order/${orderId}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/client/order/list`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setOrder(data.data[0]);
            }
        } catch (err) {
            setError("No orders found");
        } finally {
            setLoading(false);
        }
    };

    const getStatusSteps = (status) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(status);
        return steps.map((step, index) => ({
            name: step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }));
    };

    const getStatusIcon = (step) => {
        switch (step) {
            case 'pending': return <FiClock className="w-5 h-5" />;
            case 'confirmed': return <FiCheck className="w-5 h-5" />;
            case 'processing': return <FiPackage className="w-5 h-5" />;
            case 'shipped': return <FiTruck className="w-5 h-5" />;
            case 'delivered': return <FiCheck className="w-5 h-5" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="w-full py-20 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Track Your Order</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID"
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={fetchOrder}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                        Track
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Track Your Order</h2>
                <p className="text-gray-500 mb-4">No order found</p>
            </div>
        );
    }

    const statusSteps = getStatusSteps(order.orderStatus);

    return (
        <div className="w-full py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Order</h1>
                <p className="text-gray-500 mb-6">Order ID: <span className="font-bold text-gray-800">{order.orderId}</span></p>

                <div className="bg-white border rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status</h2>
                    <div className="flex justify-between items-center">
                        {statusSteps.map((step, index) => (
                            <div key={step.name} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    step.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                    {getStatusIcon(step.name)}
                                </div>
                                <span className={`text-xs mt-1 capitalize ${
                                    step.completed ? 'text-emerald-600' : 'text-gray-400'
                                }`}>
                                    {step.name}
                                </span>
                                {index < statusSteps.length - 1 && (
                                    <div className={`absolute w-16 h-0.5 ${
                                        step.completed ? 'bg-emerald-600' : 'bg-gray-200'
                                    }`} style={{ left: `${index * 25 + 12}%` }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
                    <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">Name:</span> {order.customerName}</p>
                        <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                        <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                        {order.city && <p><span className="font-medium">City:</span> {order.city}</p>}
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
                    <div className="space-y-3">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.productImage && (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} x ৳{item.price}</p>
                                    <p className="font-bold">৳{item.totalPrice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>৳{order.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="w-full py-20 flex items-center justify-center">Loading...</div>}>
            <TrackOrderContent />
        </Suspense>
    );
}