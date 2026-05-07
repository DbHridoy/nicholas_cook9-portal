import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, FileText, CreditCard } from 'lucide-react';

export default function SalesDetails() {
  const { id } = useParams();

  // Mock data for the specific order
  const orderDetails = {
    orderId: id || 'ORD-9821',
    date: 'May 04, 2026',
    status: 'Delivered',
    paymentMethod: 'Credit Card (**** 4242)',
    totalAmount: '$1,299.00',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Enterprise Way, Tech District, CA 94105',
    },
    product: {
      id: 'PRD-002',
      name: 'SecureSwitch 48-Port',
      category: 'Networking',
      price: '$1,299.00',
      quantity: 1,
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/sales" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Order {orderDetails.orderId}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {orderDetails.date}</p>
        </div>
        <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {orderDetails.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Product Details</h2>
            </div>
            <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
              <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">Product Name</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.product.name}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50">
                <span className="text-sm text-gray-500">Product ID / SKU</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.product.id}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.product.category}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50">
                <span className="text-sm text-gray-500">Quantity</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.product.quantity}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">Unit Price</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.product.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Customer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-[#111827]">{orderDetails.customer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-[#111827]">{orderDetails.customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium text-[#111827]">{orderDetails.customer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                <p className="text-sm font-medium text-[#111827]">{orderDetails.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-[#111827]">{orderDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm font-medium text-[#111827]">$0.00</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-bold text-[#111827]">Total</span>
                <span className="text-sm font-bold text-[#111827]">{orderDetails.totalAmount}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase">Payment Method</span>
              </div>
              <p className="text-sm font-medium text-[#111827]">{orderDetails.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
