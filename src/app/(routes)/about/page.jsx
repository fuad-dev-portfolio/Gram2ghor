export const metadata = {
    title: "About Gram2Ghor | Pure Organic Food Products Bangladesh",
    description: "Learn about Gram2Ghor - Your trusted source for authentic Bangladeshi organic food products. We provide pure ghee, honey, mustard oil, pickles, and traditional food items directly from local farmers.",
    keywords: "about Gram2Ghor, organic food Bangladesh, authentic Bangladeshi food, local farmers, sustainable agriculture, traditional food",
    openGraph: {
        title: "About Gram2Ghor",
        description: "Learn about Gram2Ghor - Your trusted source for authentic Bangladeshi organic food products.",
        url: "https://gram2ghor.com/about",
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
        title: "About Gram2Ghor",
        description: "Learn about Gram2Ghor - Your trusted source for authentic Bangladeshi organic food products.",
        images: ["/logo.png"]
    }
};

export default function AboutPage() {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">About Gram2ghor</h1>
            <div className="prose max-w-none text-gray-600">
                <p className="mb-4">Welcome to <strong>Gram2ghor</strong> - Your Trusted Source for Authentic Bangladeshi Food Products. We are dedicated to bringing the finest organic and traditional food items directly from local farmers to your doorstep.</p>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Our Mission:</h2>
                <p className="mb-4">To provide safe, authentic, and chemical-free food products to every household in Bangladesh while supporting local farmers and promoting sustainable agriculture.</p>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What We Offer:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>100% Organic and natural products</li>
                    <li>Traditional Bangladeshi delicacies</li>
                    <li>Authentic spices and condiments</li>
                    <li>Deshi honey and ghee</li>
                    <li>Homemade pickles (Aachar)</li>
                    <li>And more traditional food items</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why Choose Gram2ghor?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Directly sourced from verified organic farmers</li>
                    <li>No middlemen - fair prices for farmers and customers</li>
                    <li>Quality assurance with every order</li>
                    <li>Fast and reliable delivery</li>
                    <li>24/7 customer support</li>
                    <li>Secure payment options</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Our Vision:</h2>
                <p className="mb-4">To become Bangladesh's most trusted e-commerce platform for organic and traditional food products, ensuring every family has access to healthy, authentic food.</p>
                
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Us:</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Address: Rampura, Dhaka, Bangladesh</li>
                    <li>Phone: 09642922922</li>
                    <li>Email: contact@ghorerbazar.com</li>
                </ul>
                
                <p className="mt-6">Thank you for choosing Gram2ghor - Bringing the taste of authenticity to your home!</p>
            </div>
        </div>
    );
}