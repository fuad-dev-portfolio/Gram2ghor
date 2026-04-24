export default function FaqPage() {
    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to enter your delivery details and payment information."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, bKash, Nagad, and cash on delivery for your convenience."
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 2-5 business days within Dhaka. Express delivery is available for same-day delivery in selected areas."
        },
        {
            question: "Can I cancel or modify my order?",
            answer: "Yes, you can cancel or modify your order within 2 hours of placing it, as long as it hasn't been shipped yet."
        },
        {
            question: "How do I track my order?",
            answer: "You can track your order using the tracking number sent to your email or mobile number after shipment."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 7-day return policy for most items. Please refer to our Refund & Returns page for detailed information."
        },
        {
            question: "Are your products organic?",
            answer: "Yes! We source all our products directly from verified organic farmers and ensure authentic, chemical-free products."
        },
        {
            question: "Do you offer bulk discounts?",
            answer: "Yes, we offer special corporate deals and bulk discounts. Contact us at contact@ghorerbazar.com for more information."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach us at 09642922922, email us at contact@ghorerbazar.com, or visit our Contact page."
        },
        {
            question: "Is my personal information secure?",
            answer: "Yes, we take privacy seriously. Your information is encrypted and never shared with third parties. See our Privacy Policy."
        }
    ];

    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-gray-600">Still have questions? <a href="/contact" className="text-emerald-600 hover:underline">Contact us</a>.</p>
        </div>
    );
}