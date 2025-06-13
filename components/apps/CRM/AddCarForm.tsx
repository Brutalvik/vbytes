"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";
import { CarItem } from "@components/apps/CRM/types";

interface AddCarFormProps {
  onAdd: (car: CarItem) => void;
}

export default function AddCarForm({ onAdd }: AddCarFormProps): JSX.Element {
  const [form, setForm] = useState({ make: "", model: "", year: "", price: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newCar: CarItem = {
      id: Date.now().toString(),
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      price: parseFloat(form.price),
    };
    onAdd(newCar);
    setForm({ make: "", model: "", year: "", price: "" });
  };

  return (
    <Card>
      <CardHeader>Add New Car</CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Make"
            name="make"
            placeholder="e.g. Toyota"
            value={form.make}
            onChange={handleChange}
          />
          <Input
            label="Model"
            name="model"
            placeholder="e.g. Corolla"
            value={form.model}
            onChange={handleChange}
          />
          <Input
            label="Year"
            name="year"
            placeholder="e.g. 2023"
            type="number"
            value={form.year}
            onChange={handleChange}
          />
          <Input
            label="Price"
            name="price"
            placeholder="e.g. 20000"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <Button className="mt-4" onClick={handleSubmit}>
          Add Car
        </Button>
      </CardBody>
    </Card>
  );
}
