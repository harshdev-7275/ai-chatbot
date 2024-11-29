import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type cardProp = {
  cardTitle: string;
  submissionEndpoint?: string;
  fields: [
    {
      heading: string;
      content: string;
    }
  ];
};

const DynamicCard = ({ cardTitle, fields }: cardProp) => {
    console.log("fields", fields, cardTitle)
  return (
    <Card className="w-[350px] bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-white">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-x-7 gap-y-5">
        {fields.map((field, index) => (
          <div key={index}>
            <Label className="flex text-white items-center gap-x-2">
              {field.heading} :{" "}
              <CardDescription>{field.content}</CardDescription>
            </Label>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Submit</Button>
      </CardFooter>
    </Card>
  );
};

export default DynamicCard;