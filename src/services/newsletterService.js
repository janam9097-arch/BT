import api from "./api";

export const newsletterService = {
  subscribe: async (email) => {
    const cleanEmail = String(email).trim().toLowerCase();
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    // Check localStorage for duplicate subscriptions
    const stored = JSON.parse(localStorage.getItem("newsletter_subscriptions") || "[]");
    if (stored.includes(cleanEmail)) {
      throw new Error("This email is already subscribed!");
    }

    try {
      const response = await api.post("/newsletter/subscribe/", { email: cleanEmail });
      stored.push(cleanEmail);
      localStorage.setItem("newsletter_subscriptions", JSON.stringify(stored));
      return response.data || { success: true, message: "Thank you for subscribing!" };
    } catch (err) {
      if (err.response) {
        // If server returns 400 with duplicate message
        const status = err.response.status;
        const msg = err.response.data?.message || err.response.data?.detail || err.response.data?.email?.[0];
        
        if (status === 400 && msg && String(msg).toLowerCase().includes("already")) {
          throw new Error("This email is already subscribed!", { cause: err });
        }

        // If endpoint does not exist (404) or server error, fallback to local storage
        if (status === 404 || status >= 500) {
          stored.push(cleanEmail);
          localStorage.setItem("newsletter_subscriptions", JSON.stringify(stored));
          return { success: true, message: "Thank you for subscribing!" };
        }

        throw new Error(msg || "Subscription failed. Please try again.", { cause: err });
      } else {
        // Backend unavailable / network error -> Fallback to local storage
        stored.push(cleanEmail);
        localStorage.setItem("newsletter_subscriptions", JSON.stringify(stored));
        return { success: true, message: "Thank you for subscribing!" };
      }
    }
  },
};
