import { exportToCSV } from "@crm/lib/exportToCSV";

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export interface CustomerSectionProps {
  customers: Customer[];
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({
  customers,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Customers</h2>

        <div className="flex gap-4 ml-auto">
          {/* Add New Customer Button */}
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Add New Customer</span>
          </button>
          {/* Export Button */}
          <button
            onClick={() => exportToCSV(customers, "customers")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            {/* Export Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 11-2 0V4H5v12h4a1 1 0 110 2H4a1 1 0 01-1-1V3zm14.707 9.707a1 1 0 00-1.414-1.414L13 14.586V10a1 1 0 10-2 0v4.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5z"
                clipRule="evenodd"
              />
            </svg>

            <span>Export Customers CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                  No customers found. Add one!
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(customer)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => customer.id && onDelete(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerSection;
