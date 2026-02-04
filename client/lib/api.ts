// API client for making authenticated requests to the backend
const API_BASE = "/api";

// Token storage
let authToken: string | null = localStorage.getItem("authToken");

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: "corporate" | "ngo" | "volunteer" | "admin";
    organizationName?: string | null;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    longDescription?: string;
    location: string;
    fundingGoal: number;
    fundingReceived: number;
    status: "draft" | "active" | "completed";
    impactType?: string;
    impactValue?: string;
    carbonOffset?: string;
    image?: string;
    ngo: string;
    volunteers: number;
    milestones?: { id: number; name: string; completed: boolean }[];
    photos?: string[];
    isRegistered?: boolean;
}

export interface VolunteerStats {
    hoursVolunteered: number;
    projectsCompleted: number;
    certificatesEarned: number;
    impactScore: number;
}

// Set auth token
export function setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
        localStorage.setItem("authToken", token);
    } else {
        localStorage.removeItem("authToken");
    }
}

// Get current token
export function getAuthToken(): string | null {
    return authToken;
}

// Check if authenticated
export function isAuthenticated(): boolean {
    return !!authToken;
}

// API request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (authToken) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const text = await response.text();
    let data: any;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (err) {
        console.error(`Failed to parse JSON for ${endpoint}. Body:`, text);
        throw new Error(`Invalid server response for ${endpoint}`);
    }

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
}

// Auth API
export const authApi = {
    async register(data: {
        email: string;
        password: string;
        name: string;
        role: string;
        organizationName?: string;
    }) {
        const result = await apiRequest<{ user: AuthUser; token: string }>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
        setAuthToken(result.token);
        return result;
    },

    async login(email: string, password: string) {
        const result = await apiRequest<{ user: AuthUser; token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        setAuthToken(result.token);
        return result;
    },

    async logout() {
        setAuthToken(null);
        localStorage.removeItem("user");
    },

    async me() {
        return apiRequest<{ user: AuthUser }>("/auth/me");
    },

    async updateProfile(data: { name?: string; organizationName?: string }) {
        return apiRequest<{ user: AuthUser }>("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
};

// Projects API
export const projectsApi = {
    async list(params?: {
        search?: string;
        location?: string;
        status?: string;
        impactType?: string;
    }) {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set("search", params.search);
        if (params?.location) searchParams.set("location", params.location);
        if (params?.status) searchParams.set("status", params.status);
        if (params?.impactType) searchParams.set("impactType", params.impactType);

        const query = searchParams.toString();
        return apiRequest<{ projects: Project[] }>(`/projects${query ? `?${query}` : ""}`);
    },

    async get(id: number) {
        return apiRequest<Project>(`/projects/${id}`);
    },

    async create(data: Partial<Project>) {
        return apiRequest<{ project: Project }>("/projects", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: number, data: Partial<Project>) {
        return apiRequest<{ project: Project }>(`/projects/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async register(projectId: number) {
        return apiRequest<{ message: string }>(`/projects/${projectId}/register`, {
            method: "POST",
        });
    },

    async toggleMilestone(projectId: number, milestoneId: number) {
        return apiRequest<{ milestone: any }>(`/projects/${projectId}/milestones/${milestoneId}`, {
            method: "PUT",
        });
    },

    async delete(id: number) {
        return apiRequest<{ message: string }>(`/projects/${id}`, {
            method: "DELETE",
        });
    },
};

// Volunteers API
export const volunteersApi = {
    async myProjects() {
        return apiRequest<{ projects: any[] }>("/volunteers/my-projects");
    },

    async stats() {
        return apiRequest<VolunteerStats>("/volunteers/stats");
    },

    async certificates() {
        return apiRequest<{ certificates: any[] }>("/volunteers/certificates");
    },

    async logHours(projectId: number, hours: number) {
        return apiRequest<{ message: string }>("/volunteers/log-hours", {
            method: "PUT",
            body: JSON.stringify({ projectId, hours }),
        });
    },
};

// Stats API
export const statsApi = {
    async platform() {
        return apiRequest<any>("/stats/platform");
    },

    async ngo() {
        return apiRequest<any>("/stats/ngo");
    },

    async corporate() {
        return apiRequest<any>("/stats/corporate");
    },

    async public() {
        return apiRequest<any>("/stats/public");
    },
};

// Users API (Admin only)
export const usersApi = {
    async list() {
        return apiRequest<{ users: AuthUser[] }>("/users");
    },
    async delete(id: number) {
        return apiRequest<{ message: string }>(`/users/${id}`, {
            method: "DELETE",
        });
    },
};

// NGO API
export const ngoApi = {
    async volunteers() {
        return apiRequest<{ volunteers: any[] }>("/ngo/volunteers");
    },
    async funding() {
        return apiRequest<{ funding: any[] }>("/ngo/funding");
    },
};
