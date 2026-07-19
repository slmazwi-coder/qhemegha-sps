import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export interface Page {
  slug: string;
  title: string;
  body: Record<string, unknown>;
  updated_at?: string;
  updated_by?: string | null;
}

export interface NewsItem {
  id?: string;
  title: string;
  body: string;
  image_url: string | null;
  published_at?: string;
  created_by?: string | null;
}

export interface StaffMember {
  id?: string;
  full_name: string;
  role_title: string;
  photo_url: string | null;
  display_order: number;
}

export interface Application {
  id?: string;
  learner_name: string;
  learner_dob: string | null;
  grade_applying_for: string;
  parent_name: string;
  parent_contact: string;
  parent_email: string | null;
  address: string | null;
  supporting_docs: string[] | null;
  status: "pending" | "approved" | "rejected";
  internal_notes: string | null;
  submitted_at?: string;
}

export interface StaffUser {
  id?: string;
  full_name: string;
  role: "admin" | "editor";
  created_at?: string;
}

const defaultPages: Record<string, Page> = {
  home: {
    slug: "home",
    title: "Qhemegha Senior Primary School",
    body: {
      heroTitle: "Qhemegha Senior Primary School",
      heroSubtitle: "Sebenza Uphumelela — Work to succeed",
      principalName: "Mr Lwandiso Maqhubu",
      principalWelcome:
        "Welcome to Qhemegha Senior Primary School. Our school is a place where every child is given the chance to learn, grow and build a bright future. We believe that when learners work hard and support one another, success follows. We are proud of our community and the achievements of our learners.",
      highlights: [
        {
          title: "Eastern Cape Chess Championships",
          description:
            "Our learners competed at the Eastern Cape Chess Championships, representing the school with pride.",
          image: "/images/IMG-20260715-WA0054.jpg",
        },
        {
          title: "District Maths Quiz 2023",
          description:
            "Learners brought home certificates from the Eastern Cape Maths Quiz, showing dedication and teamwork.",
          image: "/images/IMG-20260715-WA0052.jpg",
        },
      ],
    },
  },
  about: {
    slug: "about",
    title: "About Qhemegha Senior Primary School",
    body: {
      history:
        "Qhemegha Senior Primary School serves the rural community of Qhemegha in the Eastern Cape. For many years we have been the place where local children begin their journey toward a better future. Our school is built on the values of hard work, respect and community.",
      vision:
        "To be a school where every learner reaches their full potential and becomes a confident, caring member of the community.",
      mission:
        "We provide quality education in a safe and supportive environment, guided by dedicated teachers and the active involvement of parents.",
    },
  },
  academics: {
    slug: "academics",
    title: "Academics",
    body: {
      overview:
        "We follow the CAPS curriculum and offer a balanced programme that builds strong foundations in literacy, numeracy and life skills. Our teachers work closely with learners to help them understand their work and prepare for the next phase of schooling.",
      gradesOffered: "Grades 4 to 7",
      subjects: [
        "Home Language",
        "First Additional Language",
        "Mathematics",
        "Natural Sciences and Technology",
        "Social Sciences",
        "Life Skills",
        "Creative Arts",
      ],
    },
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    body: {
      address: "Qhemegha Village, Alfred Nzo District, Eastern Cape, South Africa",
      phone: "+27 00 000 0000",
      email: "info@qhemegha-sps.co.za",
      mapEmbed: "",
    },
  },
};

const defaultNews: NewsItem[] = [
  {
    title: "Chess success at the Eastern Cape Championships",
    body: "Our learners took part in the Eastern Cape Chess Championships and made the school proud. Chess helps our learners think critically and plan ahead.",
    image_url: "/images/IMG-20260715-WA0054.jpg",
  },
  {
    title: "Maths Quiz 2023 certificates",
    body: "Learners and educators received certificates for their participation and performance in the district Maths Quiz. Well done to everyone involved.",
    image_url: "/images/IMG-20260715-WA0052.jpg",
  },
];

const defaultStaff: StaffMember[] = [
  {
    full_name: "Mr Lwandiso Maqhubu",
    role_title: "Principal",
    photo_url: "/images/IMG-20260715-WA0053.jpg",
    display_order: 1,
  },
  {
    full_name: "Mrs N. Mbali",
    role_title: "Deputy Principal",
    photo_url: "/images/IMG-20260715-WA0051.jpg",
    display_order: 2,
  },
];

export async function getPage(slug: string): Promise<Page> {
  if (!hasEnvVars) return defaultPages[slug] || defaultPages.home;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return defaultPages[slug] || defaultPages.home;
  return data as Page;
}

export async function getNews(): Promise<NewsItem[]> {
  if (!hasEnvVars) return defaultNews;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .order("published_at", { ascending: false });
  if (error || !data) return defaultNews;
  return data as NewsItem[];
}

export async function getStaffDirectory(): Promise<StaffMember[]> {
  if (!hasEnvVars) return defaultStaff;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_directory")
    .select("*")
    .order("display_order", { ascending: true });
  if (error || !data) return defaultStaff;
  return data as StaffMember[];
}

export async function getApplications(): Promise<Application[]> {
  if (!hasEnvVars) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error || !data) return [];
  return data as Application[];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (!hasEnvVars) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Application;
}

export async function getCurrentStaff() {
  if (!hasEnvVars) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("staff_users")
    .select("*")
    .eq("id", user.id)
    .single();
  return { user, staff: data as StaffUser | null };
}

export async function isAdmin(): Promise<boolean> {
  if (!hasEnvVars) return false;
  const session = await getCurrentStaff();
  return session?.staff?.role === "admin";
}
