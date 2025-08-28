type Teacher = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  education?: string;
  achievements?: string;
  avatarUrl?: string;
  createdAt: string;
};

type TeacherFormData = {
  name: string;
  email: string;
  phone: string;
  education: string;
  achievements: string;
  avatar?: File | null;
};
