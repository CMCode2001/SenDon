package com.blooddonation.enums;

public enum ResponseStatus {
    PENDING("En attente"),
    ACCEPTED("Acceptée"),
    DECLINED("Refusée"),
    COMPLETED("Complétée");

    private final String displayName;

    ResponseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}