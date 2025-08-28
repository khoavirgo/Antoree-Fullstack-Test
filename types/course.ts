type Course = {
  id: number;
  sku: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

  teacherId: number;
  teacher?: Teacher;
};
