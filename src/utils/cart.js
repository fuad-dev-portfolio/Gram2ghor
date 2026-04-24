const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const addToCart = async (productId, quantity = 1, weight = '', price = 0) => {
    try {
        const res = await fetch(`${backendUrl}/api/client/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity, weight, price })
        });
        const data = await res.json();
        return { success: data.success, data, message: data.message };
    } catch (error) {
        console.error('Add to cart error:', error);
        return { success: false, error: error.message };
    }
};

export const getCart = async () => {
    try {
        const res = await fetch(`${backendUrl}/api/client/cart/get`, {
            credentials: 'include'
        });
        const data = await res.json();
        return { success: data.success, data: data.data };
    } catch (error) {
        console.error('Get cart error:', error);
        return { success: false, error: error.message };
    }
};

export const updateCartItem = async (itemId, quantity) => {
    try {
        const res = await fetch(`${backendUrl}/api/client/cart/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ itemId, quantity })
        });
        const data = await res.json();
        return { success: data.success, data: data.data };
    } catch (error) {
        console.error('Update cart error:', error);
        return { success: false, error: error.message };
    }
};

export const removeFromCart = async (itemId) => {
    try {
        const res = await fetch(`${backendUrl}/api/client/cart/remove/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await res.json();
        return { success: data.success, data: data.data };
    } catch (error) {
        console.error('Remove from cart error:', error);
        return { success: false, error: error.message };
    }
};