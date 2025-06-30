package com.blooddonation.dto;

import com.blooddonation.enums.BloodType;
import com.blooddonation.enums.RequestStatus;
import com.blooddonation.enums.UrgencyLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BloodRequestResponseDto {
    
    private Long id;
    private BloodType bloodType;
    private BigDecimal quantityMl;
    private UrgencyLevel urgencyLevel;
    private String description;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer searchRadiusKm;
    private String hospitalAddress;
    private String hospitalName;
    private String contactPhone;
    private String contactEmail;
    private LocalDateTime deadline;
    private RequestStatus status;
    private String notes;
    private Long hospitalUserId;
    private String hospitalUserName;
    private Integer responseCount;
    private Integer pendingResponseCount;
    private Integer acceptedResponseCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructeurs
    public BloodRequestResponseDto() {}
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public BloodType getBloodType() {
        return bloodType;
    }
    
    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }
    
    public BigDecimal getQuantityMl() {
        return quantityMl;
    }
    
    public void setQuantityMl(BigDecimal quantityMl) {
        this.quantityMl = quantityMl;
    }
    
    public UrgencyLevel getUrgencyLevel() {
        return urgencyLevel;
    }
    
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getLatitude() {
        return latitude;
    }
    
    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
    
    public BigDecimal getLongitude() {
        return longitude;
    }
    
    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
    
    public Integer getSearchRadiusKm() {
        return searchRadiusKm;
    }
    
    public void setSearchRadiusKm(Integer searchRadiusKm) {
        this.searchRadiusKm = searchRadiusKm;
    }
    
    public String getHospitalAddress() {
        return hospitalAddress;
    }
    
    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }
    
    public String getHospitalName() {
        return hospitalName;
    }
    
    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }
    
    public String getContactPhone() {
        return contactPhone;
    }
    
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
    
    public String getContactEmail() {
        return contactEmail;
    }
    
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }
    
    public LocalDateTime getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    
    public RequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Long getHospitalUserId() {
        return hospitalUserId;
    }
    
    public void setHospitalUserId(Long hospitalUserId) {
        this.hospitalUserId = hospitalUserId;
    }
    
    public String getHospitalUserName() {
        return hospitalUserName;
    }
    
    public void setHospitalUserName(String hospitalUserName) {
        this.hospitalUserName = hospitalUserName;
    }
    
    public Integer getResponseCount() {
        return responseCount;
    }
    
    public void setResponseCount(Integer responseCount) {
        this.responseCount = responseCount;
    }
    
    public Integer getPendingResponseCount() {
        return pendingResponseCount;
    }
    
    public void setPendingResponseCount(Integer pendingResponseCount) {
        this.pendingResponseCount = pendingResponseCount;
    }
    
    public Integer getAcceptedResponseCount() {
        return acceptedResponseCount;
    }
    
    public void setAcceptedResponseCount(Integer acceptedResponseCount) {
        this.acceptedResponseCount = acceptedResponseCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}