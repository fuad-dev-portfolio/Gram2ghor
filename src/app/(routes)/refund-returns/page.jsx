export default function RefundReturnsPage() {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund & Returns Policy</h1>
            <div className="prose max-w-none text-gray-600">
                <p className="mb-4">At Gram2ghor, we want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, we offer a hassle-free refund and return policy.</p>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Return Eligibility:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Items must be unused and in original packaging</li>
                    <li>Returns must be initiated within 7 days of delivery</li>
                    <li>Food items must be unopened and sealed</li>
                    <li>Proof of purchase (order number or receipt) required</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Non-Returnable Items:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Perishable food items (once delivered)</li>
                    <li>Items that have been used or opened</li>
                    <li>Customized or personalized products</li>
                    <li>Gift cards and promotional items</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Refund Process:</h2>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Contact our customer support within 7 days of delivery</li>
                    <li>Provide your order number and reason for return</li>
                    <li>Our team will review and approve your request</li>
                    <li>Refund will be processed within 5-7 business days</li>
                </ol>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Refund Methods:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Original payment method</li>
                    <li>Store credit for future purchases</li>
                    <li>Exchange for other products</li>
                </ul>

                <p className="mt-6">For return requests, please <a href="/contact" className="text-emerald-600 hover:underline">contact us</a>.</p>
            </div>
        </div>
    );
}