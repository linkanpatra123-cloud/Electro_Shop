import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="price-tag">₹{product.price.toLocaleString("en-IN")}</span>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
        <span className="stock-note">{product.stock} in stock</span>
      </div>
    </div>
  );
}
