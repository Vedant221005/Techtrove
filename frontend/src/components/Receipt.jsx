import { Button } from "./ui/button";
import { formatDate } from "../lib/utils";

export function Receipt({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Print styles are injected via style tag to ensure they work in print mode */}
      <style type="text/css" media="print">{`
        @page {
          size: A5;
          margin: 10mm;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-content, .receipt-content * {
            visibility: visible;
          }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-[21cm] p-6 m-4">
        <div className="receipt-content">
          {/* Receipt Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-800 pb-3 mb-3">
            <h2 className="text-2xl font-bold text-blue-800">Tech Trove</h2>
            <h2 className="text-2xl font-bold text-primary">Order Confirmation</h2>
            <p className="text-muted-foreground text-sm">Thank you for your purchase!</p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 print-break-inside-avoid">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><strong>Customer Name:</strong> {receipt.customerName}</p>
                <p><strong>Email:</strong> {receipt.customerEmail}</p>
              </div>
              <div>
                <p><strong>Order Date:</strong> {formatDate(receipt.orderDate)}</p>
                <p><strong>Order ID:</strong> {receipt.orderId}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Order Items</h3>
              <div className="border-t border-gray-200 dark:border-gray-800">
                {receipt.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-800">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-primary">
                  ₹{receipt.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions - These won't show in print */}
          <div className="mt-6 flex justify-end gap-4 no-print">
            <Button
              variant="secondary"
              onClick={() => {
                window.print();
              }}
            >
              Print Receipt
            </Button>
            <Button onClick={onClose} className="btn-primary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}