const API = "http://localhost:8081";

export const base44 = {
  auth: {
    redirectToLogin() {
      window.location.href = `${API}/oauth2/authorization/google`;
    },

    async me() {
      const response = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Authentication check failed");
      }

      return response.json();
    },

    logout() {
      window.location.href = `${API}/logout`;
    },
  },
};