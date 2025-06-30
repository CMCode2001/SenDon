package com.blooddonation.dto;

import com.blooddonation.enums.BloodType;
import com.blooddonation.enums.UrgencyLevel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BloodRequestDto {
    
    @NotNull(message = "Le groupe sanguin est obligatoire")
    private BloodType bloodType;
    
    @NotNull(message = "La quantité est obligatoire")
    @DecimalMin(value = "0.1", message = "La quantité doit être supérieure à 0")
    private BigDecimal quantityMl;
    
    @NotNull(message = "Le niveau d'urgence est obligatoire")
    private UrgencyLevel urgencyLevel;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;
    
    @NotNull(message = "La latitude est obligatoire")
    @DecimalMin(value = "-90.0", message = "Latitude invalide")
    @DecimalMax(value = "90.0", message = "Latitude invalide")
    private BigDecimal latitude;
    
    @NotNull(message = "La longitude est obligatoire")
    @DecimalMin(value = "-180.0", message = "Longitude invalide")
    @DecimalMax(value = "180.0", message = "Longitude invalide")
    private BigDecimal longitude;
    
    @NotNull(message = "Le rayon de recherche est obligatoire")
    @Min(value = 1, message = "Le rayon doit être d'au moins 1 km")
    @Max(value = 500, message = "Le rayon ne peut pas dépasser 500 km")
    private Integer searchRadiusKm;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 500, message = "L'adresse ne peut pas dépasser 500 caractères")
    private String hospitalAddress;
    
    @NotBlank(message = "Le nom de l'hôpital est obligatoire")
    @Size(max = 200, message = "Le nom de l'hôpital ne peut pas dépasser 200 caractères")
    private String hospitalName;
    
    @NotBlank(message = "Le numéro de contact est obligatoire")
    private String contactPhone;
    
    @Email(message = "Format d'email invalide")
    private String contactEmail;
    
    @NotNull(message = "La date limite est obligatoire")
    @Future(message = "La date limite doit être dans le futur")
    private LocalDateTime deadline;
    
    @Size(max = 1000, message = "Les notes ne peuvent pas dépasser 1000 caractères")
    private String notes;
    
    // Constructeurs
    public BloodRequestDto() {}
    
    // Getters et Setters
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
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}