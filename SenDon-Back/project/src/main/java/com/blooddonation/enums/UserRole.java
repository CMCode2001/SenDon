package com.blooddonation.enums;

public enum UserRole {
    USER("Utilisateur"),
    HOSPITAL("Hôpital"),
    ADMIN("Administrateur");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}