"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";

interface OffersPanelProps {
  offers: any[];
}

export default function OffersPanel({ offers }: OffersPanelProps): JSX.Element {
  return (
    <Card>
      <CardHeader>Current Offers</CardHeader>
      <CardBody>
        {offers.length === 0 ? (
          <p>No offers available yet.</p>
        ) : (
          <ul className="space-y-2">
            {offers.map((offer, index) => (
              <li key={index} className="border p-2 rounded-md">
                <pre>{JSON.stringify(offer, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
