import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, Search, Filter, Download, Box, Layers, CheckCircle, AlertCircle, Cpu } from 'lucide-react';

export default function BOMTable({ project, onPartClick }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartModal, setSelectedPartModal] = useState(null);

  const nodes = project?.nodes || [];

  const filteredNodes = nodes.filter(node => {
    const matchesCategory = filterCategory === 'all' || node.category === filterCategory;
    const matchesSearch = !searchQuery ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.productName && node.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.vendor && node.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.vendor_sku && node.vendor_sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalCost = filteredNodes.reduce((acc, n) => acc + (n.price || 0) * (n.quantity || 1), 0);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ["Item Name", "Product Model", "Category", "Vendor", "SKU", "Quantity", "Unit Price", "Total Price", "Purchase URL"];
    const rows = filteredNodes.map(n => [
      `"${n.name}"`,
      `"${n.productName || ''}"`,
      `"${n.category}"`,
      `"${n.vendor || ''}"`,
      `"${n.vendor_sku || ''}"`,
      n.quantity || 1,
      `$${(n.price || 0).toFixed(2)}`,
      `$${((n.price || 0) * (n.quantity || 1)).toFixed(2)}`,
      `"${n.purchaseUrl || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project?.projectName || 'blueprint'}-BOM.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVendorColor = (vendor) => {
    const v = (vendor || '').toLowerCase();
    if (v.includes('digikey')) return 'text-red-400 border-red-900/50 bg-red-950/30';
    if (v.includes('mouser')) return 'text-blue-400 border-blue-900/50 bg-blue-950/30';
    if (v.includes('adafruit')) return 'text-purple-400 border-purple-900/50 bg-purple-950/30';
    if (v.includes('sparkfun')) return 'text-amber-400 border-amber-900/50 bg-amber-950/30';
    if (v.includes('aliexpress')) return 'text-orange-400 border-orange-900/50 bg-orange-950/30';
    if (v.includes('3d print')) return 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30';
    return 'text-gray-400 border-gray-800 bg-gray-900/40';
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0e0e10] overflow-hidden">
      {project?.nodes?.some(n => n.priceEstimate) && (
        <div className="shrink-0 px-4 py-1.5 text-[11px] font-mono text-amber-300 bg-amber-950/30 border-b border-amber-900/40">
          Prices are rough estimates and part numbers are not verified. Check each supplier before buying.
        </div>
      )}
      {/* Top Controls Bar */}
      <div className="shrink-0 border-b border-[#24262b] bg-[#121316] p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search & Category Filter */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search components, SKUs, or vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191e] border border-[#2b2d35] rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/80 font-mono"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'electrical', label: 'Electrical' },
              { id: 'mechanical', label: 'Mechanical' },
              { id: '3d_printed', label: '3D Printed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-mono uppercase rounded transition-colors ${
                  filterCategory === tab.id
                    ? 'bg-[#2b2d35] text-white font-bold border border-gray-600'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1b20]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total Cost & CSV Export Button */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Total Estimated BOM</div>
            <div className="text-base font-mono font-bold text-emerald-400">
              ${totalCost.toFixed(2)}
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#1f2127] hover:bg-[#2b2d35] text-gray-200 border border-[#353842] px-3.5 py-1.5 rounded-md text-xs font-mono uppercase font-bold tracking-wider transition-colors"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="sticky top-0 bg-[#16171b] border-b border-[#24262b] text-[11px] uppercase tracking-wider text-gray-400 z-10">
            <tr>
              <th className="py-3 px-4">Component & Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Vendor & SKU</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2025]">
            {filteredNodes.map(node => (
              <tr
                key={node.id}
                onClick={() => setSelectedPartModal(node)}
                className="hover:bg-[#18191f] transition-colors cursor-pointer group"
              >
                {/* Name & Details */}
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                    {node.name}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate max-w-xs mt-0.5">
                    {node.productName || node.type}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-[#1e2026] text-gray-300 border border-[#2e313a]">
                    {node.category.replace('_', ' ')}
                  </span>
                </td>

                {/* Vendor & SKU */}
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${getVendorColor(node.vendor)}`}>
                    {node.vendor || 'Generic'}
                  </span>
                  {node.vendor_sku && (
                    <span className="block text-[10px] text-gray-500 font-mono mt-1">
                      {node.vendor_sku}
                    </span>
                  )}
                </td>

                {/* Quantity */}
                <td className="py-3 px-4 text-center font-bold text-gray-300">
                  {node.quantity || 1}
                </td>

                {/* Unit Price */}
                <td className="py-3 px-4 text-right text-gray-400">
                  ${(node.price || 0).toFixed(2)}
                </td>

                {/* Subtotal */}
                <td className="py-3 px-4 text-right font-bold text-gray-200">
                  ${((node.price || 0) * (node.quantity || 1)).toFixed(2)}
                </td>

                {/* Buy Link */}
                <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  {node.purchaseUrl ? (
                    <a
                      href={node.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e222d] hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-900/40 text-[10px] font-bold uppercase transition-colors"
                    >
                      <ShoppingCart size={11} />
                      Buy
                    </a>
                  ) : (
                    <span className="text-gray-600 text-[11px]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part Detail Inspection Modal */}
      {selectedPartModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedPartModal(null)}
        >
          <div
            className="bg-[#141518] border border-[#353842] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded">
                  {selectedPartModal.category} • {selectedPartModal.type}
                </span>
                <h3 className="text-lg font-bold font-tech text-white mt-2">
                  {selectedPartModal.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {selectedPartModal.productName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPartModal(null)}
                className="text-gray-500 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#1b1c21] p-3 rounded-lg border border-[#282a32]">
                <div className="text-gray-500 text-[10px] uppercase">Vendor / Sourcing</div>
                <div className="text-gray-200 font-bold mt-1">{selectedPartModal.vendor || 'Standard Supplier'}</div>
                <div className="text-gray-500 text-[10px]">{selectedPartModal.vendor_sku || 'N/A'}</div>
              </div>
              <div className="bg-[#1b1c21] p-3 rounded-lg border border-[#282a32]">
                <div className="text-gray-500 text-[10px] uppercase">Unit Pricing</div>
                <div className="text-emerald-400 font-bold mt-1">${(selectedPartModal.price || 0).toFixed(2)}</div>
                <div className="text-gray-500 text-[10px]">{selectedPartModal.stockCount ? `${selectedPartModal.stockCount} units in stock` : 'Check supplier for stock'}</div>
              </div>
            </div>

            {/* Physical Dimensions / Material */}
            {selectedPartModal.dimensions && (
              <div className="bg-[#1b1c21] p-3 rounded-lg border border-[#282a32] text-xs font-mono">
                <div className="text-gray-500 text-[10px] uppercase">Physical Dimensions</div>
                <div className="text-gray-300 mt-1">
                  {selectedPartModal.dimensions.width} × {selectedPartModal.dimensions.height} × {selectedPartModal.dimensions.depth} mm
                </div>
              </div>
            )}

            {/* Pinout specs if electrical */}
            {selectedPartModal.pins && selectedPartModal.pins.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400">Pinout Connections</div>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                  {selectedPartModal.pins.map((pin, idx) => (
                    <div key={idx} className="bg-[#1b1c21] border border-[#282a32] px-2 py-1 rounded text-[11px] font-mono flex items-center justify-between">
                      <span className="text-gray-300">{pin.name}</span>
                      <span className="text-blue-400 text-[10px]">{pin.signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              {selectedPartModal.purchaseUrl && (
                <a
                  href={selectedPartModal.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase py-2.5 rounded-lg transition-colors"
                >
                  <ShoppingCart size={13} />
                  Order from {selectedPartModal.vendor}
                </a>
              )}
              <button
                onClick={() => setSelectedPartModal(null)}
                className="px-4 py-2.5 rounded-lg border border-[#353842] text-gray-400 hover:text-white font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
