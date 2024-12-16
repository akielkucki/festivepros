"use client";

import React, { useState, useEffect } from 'react';
import Loading from "../components/Loading";

const InputField = ({ label, name, type = 'text', placeholder = '', errors, formData, handleChange }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 
                bg-white/90 placeholder-gray-400 transition-colors duration-200`}
        />
        {errors[name] && <p className="text-sm text-red-500">{errors[name]}</p>}
    </div>
);

export default function InquiryForm() {
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
        preferredContact: 'email',
        state: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedProduct = localStorage.getItem('selectedProduct');
        if (storedProduct) {
            try {
                const productData = JSON.parse(storedProduct);
                setProduct(productData);
            } catch (error) {
                console.error('Error parsing product data:', error);
            }
        }
    }, []);

    const validateField = (name, value) => {
        let error = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    error = 'This field is required';
                }
                break;
            case 'email':
                if (!value) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email';
                }
                break;
            case 'phoneNumber':
                if (value && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
                    error = 'Please enter a valid phone number (xxx-xxx-xxxx)';
                }
                break;
            case 'message':
                if (!value.trim()) {
                    error = 'Please include a message';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const validateAll = (data) => {
        const newErrors = {};
        Object.keys(data).forEach((field) => {
            const error = validateField(field, data[field]);
            if (error) newErrors[field] = error;
        });
        return newErrors;
    };



    async function sendInquiry() {
        const dataToSend = {
            ...formData,
            product: product // Include the product details
        };

        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                throw new Error('Failed to send inquiry');
            }
        } catch (error) {
            console.error('Error sending inquiry:', error);
            // Handle error (show error message to user)
        }
    }

    const onPhoneChange = (e) => {
        if (e.target.name === 'phoneNumber') {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            if (value.length >= 6) {
                value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `${value.slice(0, 3)}-${value.slice(3)}`;
            }
            e.target.value = value;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onPhoneChange(e);

        setFormData(prev => ({
            ...prev,
            [name]: e.target.value
        }));

        if (isLoading) {
            const newError = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: newError
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateAll(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            await sendInquiry();
        } else {
            setIsLoading(true);
        }
    };

    if (!product) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm shadow-lg">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-green-700">Loading...</h2>
                    <Loading />
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm shadow-lg">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-green-700">Thank You for Your Interest!</h2>
                    <p className="text-gray-700">We've received your inquiry and will get back to you soon.</p>
                    <p className="text-gray-600">Happy Holidays! 🎄✨</p>
                </div>
            </div>
        );
    }

    if (isLoading && Object.keys(errors).length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm shadow-lg">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-green-700">Hang on!</h2>
                    <p className="text-gray-700">Please wait while we process your inquiry</p>
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-4 md:gap-8">
                {/* Inquiry Form */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border-2 border-green-600 mt-4 md:mt-0">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-700">Product Inquiry</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                            <InputField
                                label="First Name"
                                name="firstName"
                                errors={errors}
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                errors={errors}
                                formData={formData}
                                handleChange={handleChange}
                            />
                        </div>

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            errors={errors}
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <InputField
                            label="Phone Number (Optional)"
                            name="phoneNumber"
                            placeholder="xxx-xxx-xxxx"
                            errors={errors}
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-800">
                                Preferred Contact Method
                            </label>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="radio"
                                        name="preferredContact"
                                        value="email"
                                        checked={formData.preferredContact === 'email'}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4"
                                    />
                                    <span className="text-sm">Email</span>
                                </label>
                                <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="radio"
                                        name="preferredContact"
                                        value="phone"
                                        checked={formData.preferredContact === 'phone'}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4"
                                    />
                                    <span className="text-sm">Phone</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-800">
                                State
                            </label>
                            <select
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90 placeholder-gray-400"
                            >
                                <option value="">Select State</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="NJ">New Jersey</option>
                            </select>
                            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-800">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none 
                                    focus:ring-2 focus:ring-green-500 transition-colors duration-200 placeholder-gray-400
                                    ${errors.message ? 'border-red-500' : 'border-gray-300'} 
                                    bg-white/90`}
                                placeholder="Please include any questions or details..."
                            />
                            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 sm:py-2 px-4 rounded-md hover:bg-green-700
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors
                                duration-200 text-lg sm:text-base"
                        >
                            Send Inquiry
                        </button>
                    </form>
                </div>

                {/* Product Details */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border-2 border-red-600">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-700">Product Details</h2>
                    <div className="space-y-4">
                        {product?.image && (
                            <div
                                className="w-full h-48 sm:h-64 bg-cover bg-center rounded-lg shadow-md"
                                style={{ backgroundImage: `url(${product.image})` }}
                                aria-label="Product image"
                            />
                        )}
                        {product?.name && (
                            <h3 className="text-lg sm:text-xl font-semibold text-red-700">{product.name}</h3>
                        )}
                        {product?.description && (
                            <div
                                className="prose max-w-none text-gray-700 text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        )}
                        {product?.price && (
                            <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                                <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-2 sm:mb-3">
                                    Price Breakdown
                                </h4>
                                <div className="space-y-2 divide-y divide-gray-200 text-sm sm:text-base">
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${product.price.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Sales Tax (6%):</span>
                                        <span className="font-medium">${(product.price * 0.06).toFixed(2)}</span>
                                    </div>

                                    {formData.state === 'NJ' && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Out of State Fee (15%):</span>
                                            <span className="font-medium text-red-600">
                                                ${(product.price * 0.15).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-2 text-base sm:text-lg font-bold">
                                        <span className="text-gray-800">Estimated Total:</span>
                                        <span className="text-green-700">
                            ${(
                                            product.price +
                                            product.price * 0.06 +
                                            (formData.state === 'NJ' ? product.price * 0.15 : 0)
                                        ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    *Final price may vary based on location and additional fees
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}