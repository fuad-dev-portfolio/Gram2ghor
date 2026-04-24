export default function CorporateDealPage() {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Corporate Deals</h1>
            <div className="prose max-w-none text-gray-600">
                <p className="mb-4">Looking for bulk orders for your office, events, or business? Gram2ghor offers exclusive corporate deals tailored to your needs.</p>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Benefits of Corporate Deals:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Special discounted rates for bulk orders</li>
                    <li>Priority delivery and customization options</li>
                    <li>Dedicated account manager for business clients</li>
                    <li>Flexible payment terms for corporate accounts</li>
                    <li>Custom packaging and branding options</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How It Works:</h2>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Contact our corporate sales team</li>
                    <li>Discuss your requirements and quantity</li>
                    <li>Receive a customized quote</li>
                    <li>Place your order with easy payment options</li>
                </ol>

                <p className="mt-6">For more information, please <a href="/contact" className="text-emerald-600 hover:underline">contact us</a>.</p>
            </div>
        </div>
    );
}