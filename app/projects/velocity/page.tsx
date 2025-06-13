import CarSalesCrm from "@/components/apps/CRM/CarSalesCrm";
import { title } from "@/components/primitives";

export default function BlogPage() {
  return (
    <div className="w-full h-full">
      <div className="mt-10">
        <h1 className={title()}>VELOCITY - CRM</h1>
      </div>
      <div className="w-full">
        <CarSalesCrm />
      </div>
    </div>
  );
}
