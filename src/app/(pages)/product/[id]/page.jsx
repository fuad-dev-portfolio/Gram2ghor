import ProductClient from "./ProductClient";

export default async function ProductDetailsPage({ params }) {
    const { id } = await params;
    return <ProductClient productId={id} />;
}