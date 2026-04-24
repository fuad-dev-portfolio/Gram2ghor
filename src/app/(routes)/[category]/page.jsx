import CategoryProducts from "./CategoryProducts";

export default async function CategoryPage({ params }) {
    const { category } = await params;
    return <CategoryProducts categorySlug={category} />;
}