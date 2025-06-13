export interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  status: "Available" | "Sold" | "Pending";
  imageUrl: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export interface InventorySectionProps {
  cars: Car[];
  onAdd: () => void;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

export interface InventoryAnalyticsProps {
  cars: Car[];
}
