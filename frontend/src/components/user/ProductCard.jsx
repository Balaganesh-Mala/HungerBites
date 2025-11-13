import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-gray-600 text-sm">{product.flavor}</p>
        <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
        <Link
          to={`/product/${product._id}`}
          className="block text-center bg-blue-600 text-white mt-3 py-2 rounded-lg hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
