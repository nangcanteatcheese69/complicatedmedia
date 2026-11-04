export const DELIVERIES = [
  {
    id: "pickup",
    label: "Studio pickup",
    detail: "Arranged by email. No shipping charge.",
    cents: 0,
  },
  {
    id: "domestic",
    label: "Domestic shipping",
    detail: "Tracked, within the country on the address.",
    cents: 2400,
  },
  {
    id: "international",
    label: "International shipping",
    detail: "Tracked. Duties, if any, are paid on delivery.",
    cents: 6800,
  },
] as const;

export type DeliveryId = (typeof DELIVERIES)[number]["id"];

export const COUNTRIES = [
  "Myanmar",
  "Thailand",
  "Singapore",
  "Japan",
  "Australia",
  "United Kingdom",
  "Germany",
  "United States",
  "Canada",
  "Other",
] as const;

export function getDelivery(id: string) {
  return DELIVERIES.find((item) => item.id === id);
}
