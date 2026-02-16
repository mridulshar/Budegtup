package com.budgetup.payload.response;

public class AuthResponse {

    private String message;
    private String token;        // JWT token (for login)
    private UserInfo user;

    // Empty constructor
    public AuthResponse() {
    }

    // Constructor for Signup (no token yet)
    public AuthResponse(String message, UserInfo user) {
        this.message = message;
        this.user = user;
    }

    // Constructor for Login (with token)
    public AuthResponse(String message, String token, UserInfo user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    // Nested class for user information
    public static class UserInfo {
        private String id;
        private String email;
        private String name;
        private Boolean isOnboarded;

        // Empty constructor
        public UserInfo() {
        }

        // Constructor with fields
        public UserInfo(String id, String email, String name, Boolean isOnboarded) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.isOnboarded = isOnboarded;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Boolean getIsOnboarded() {
            return isOnboarded;
        }

        public void setIsOnboarded(Boolean isOnboarded) {
            this.isOnboarded = isOnboarded;
        }
    }
}
