package com.blooddonation.enums;

public enum UrgencyLevel {
    NORMAL("Normal"),
    URGENT("Urgent"),
    CRITICAL("Critique");

    private final String displayName;

    UrgencyLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}