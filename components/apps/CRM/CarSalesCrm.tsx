// src/components/apps/CRM/CarSalesCrm.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth, APP_ID } from "@components/apps/CRM/lib/firebase";
import InventoryAnalytics from "./sections/InventoryAnalytics";

//COMPONENTS
import TabButton, { TabType } from "@crm/TabButton";
import CarFormModal from "@crm/modals/CarFormModal";
import InventorySection from "@crm/sections/CarInventorySection";
import CustomerFormModal from "@crm/modals/CustomerFormModal";
import SaleFormModal from "@crm/modals/SaleFormModal";
import SaleSection from "@crm/sections/SaleSection";
import Dashboard from "@crm/sections/Dashboard";
import CustomerSection, { Customer } from "@crm/sections/CustomerSection";

// Define interfaces for data models
export interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  status: "Available" | "Sold" | "Pending";
  imageUrl: string;
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
      if (!db || !userId || !APP_ID) return;
      try {
        await addDoc(collection(db, `artifacts/${APP_ID}/users/${userId}/cars`), {
          ...car,
          createdAt: serverTimestamp(), // ← adds ISO timestamp
        });
        setShowCarModal(false);
      } catch (e: any) {
        console.error("Error adding car: ", e);
        setError(`Error adding car: ${e.message}`);
      }
    },
    [userId]
  );
  // `db` and `APP_ID` are not dependencies as they are constant imports

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
        {activeTab === "dashboard" && <Dashboard stats={dashboardStats} />}

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
      <CarFormModal
        show={showCarModal}
        car={editingCar}
        onClose={() => {
          setShowCarModal(false);
          setEditingCar(null);
        }}
        onSubmit={editingCar ? updateCar : addCar}
      />
      {showCustomerModal && (
        <CustomerFormModal
          show={showCustomerModal}
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
          show={showSaleModal}
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
