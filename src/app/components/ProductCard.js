import React from 'react';
import Link from "next/link";

const ProductCard = ({ product, onAddToCart, onSelect }) => {
    const handleInquire = (e) => {
        e.preventDefault();
        onSelect(product); // This will trigger the navigation with localStorage
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-[fade-in_1s_ease-in-out_forwards]">
            <div className="w-full h-[400px] flex items-center justify-center bg-white">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-auto object-contain"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div
                    dangerouslySetInnerHTML={{__html: product.description}}
                    className="text-gray-600 mb-4"
                />
                <div className="pb-2">
                    <span className="text-2xl py-4 font-bold">${product.price - 0.01}</span>
                    <span className="text-[15px] font-bold relative top-[-10px] text-red-700 line-through">
                        ${(parseFloat(product.price) + parseFloat(product.price) * 0.40) - 0.01}
                    </span>
                    <span className="no-underline text-red-600 text-[15px] relative right-[64px] xsm:right-[54px] top-[5px]">
                        - 40%
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleInquire}
                        className="w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                    >
                        Inquire Now
                    </button>
                    <button
                        onClick={() => onSelect(product)}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700
                            transition-colors duration-200"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;