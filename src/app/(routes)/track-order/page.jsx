"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPackage, FiCheck, FiTruck, FiClock, FiSearch, FiPhone, FiCalendar, FiAlertCircle } from "react-icons/fi";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [phone, setPhone] = useState(searchParams.get('phone') || '');
    const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        if (phone && !selectedOrder) {
            trackByPhone();
        }
    }, []);

    const trackByPhone = async () => {
        if (!phone) return;
        setLoading(true);
        setError(null);
        setSelectedOrder(null);
        try {
            const res = await fetch(`${backendUrl}/api/client/order/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setOrders(data.data);
            } else {
                setError("No orders found for this phone number");
                setOrders([]);
            }
        } catch (err) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusSteps = (status) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        if (status === 'cancelled') return [];
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

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: "bg-yellow-100 text-yellow-700", label: "Pending" },
            confirmed: { bg: "bg-blue-100 text-blue-700", label: "Confirmed" },
            processing: { bg: "bg-purple-100 text-purple-700", label: "Processing" },
            shipped: { bg: "bg-indigo-100 text-indigo-700", label: "Shipped" },
            delivered: { bg: "bg-green-100 text-green-700", label: "Delivered" },
            cancelled: { bg: "bg-red-100 text-red-700", label: "Cancelled" }
        };
        const style = styles[status] || styles.pending;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bg}`}>
                {style.label}
            </span>
        );
    };

    const isReturnAvailable = (order) => {
        if (!order.returnAvailableUntil) return false;
        return new Date(order.returnAvailableUntil) > new Date();
    };

    return (
        <div className="w-full py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Track Your Order</h1>

                {/* Search Form */}
                <div className="bg-white border rounded-lg p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FiPhone className="inline w-4 h-4 mr-1" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={trackByPhone}
                            disabled={loading || !phone}
                            className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <FiSearch className="w-5 h-5" />
                            {loading ? 'Searching...' : 'Track Order'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600 text-center">{error}</p>
                    </div>
                )}

                {/* Order List */}
                {orders.length > 0 && !selectedOrder && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Your Orders ({orders.length})</h2>
                        {orders.map((order, idx) => (
                            <div 
                                key={idx}
                                className="bg-white border rounded-lg p-4 cursor-pointer hover:border-emerald-500"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono font-medium text-gray-800">{order.orderId || order.orderId}</p>
                                        <p className="text-sm text-gray-500">{order.items?.length || 0} items - ৳{order.totalAmount}</p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.orderStatus)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Detail */}
                {selectedOrder && (
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-emerald-600 hover:text-emerald-700 text-sm"
                            >
                                ← Back to list
                            </button>
                            <span className="font-mono text-sm">{selectedOrder.orderId}</span>
                        </div>

                        {/* Status Progress */}
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Status</h2>
                            <div className="flex justify-between items-start relative">
                                {getStatusSteps(selectedOrder.orderStatus).map((step, index) => (
                                    <div key={step.name} className="flex flex-col items-center relative z-10">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            step.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {getStatusIcon(step.name)}
                                        </div>
                                        <span className={`text-xs mt-2 capitalize ${
                                            step.completed ? 'text-emerald-600 font-medium' : 'text-gray-400'
                                        }`}>
                                            {step.name}
                                        </span>
                                        {index < getStatusSteps(selectedOrder.orderStatus).length - 1 && (
                                            <div className={`absolute top-6 h-0.5 ${
                                                step.completed ? 'bg-emerald-600' : 'bg-gray-200'
                                            }`} style={{ 
                                                width: `${100 / getStatusSteps(selectedOrder.orderStatus).length}%`,
                                                left: `${50}%`,
                                                transform: 'translateY(-50%)'
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Cancelled State */}
                            {selectedOrder.orderStatus === 'cancelled' && (
                                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-3">
                                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                                    <div>
                                        <p className="font-medium text-red-700">Order Cancelled</p>
                                        <p className="text-sm text-red-600">Your order has been cancelled</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="p-6 border-t">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Customer Name</p>
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Phone</p>
                                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500 text-sm">Shipping Address</p>
                                    <p className="font-medium">{selectedOrder.shippingAddress}</p>
                                </div>
                                {selectedOrder.deliveryDate && (
                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-sm flex items-center gap-1">
                                            <FiCalendar className="w-4 h-4" />
                                            Expected Delivery
                                        </p>
                                        <p className="font-medium text-emerald-700">
                                            {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                        {isReturnAvailable(selectedOrder) && (
                                            <p className="text-xs text-emerald-600 mt-1">
                                                Return available until {new Date(selectedOrder.returnAvailableUntil).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 border-t">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
                            <div className="space-y-3">
                                {selectedOrder.items?.map((item, index) => (
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
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} x ৳{item.price}</p>
                                            <p className="font-bold">৳{item.totalPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>৳{selectedOrder.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery</span>
                                    <span>৳{selectedOrder.deliveryCharge}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>৳{selectedOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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