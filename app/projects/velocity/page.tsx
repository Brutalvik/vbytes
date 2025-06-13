import CarSalesCrm from "@/components/apps/CRM/CarSalesCrm";
import { Toaster } from "react-hot-toast";

export default function BlogPage() {
  return (
    <>
      <Toaster position="top-right" />
      <CarSalesCrm />
    </>
  );
}
