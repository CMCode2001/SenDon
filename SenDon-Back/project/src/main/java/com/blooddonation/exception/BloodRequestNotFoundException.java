package com.blooddonation.exception;

public class BloodRequestNotFoundException extends RuntimeException {
    public BloodRequestNotFoundException(String message) {
        super(message);
    }
}