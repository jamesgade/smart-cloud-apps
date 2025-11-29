import type { AuthProvider } from "@refinedev/core";
import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "./constants";
import axios from "axios";

export const authProvider: AuthProvider = {
  login: async ({ email, password, path, phone, otp, loginType }) => {
    try {
      let response;
      // Check if this is a student login (phone + OTP)
      if (loginType === 'student' && phone) {
        const payload = otp ? { mobilePhone: phone, otp } : { mobilePhone: phone };
        response = await axios.post(`${API_BASE_URL}/auth/signin-student`, payload);
      } else {
        // Regular admin/user login
        response = await axios.post(`${API_BASE_URL}/auth/signin`, {
          username: email,
          password,
          path
        });
      }
      const { accessToken, identifier, refreshToken } = response.data;
      localStorage.setItem('ACCESS_TOKEN_KEY', accessToken);
      localStorage.setItem('IDENTIFIER', identifier);
      localStorage.setItem('REFRESH_TOKEN', refreshToken);
      
      return {
        success: true,
        redirectTo: "/dashboard",
        successNotification: {
          message: "Logged in successfully"
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: {
            name: error.response.data?.message || 'Login failed',
            message: error.response.data?.message || error.response.data,
          },
        };
      }

      return {
        success: false,
        error: {
          name: 'Something went wrong!',
          message: "Error Logging In!",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem('ACCESS_TOKEN_KEY');
    localStorage.removeItem('REFRESH_TOKEN');
    localStorage.removeItem('IDENTIFIER');
    return {
      success: true,
      redirectTo: "/",
    };
  },
  forgotPassword: async ({ email }) => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/auth/forgotPassword`, {
        email: email,
        // domain: APP_DOMAIN,
      });

      return {
        success: true,
        successNotification: {
          message: "Password reset link has been sent to your registered email.",
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: {
            name: 'Something went wrong!',
            message: "Error sending reset password link!",
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: 'Something went wrong!',
        message: "Error sending reset password link!",
      },
    };
  },
  updatePassword: async ({ password, email, token }) => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/auth/resetPassword`, {
        email,
        password,
        token,
        // domain: APP_DOMAIN,
      });

      return {
        success: true,
        successNotification: {
          message: "New password set successfully. Please login!.",
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: {
            name: 'Something went wrong!',
            message: error.response.data,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "Something went wrong!",
        message: "Error resetting password.",
      },
    };
  },
  check: async () => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/",
    };
  },
  getPermissions: async (params: any) => {
    try {
      const permissions = await axiosInstance.get(`${API_BASE_URL}/user-permission`);
      if (permissions) {
        return permissions?.data;
      } else {
        return [];
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: {
            name: 'Error Fetching User Permissions!',
            message: error.response.data,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: 'Error Fetching User Permissions!',
        message: 'Something went wrong.',
      },
    };
  },
  getIdentity: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/auth/current-user`);
      const userData = response.data;
      return userData;
    } catch (error) {
      return null
    }
  },
  onError: async (error) => {
    return { error };
  },
};