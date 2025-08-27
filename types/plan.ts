type Plan = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
};

type Course = {
  id: number;
  sku: string;
  title: string;
  price: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};
