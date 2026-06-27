import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, FileText, CreditCard, CalendarDays, ExternalLink, Hash } from 'lucide-react';
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
  'Preload 1 year': 'Preload 1 year',
  'Preload 2 year': 'Preload 2 year',
  WFO: 'WFO',
  'Preload product only': 'Preload product only',
};

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
const getContractStatus = (value) => (value?.expiry && new Date(value.expiry).getTime() < Date.now() ? 'Expired' : 'Active');

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
    return <div className="portal-card p-6">Loading contract...</div>;
  }

  if (!contract) {
    return <div className="portal-card p-6 text-red-600">{error || 'Contract not found.'}</div>;
  }

  const totalAmount = formatMoney(contract.price);
  const status = getContractStatus(contract);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-wrap items-start gap-4">
        <Link to="/dashboard/sales" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold text-[#111827]">{contract.orderId || `Contract ${contract._id}`}</h1>
          <p className="mt-1 text-sm text-gray-500">Created on {formatDate(contract.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <div className="portal-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-[#111827]">Contract Details</h2>
            </div>
            <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
              <div className="grid gap-2 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Order ID</span>
                <span className="break-words text-sm font-medium text-[#111827]">{contract.orderId || '-'}</span>
              </div>
              <div className="grid gap-2 bg-gray-50 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Contract ID</span>
                <span className="break-all text-sm font-medium text-[#111827]">{contract._id}</span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Covered Product</span>
                <span className="break-words text-sm font-medium text-[#111827]">{productLabel[contract.coveredProduct] ?? contract.coveredProduct}</span>
              </div>
              <div className="grid gap-2 bg-gray-50 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Term</span>
                <span className="break-words text-sm font-medium text-[#111827]">{termLabel[contract.term] ?? contract.term}</span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Sale Date</span>
                <span className="text-sm font-medium text-[#111827]">{formatDate(contract.saleDate)}</span>
              </div>
              <div className="grid gap-2 bg-gray-50 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">Coverage Expiry</span>
                <span className="text-sm font-medium text-[#111827]">{formatDate(contract.expiry)}</span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
                <span className="text-sm text-gray-500">File Reference</span>
                <a
                  href={contract.file}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent-blue no-underline"
                >
                  Open Document <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="portal-card p-6">
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
              <div>
                <p className="text-xs text-gray-500 mb-1">Dealer ID</p>
                <p className="break-all text-sm font-medium text-[#111827]">{contract.dealer}</p>
              </div>
            </div>
          </div>

          <div className="portal-card p-6">
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
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase">Timeline</span>
              </div>
              <div className="space-y-2 text-sm text-[#111827]">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>Created: {formatDate(contract.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span>Last updated: {formatDate(contract.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
