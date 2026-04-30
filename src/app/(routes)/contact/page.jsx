export const metadata = {
    title: "Contact Gram2Ghor | Get in Touch with Us",
    description: "Contact Gram2Ghor for any queries about our organic food products. Reach us at Rampura, Dhaka, Bangladesh. Call us at 09642922922 or email contact@ghorerbazar.com.",
    keywords: "contact Gram2Ghor, Gram2Ghor phone number, Gram2Ghor email, organic food contact Bangladesh, Rampura Dhaka",
    openGraph: {
        title: "Contact Gram2Ghor",
        description: "Contact Gram2Ghor for any queries about our organic food products.",
        url: "https://gram2ghor.com/contact",
        siteName: "Gram2Ghor",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
                alt: "Gram2Ghor Logo"
            }
        ],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Gram2Ghor",
        description: "Contact Gram2Ghor for any queries about our organic food products.",
        images: ["/logo.png"]
    }
};

export default function ContactPage() {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800">Address:</h3>
                            <p className="text-gray-600">Rampura, Dhaka, Bangladesh</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Phone:</h3>
                            <p className="text-gray-600">09642922922</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Email:</h3>
                            <p className="text-gray-600">contact@ghorerbazar.com</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Working Hours:</h3>
                            <p className="text-gray-600">24/7 Online Support</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Send us a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Subject" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Your message..."></textarea>
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}