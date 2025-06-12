"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@heroui/tabs";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@heroui/table";
import { PlusCircle, Car, DollarSign, Search } from "lucide-react";
import { useState } from "react";

interface CarItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
}

const mockInventory: CarItem[] = [
  { id: "1", make: "Tesla", model: "Model 3", year: 2023, price: 42000 },
  { id: "2", make: "Ford", model: "Mustang", year: 2022, price: 38000 },
];

export default function CarSalesCRM(): JSX.Element {
  const [inventory, setInventory] = useState<CarItem[]>(mockInventory);
  const [offers, setOffers] = useState<any[]>([]); // We'll type this properly later

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="inventory">
            <Car className="inline-block w-4 h-4 mr-2" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="offers">
            <DollarSign className="inline-block w-4 h-4 mr-2" /> Offers
          </TabsTrigger>
          <TabsTrigger value="add">
            <PlusCircle className="inline-block w-4 h-4 mr-2" /> Add Car
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>Car Inventory</CardHeader>
            <CardBody>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search cars..." startContent={<Search />} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>{car.make}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{car.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>Current Offers</CardHeader>
            <CardBody>
              <p>No offers available yet.</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>Add New Car</CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Make" placeholder="e.g. Toyota" />
                <Input label="Model" placeholder="e.g. Corolla" />
                <Input label="Year" placeholder="e.g. 2023" type="number" />
                <Input label="Price" placeholder="e.g. 20000" type="number" />
              </div>
              <Button className="mt-4">Add Car</Button>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
