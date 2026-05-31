import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, FileText, CreditCard } from 'lucide-react';
import { api } from '../../lib/api';

const productLabel = {
  carpet: 'Carpet',
  lvp_laminate: 'LVP / Laminate',
  hardwood: 'Hardwood',
  tile: 'Tile',
};

const termLabel = {
  '3_year_coverage': '3 Year Coverage',
  '5_year_coverage': '5 Year Coverage',
};

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function SalesDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.getContract(id)
      .then((data) => {
        if (active) setContract(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load contract.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-red-600">{error || 'Contract not found.'}</div>;
  }

  const totalAmount = formatMoney(contract.price);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/sales" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Contract {contract._id}</h1>
          <p className="text-sm text-gray-500 mt-1">Created on {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '-'}</p>
        </div>
        <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Contract Details</h2>
            </div>
            <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
              <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">Covered Product</span>
                <span className="text-sm font-medium text-[#111827]">{productLabel[contract.coveredProduct] ?? contract.coveredProduct}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50">
                <span className="text-sm text-gray-500">Term</span>
                <span className="text-sm font-medium text-[#111827]">{termLabel[contract.term] ?? contract.term}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">Installation Date</span>
                <span className="text-sm font-medium text-[#111827]">{contract.installationDate ? new Date(contract.installationDate).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50">
                <span className="text-sm text-gray-500">File Reference</span>
                <span className="text-sm font-medium text-[#111827]">{contract.file}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Customer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-[#111827]">{contract.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Property Address</p>
                <p className="text-sm font-medium text-[#111827]">{contract.propertyAddress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-[#111827]">{totalAmount}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-bold text-[#111827]">Total</span>
                <span className="text-sm font-bold text-[#111827]">{totalAmount}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase">Payment Method</span>
              </div>
              <p className="text-sm font-medium text-[#111827]">Not tracked by current API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
