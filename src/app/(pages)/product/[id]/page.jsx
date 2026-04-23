import ProductClient from "./ProductClient";

export default function ProductDetailsPage({ params }) {
    return <ProductClient productId={params.id} />;
}