package com.blooddonation.dto;

import com.blooddonation.enums.ResponseStatus;
import java.time.LocalDateTime;

public class BloodRequestResponseResponseDto {

    private Long id;
    private ResponseStatus status;
    private String message;
    private LocalDateTime responseDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long bloodRequestId;
    private String bloodRequestDescription;
    private String hospitalName;

    private Long donorUserId;
    private String donorUserName;
    private String donorUserEmail;
    private String donorUserPhone;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ResponseStatus getStatus() { return status; }
    public void setStatus(ResponseStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getResponseDate() { return responseDate; }
    public void setResponseDate(LocalDateTime responseDate) { this.responseDate = responseDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getBloodRequestId() { return bloodRequestId; }
    public void setBloodRequestId(Long bloodRequestId) { this.bloodRequestId = bloodRequestId; }

    public String getBloodRequestDescription() { return bloodRequestDescription; }
    public void setBloodRequestDescription(String bloodRequestDescription) { this.bloodRequestDescription = bloodRequestDescription; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public Long getDonorUserId() { return donorUserId; }
    public void setDonorUserId(Long donorUserId) { this.donorUserId = donorUserId; }

    public String getDonorUserName() { return donorUserName; }
    public void setDonorUserName(String donorUserName) { this.donorUserName = donorUserName; }

    public String getDonorUserEmail() { return donorUserEmail; }
    public void setDonorUserEmail(String donorUserEmail) { this.donorUserEmail = donorUserEmail; }

    public String getDonorUserPhone() { return donorUserPhone; }
    public void setDonorUserPhone(String donorUserPhone) { this.donorUserPhone = donorUserPhone; }
}
