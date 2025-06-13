"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { CarItem } from "@/components/apps/CRM/types";
import { useState } from "react";

interface InventoryTableProps {
  inventory: CarItem[];
}

export default function InventoryTable({ inventory }: InventoryTableProps): JSX.Element {
  const [search, setSearch] = useState("");
  const filtered = inventory.filter(
    (car) =>
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>Car Inventory</CardHeader>
      <CardBody>
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Search />}
          />
        </div>
        <Table aria-label="Inventory table">
          <TableHeader>
            <TableColumn>Make</TableColumn>
            <TableColumn>Model</TableColumn>
            <TableColumn>Year</TableColumn>
            <TableColumn>Price ($)</TableColumn>
          </TableHeader>
          <TableBody>
            {filtered.map((car) => (
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
  );
}
