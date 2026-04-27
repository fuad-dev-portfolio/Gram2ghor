"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiPackage, FiTruck, FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ show: false, order: null, deliveryDate: "", adminNotes: "" });
    const [processing, setProcessing] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const body = { status: statusFilter !== "all" ? statusFilter : undefined };
            const res = await fetch(`${backendUrl}/api/admin/order/get-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseDetail = () => {
        setSelectedOrder(null);
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (!confirmModal.order) return;

        setProcessing(true);
        try {
            const res = await fetch(`${backendUrl}/api/admin/order/confirm-order`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: confirmModal.order.orderId,
                    deliveryDate: confirmModal.deliveryDate,
                    adminNotes: confirmModal.adminNotes
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
                setConfirmModal({ show: false, order: null, deliveryDate: "", adminNotes: "" });
                setSelectedOrder(null);
            } else {
                alert(data.message || "Failed to confirm order");
            }
        } catch (error) {
            alert("Failed to confirm order");
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/order/update-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, orderStatus: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
                if (selectedOrder?.orderId === orderId) {
                    setSelectedOrder(data.data);
                }
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = !search || 
            order.orderId.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(search.toLowerCase()) ||
            order.customerPhone.includes(search);
        return matchesSearch;
    });

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: { bg: "bg-yellow-100 text-yellow-700", icon: <FiClock className="w-3 h-3" /> },
            confirmed: { bg: "bg-blue-100 text-blue-700", icon: <FiCheck className="w-3 h-3" /> },
            processing: { bg: "bg-purple-100 text-purple-700", icon: <FiPackage className="w-3 h-3" /> },
            shipped: { bg: "bg-indigo-100 text-indigo-700", icon: <FiTruck className="w-3 h-3" /> },
            delivered: { bg: "bg-green-100 text-green-700", icon: <FiCheck className="w-3 h-3" /> },
            cancelled: { bg: "bg-red-100 text-red-700", icon: <FiX className="w-3 h-3" /> }
        };
        const style = statusStyles[status] || statusStyles.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg}`}>
                {style.icon}
                <span className="capitalize">{status}</span>
            </span>
        );
    };

    const getNextStatuses = (currentStatus) => {
        const flow = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered', 'cancelled'],
            delivered: []
        };
        return flow[currentStatus] || [];
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Order Management</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search order ID, name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No orders found</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-sm font-medium text-gray-800">{order.orderId}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800">{order.customerName}</p>
                                            <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600">{order.items?.length || 0} items</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-gray-800">৳{order.totalAmount}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(order.orderStatus)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                                    <p className="text-sm text-gray-500 font-mono">{selectedOrder.orderId}</p>
                                </div>
                                <button onClick={handleCloseDetail} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-gray-800 mb-3">Customer Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">{selectedOrder.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{selectedOrder.customerEmail || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-800 mb-3">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.productImage && (
                                                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{item.productName}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity} x ৳{item.price}</p>
                                                <p className="font-medium">৳{item.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>৳{selectedOrder.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span>৳{selectedOrder.deliveryCharge}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>৳{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status & Actions */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Current Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Delivery Date</p>
                                        <p className="font-medium">
                                            {selectedOrder.deliveryDate 
                                                ? new Date(selectedOrder.deliveryDate).toLocaleDateString()
                                                : 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Status Actions */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {selectedOrder.orderStatus === 'pending' && (
                                        <button
                                            onClick={() => setConfirmModal({ show: true, order: selectedOrder, deliveryDate: "", adminNotes: "" })}
                                            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                                        >
                                            <FiCheck className="w-4 h-4" /> Confirm Order
                                        </button>
                                    )}
                                    
                                    {getNextStatuses(selectedOrder.orderStatus).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedOrder.orderId, status)}
                                            className={`px-4 py-2 rounded-lg capitalize ${
                                                status === 'cancelled' 
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            {status === 'confirmed' && 'Process'}
                                            {status === 'processing' && 'Ship'}
                                            {status === 'shipped' && 'Delivered'}
                                            {status === 'cancelled' && 'Cancel'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Order Notes */}
                            {selectedOrder.notes && (
                                <div className="mb-4">
                                    <p className="text-gray-500 text-sm">Customer Notes</p>
                                    <p className="text-sm">{selectedOrder.notes}</p>
                                </div>
                            )}
                            
                            {selectedOrder.adminNotes && (
                                <div>
                                    <p className="text-gray-500 text-sm">Admin Notes</p>
                                    <p className="text-sm">{selectedOrder.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Order Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Order</h3>
                            <form onSubmit={handleConfirmOrder}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                                    <input
                                        type="date"
                                        value={confirmModal.deliveryDate}
                                        onChange={(e) => setConfirmModal({ ...confirmModal, deliveryDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                                    <textarea
                                        value={confirmModal.adminNotes}
                                        onChange={(e) => setConfirmModal({ ...confirmModal, adminNotes: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Any notes for the customer..."
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => setConfirmModal({ show: false, order: null, deliveryDate: "", adminNotes: "" })}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}