import { Link } from "react-router-dom";

export default function Failure() {
  return (
    <div className="result-state result-failure">
      <div className="result-icon">✕</div>
      <h2>Payment failed or cancelled</h2>
      <p className="muted">No amount was deducted. You can try again anytime.</p>
      <Link to="/cart" className="btn btn-primary">Back to cart</Link>
    </div>
  );
}
