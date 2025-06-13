// src/components/apps/CRM/CarSalesCrm.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { collection, onSnapshot, addDoc, setDoc, deleteDoc, doc } from "firebase/firestore";

import { db, auth, APP_ID } from "@components/apps/CRM/lib/firebase";
import InventoryAnalytics from "./InventoryAnalytics";

//COMPONENTS
import TabButton, { TabType } from "@crm/TabButton";

// Define interfaces for data models
interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  status: "Available" | "Sold" | "Pending";
  imageUrl: string;
}

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Sale {
  id?: string;
  carId: string;
  customerId: string;
  saleDate: string; // ISO date string e.g., 'YYYY-MM-DD'
  salePrice: number;
  salespersonId: string;
}

// Utility function to format numbers as currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

// Main CRM Component
export default function App() {
  // Firebase instances (db, auth, APP_ID) are now imported directly,
  // so no need for useState for them here.
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [showCarModal, setShowCarModal] = useState<boolean>(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [showSaleModal, setShowSaleModal] = useState<boolean>(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // Authenticate and set up user ID
  useEffect(() => {
    // Check if Firebase Auth is initialized from the imported module
    // This is a safety check; ideally, 'auth' would always be valid if firebase.ts runs without error.
    if (!auth) {
      setError(
        "Firebase Auth not initialized. Please check your Firebase configuration in src/lib/firebase.ts."
      );
      setLoading(false);
      return;
    }

    // You might load a custom auth token from an environment variable if needed.
    // Otherwise, for anonymous sign-in, this can be simplified.
    const initialAuthToken =
      typeof process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN !== "undefined"
        ? process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN
        : undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setLoading(false);
      } else {
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(auth, initialAuthToken);
          } catch (e) {
            console.error("Error signing in with custom token:", e);
            setError(`Authentication error: ${(e as Error).message}`);
            // Fallback to anonymous sign-in if custom token fails
            await signInAnonymously(auth);
          }
        } else {
          await signInAnonymously(auth);
        }
      }
    });

    return () => unsubscribe(); // Cleanup auth listener when component unmounts
  }, []); // Empty dependency array means this runs once on component mount

  // Fetch data from Firestore
  useEffect(() => {
    // Now directly use `db` from the imported module.
    // Also, ensure `APP_ID` is available for paths.
    if (!db || !userId || !APP_ID) {
      console.log("Firestore DB, User ID, or App ID not ready for data fetch.");
      // This might happen briefly on initial render before userId is set.
      // If error persists, it indicates a problem with Firebase initialization or env vars.
      return;
    }

    // Reference to the user's private collections, using the imported APP_ID
    const getCollectionRef = (collectionName: string) =>
      collection(db, `artifacts/${APP_ID}/users/${userId}/${collectionName}`);

    // Listen for real-time updates to cars
    const unsubscribeCars = onSnapshot(
      getCollectionRef("cars"),
      (snapshot) => {
        const fetchedCars: Car[] = [];
        snapshot.forEach((doc) => {
          fetchedCars.push({ id: doc.id, ...doc.data() } as Car);
        });
        setCars(fetchedCars);
        console.log("Cars updated:", fetchedCars.length);
      },
      (err) => {
        console.error("Error fetching cars:", err);
        setError(`Error fetching cars: ${err.message}`);
      }
    );

    // Listen for real-time updates to customers
    const unsubscribeCustomers = onSnapshot(
      getCollectionRef("customers"),
      (snapshot) => {
        const fetchedCustomers: Customer[] = [];
        snapshot.forEach((doc) => {
          fetchedCustomers.push({ id: doc.id, ...doc.data() } as Customer);
        });
        setCustomers(fetchedCustomers);
        console.log("Customers updated:", fetchedCustomers.length);
      },
      (err) => {
        console.error("Error fetching customers:", err);
        setError(`Error fetching customers: ${err.message}`);
      }
    );

    // Listen for real-time updates to sales
    const unsubscribeSales = onSnapshot(
      getCollectionRef("sales"),
      (snapshot) => {
        const fetchedSales: Sale[] = [];
        snapshot.forEach((doc) => {
          fetchedSales.push({ id: doc.id, ...doc.data() } as Sale);
        });
        setSales(fetchedSales);
        console.log("Sales updated:", fetchedSales.length);
      },
      (err) => {
        console.error("Error fetching sales:", err);
        setError(`Error fetching sales: ${err.message}`);
      }
    );

    // Cleanup function to unsubscribe from listeners when userId changes or component unmounts
    return () => {
      unsubscribeCars();
      unsubscribeCustomers();
      unsubscribeSales();
    };
  }, [userId]); // Re-run this effect only when userId changes

  // CRUD Operations for Cars
  const addCar = useCallback(
    async (car: Omit<Car, "id">) => {
      // `db` and `APP_ID` are implicitly stable here because they are imports
      if (!db || !userId || !APP_ID) return;
      try {
        await addDoc(collection(db, `artifacts/${APP_ID}/users/${userId}/cars`), car);
        console.log("Car added successfully.");
        setShowCarModal(false);
      } catch (e: any) {
        console.error("Error adding car: ", e);
        setError(`Error adding car: ${e.message}`);
      }
    },
    [userId]
  ); // `db` and `APP_ID` are not dependencies as they are constant imports

  const updateCar = useCallback(
    async (car: Car) => {
      if (!db || !userId || !APP_ID || !car.id) return;
      try {
        const carRef = doc(db, `artifacts/${APP_ID}/users/${userId}/cars`, car.id);
        await setDoc(carRef, car, { merge: true });
        console.log("Car updated successfully.");
        setShowCarModal(false);
        setEditingCar(null);
      } catch (e: any) {
        console.error("Error updating car: ", e);
        setError(`Error updating car: ${e.message}`);
      }
    },
    [userId]
  );

  const deleteCar = useCallback(
    async (id: string) => {
      if (!db || !userId || !APP_ID) return;
      if (!window.confirm("Are you sure you want to delete this car?")) return;
      try {
        await deleteDoc(doc(db, `artifacts/${APP_ID}/users/${userId}/cars`, id));
        console.log("Car deleted successfully.");
      } catch (e: any) {
        console.error("Error deleting car: ", e);
        setError(`Error deleting car: ${e.message}`);
      }
    },
    [userId]
  );

  // CRUD Operations for Customers
  const addCustomer = useCallback(
    async (customer: Omit<Customer, "id">) => {
      if (!db || !userId || !APP_ID) return;
      try {
        await addDoc(collection(db, `artifacts/${APP_ID}/users/${userId}/customers`), customer);
        console.log("Customer added successfully.");
        setShowCustomerModal(false);
      } catch (e: any) {
        console.error("Error adding customer: ", e);
        setError(`Error adding customer: ${e.message}`);
      }
    },
    [userId]
  );

  const updateCustomer = useCallback(
    async (customer: Customer) => {
      if (!db || !userId || !APP_ID || !customer.id) return;
      try {
        const customerRef = doc(db, `artifacts/${APP_ID}/users/${userId}/customers`, customer.id);
        await setDoc(customerRef, customer, { merge: true });
        console.log("Customer updated successfully.");
        setShowCustomerModal(false);
        setEditingCustomer(null);
      } catch (e: any) {
        console.error("Error updating customer: ", e);
        setError(`Error updating customer: ${e.message}`);
      }
    },
    [userId]
  );

  const deleteCustomer = useCallback(
    async (id: string) => {
      if (!db || !userId || !APP_ID) return;
      if (!window.confirm("Are you sure you want to delete this customer?")) return;
      try {
        await deleteDoc(doc(db, `artifacts/${APP_ID}/users/${userId}/customers`, id));
        console.log("Customer deleted successfully.");
      } catch (e: any) {
        console.error("Error deleting customer: ", e);
        setError(`Error deleting customer: ${e.message}`);
      }
    },
    [userId]
  );

  // CRUD Operations for Sales
  const addSale = useCallback(
    async (sale: Omit<Sale, "id">) => {
      if (!db || !userId || !APP_ID) return;
      try {
        await addDoc(collection(db, `artifacts/${APP_ID}/users/${userId}/sales`), sale);
        console.log("Sale added successfully.");

        const soldCar = cars.find((c) => c.id === sale.carId);
        if (soldCar) {
          // Automatically update car status to 'Sold'
          await updateCar({ ...soldCar, status: "Sold" });
        }
        setShowSaleModal(false);
      } catch (e: any) {
        console.error("Error adding sale: ", e);
        setError(`Error adding sale: ${e.message}`);
      }
    },
    [userId, cars, updateCar]
  ); // `updateCar` is a dependency because it's called here

  const updateSale = useCallback(
    async (sale: Sale) => {
      if (!db || !userId || !APP_ID || !sale.id) return;
      try {
        const saleRef = doc(db, `artifacts/${APP_ID}/users/${userId}/sales`, sale.id);
        await setDoc(saleRef, sale, { merge: true });
        console.log("Sale updated successfully.");
        setShowSaleModal(false);
        setEditingSale(null);
      } catch (e: any) {
        console.error("Error updating sale: ", e);
        setError(`Error updating sale: ${e.message}`);
      }
    },
    [userId]
  );

  const deleteSale = useCallback(
    async (id: string) => {
      if (!db || !userId || !APP_ID) return;
      if (!window.confirm("Are you sure you want to delete this sale?")) return;
      try {
        const saleToDelete = sales.find((s) => s.id === id);
        if (saleToDelete) {
          // If a sale is deleted, check if its associated car should revert to 'Available'
          const soldCar = cars.find((c) => c.id === saleToDelete.carId);
          if (soldCar && soldCar.status === "Sold") {
            // Check if there are other sales for this car
            const salesForCar = sales.filter((s) => s.carId === soldCar.id && s.id !== id);
            if (salesForCar.length === 0) {
              // No other sales for this car, revert its status
              await updateCar({ ...soldCar, status: "Available" });
            }
          }
        }
        await deleteDoc(doc(db, `artifacts/${APP_ID}/users/${userId}/sales`, id));
        console.log("Sale deleted successfully.");
      } catch (e: any) {
        console.error("Error deleting sale: ", e);
        setError(`Error deleting sale: ${e.message}`);
      }
    },
    [userId, sales, cars, updateCar]
  ); // `sales`, `cars`, `updateCar` are dependencies here

  // Dashboard calculations
  const dashboardStats = useMemo(() => {
    const totalCars = cars.length;
    const availableCars = cars.filter((car) => car.status === "Available").length;
    const soldCars = cars.filter((car) => car.status === "Sold").length;
    const totalCustomers = customers.length;
    const totalSales = sales.length;

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const averageSalePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalCars,
      availableCars,
      soldCars,
      totalCustomers,
      totalSales,
      totalRevenue,
      averageSalePrice,
    };
  }, [cars, customers, sales]); // Dependencies for memoization

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading CRM...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  // Common styles for modals
  const modalOverlayClass =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  const modalContentClass =
    "bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300";
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClass = "px-4 py-2 rounded-md transition-colors duration-200";

  // Car Form Modal Component
  const CarFormModal: React.FC<{
    car?: Car | null;
    onClose: () => void;
    onSubmit: (car: Omit<Car, "id"> | Car) => void;
  }> = ({ car, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Car, "id"> | Car>(
      car || {
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        vin: "",
        status: "Available",
        imageUrl: "https://placehold.co/400x200/cccccc/333333?text=Car+Image",
      }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "year" || name === "price" ? Number(value) : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className={modalOverlayClass} data-state={showCarModal ? "open" : "closed"}>
        <div
          className={`${modalContentClass} ${
            showCarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">{car ? "Edit Car" : "Add New Car"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={inputClass}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={inputClass}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                VIN
              </label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                className={inputClass}
                required
                maxLength={17}
                minLength={17}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`${buttonClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
              >
                {car ? "Update Car" : "Add Car"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Customer Form Modal Component
  const CustomerFormModal: React.FC<{
    customer?: Customer | null;
    onClose: () => void;
    onSubmit: (customer: Omit<Customer, "id"> | Customer) => void;
  }> = ({ customer, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Customer, "id"> | Customer>(
      customer || { name: "", email: "", phone: "", address: "", notes: "" }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className={modalOverlayClass} data-state={showCustomerModal ? "open" : "closed"}>
        <div
          className={`${modalContentClass} ${
            showCarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-y`}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`${buttonClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
              >
                {customer ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Sale Form Modal Component
  const SaleFormModal: React.FC<{
    sale?: Sale | null;
    onClose: () => void;
    onSubmit: (sale: Omit<Sale, "id"> | Sale) => void;
    cars: Car[];
    customers: Customer[];
    userId: string | null;
  }> = ({ sale, onClose, onSubmit, cars, customers, userId }) => {
    const [formData, setFormData] = useState<Omit<Sale, "id"> | Sale>(
      sale || {
        carId: cars.find((c) => c.status === "Available")?.id || "", // Default to first available car
        customerId: customers[0]?.id || "", // Default to first customer
        saleDate: new Date().toISOString().split("T")[0],
        salePrice: 0,
        salespersonId: userId || "", // Auto-fill with current userId
      }
    );

    useEffect(() => {
      if (!sale) {
        // Only set defaults if it's a new sale
        setFormData((prev) => ({
          ...prev,
          carId: cars.find((c) => c.status === "Available")?.id || "",
          customerId: customers[0]?.id || "",
          salespersonId: userId || "",
        }));
      }
    }, [cars, customers, userId, sale]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "salePrice" ? Number(value) : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const availableCars = cars.filter(
      (c) => c.status === "Available" || (sale && c.id === sale.carId)
    );

    return (
      <div className={modalOverlayClass} data-state={showSaleModal ? "open" : "closed"}>
        <div
          className={`${modalContentClass} ${
            showCarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">{sale ? "Edit Sale" : "Add New Sale"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="carId" className="block text-sm font-medium text-gray-700">
                Car
              </label>
              <select
                id="carId"
                name="carId"
                value={formData.carId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select a Car</option>
                {availableCars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.vin}) - {formatCurrency(car.price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select a Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700">
                Sale Date
              </label>
              <input
                type="date"
                id="saleDate"
                name="saleDate"
                value={formData.saleDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                className={inputClass}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="salespersonId" className="block text-sm font-medium text-gray-700">
                Salesperson ID (Your User ID)
              </label>
              <input
                type="text"
                id="salespersonId"
                name="salespersonId"
                value={formData.salespersonId}
                onChange={handleChange}
                className={inputClass}
                readOnly
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`${buttonClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
              >
                {sale ? "Update Sale" : "Add Sale"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden font-inter">
      {/* Header with User ID */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold">VELOCITY - Car CRM</h1>
        {userId && (
          <div className="text-sm bg-blue-700/50 px-3 py-1 rounded-full flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              User ID: <span className="font-mono text-xs break-all">{userId}</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white shadow-sm border-b border-gray-200">
        <TabButton
          label="Dashboard"
          tab="dashboard"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          label="Inventory"
          tab="inventory"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          label="Customers"
          tab="customers"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton label="Sales" tab="sales" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton
          label="Analytics"
          tab="analytics"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "dashboard" && <Dashboard stats={dashboardStats} cars={cars} />}

        {activeTab === "inventory" && (
          <InventorySection
            cars={cars}
            onAdd={() => {
              setEditingCar(null);
              setShowCarModal(true);
            }}
            onEdit={(car) => {
              setEditingCar(car);
              setShowCarModal(true);
            }}
            onDelete={deleteCar}
          />
        )}

        {activeTab === "customers" && (
          <CustomerSection
            customers={customers}
            onAdd={() => {
              setEditingCustomer(null);
              setShowCustomerModal(true);
            }}
            onEdit={(customer) => {
              setEditingCustomer(customer);
              setShowCustomerModal(true);
            }}
            onDelete={deleteCustomer}
          />
        )}

        {activeTab === "sales" && (
          <SaleSection
            sales={sales}
            cars={cars}
            customers={customers}
            onAdd={() => {
              setEditingSale(null);
              setShowSaleModal(true);
            }}
            onEdit={(sale) => {
              setEditingSale(sale);
              setShowSaleModal(true);
            }}
            onDelete={deleteSale}
          />
        )}

        {activeTab === "analytics" && <InventoryAnalytics cars={cars} />}
      </div>

      {/* Modals */}
      {showCarModal && (
        <CarFormModal
          car={editingCar}
          onClose={() => {
            setShowCarModal(false);
            setEditingCar(null);
          }}
          onSubmit={editingCar ? updateCar : addCar}
        />
      )}
      {showCustomerModal && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => {
            setShowCustomerModal(false);
            setEditingCustomer(null);
          }}
          onSubmit={editingCustomer ? updateCustomer : addCustomer}
        />
      )}
      {showSaleModal && (
        <SaleFormModal
          sale={editingSale}
          onClose={() => {
            setShowSaleModal(false);
            setEditingSale(null);
          }}
          onSubmit={editingSale ? updateSale : addSale}
          cars={cars}
          customers={customers}
          userId={userId}
        />
      )}
    </div>
  );
}

interface DashboardProps {
  stats: {
    totalCars: number;
    availableCars: number;
    soldCars: number;
    totalCustomers: number;
    totalSales: number;
    totalRevenue: number;
    averageSalePrice: number;
  };
  cars: Car[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, cars }) => {
  const statCardClass =
    "bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300";
  const statValueClass = "text-4xl font-bold text-blue-600 mb-2";
  const statLabelClass = "text-xl text-gray-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalCars}</div>
        <div className={statLabelClass}>Total Cars</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.availableCars}</div>
        <div className={statLabelClass}>Available Cars</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.soldCars}</div>
        <div className={statLabelClass}>Cars Sold</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalCustomers}</div>
        <div className={statLabelClass}>Total Customers</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalSales}</div>
        <div className={statLabelClass}>Total Sales</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{formatCurrency(stats.totalRevenue)}</div>
        <div className={statLabelClass}>Total Revenue</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{formatCurrency(stats.averageSalePrice)}</div>
        <div className={statLabelClass}>Avg. Sale Price</div>
      </div>
      <InventoryAnalytics cars={cars} />
    </div>
  );
};

interface InventorySectionProps {
  cars: Car[];
  onAdd: () => void;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({ cars, onAdd, onEdit, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Car Inventory</h2>
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
          <span>Add New Car</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No cars in inventory. Add one!
          </p>
        ) : (
          cars.map((car) => <CarCard key={car.id} car={car} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
};

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img
        src={car.imageUrl}
        alt={`${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=${car.make}+${car.model}`;
        }}
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-gray-700 mb-1">
          Price: <span className="font-semibold text-blue-600">{formatCurrency(car.price)}</span>
        </p>
        <p className="text-gray-700 mb-1">
          VIN: <span className="font-mono text-sm">{car.vin}</span>
        </p>
        <p className="text-gray-700 mb-3">
          Status:
          <span
            className={`font-semibold ml-2 px-2 py-1 rounded-full text-sm ${car.status === "Available" ? "bg-green-100 text-green-800" : car.status === "Sold" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {car.status}
          </span>
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => onEdit(car)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => car.id && onDelete(car.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface CustomerSectionProps {
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

interface SaleSectionProps {
  sales: Sale[];
  cars: Car[];
  customers: Customer[];
  onAdd: () => void;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

const SaleSection: React.FC<SaleSectionProps> = ({
  sales,
  cars,
  customers,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const getCarDetails = (carId: string) => cars.find((c) => c.id === carId);
  const getCustomerDetails = (customerId: string) => customers.find((c) => c.id === customerId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sales Records</h2>
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
          <span>Record New Sale</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salesperson ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const car = getCarDetails(sale.carId);
                const customer = getCustomerDetails(sale.customerId);
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.saleDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {car ? `${car.year} ${car.make} ${car.model}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {customer ? customer.name : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(sale.salePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono text-xs break-all">
                      {sale.salespersonId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => onEdit(sale)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => sale.id && onDelete(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
