package com.blooddonation.enums;

public enum RequestStatus {
    ACTIVE("Active"),
    COMPLETED("Complétée"),
    CANCELLED("Annulée"),
    EXPIRED("Expirée");

    private final String displayName;

    RequestStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}