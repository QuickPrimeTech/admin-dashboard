import { createResponse } from "@/helpers/api-responses";

export async function POST(request: Request) {
  const formValues = await request.formData();
  console.log("------Form values----------", formValues);

  return createResponse(200, "Offer created successfully", formValues);
}
