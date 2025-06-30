package com.blooddonation.entity;

import com.blooddonation.enums.BloodType;
import com.blooddonation.enums.RequestStatus;
import com.blooddonation.enums.UrgencyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blood_requests")
public class BloodRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Le groupe sanguin est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type", nullable = false)
    private BloodType bloodType;
    
    @NotNull(message = "La quantité est obligatoire")
    @DecimalMin(value = "0.1", message = "La quantité doit être supérieure à 0")
    @Column(name = "quantity_ml", nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityMl;
    
    @NotNull(message = "Le niveau d'urgence est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false)
    private UrgencyLevel urgencyLevel;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    @Column(name = "description", nullable = false, length = 1000)
    private String description;
    
    @NotNull(message = "La latitude est obligatoire")
    @DecimalMin(value = "-90.0", message = "Latitude invalide")
    @DecimalMax(value = "90.0", message = "Latitude invalide")
    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @NotNull(message = "La longitude est obligatoire")
    @DecimalMin(value = "-180.0", message = "Longitude invalide")
    @DecimalMax(value = "180.0", message = "Longitude invalide")
    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @NotNull(message = "Le rayon de recherche est obligatoire")
    @Min(value = 1, message = "Le rayon doit être d'au moins 1 km")
    @Max(value = 500, message = "Le rayon ne peut pas dépasser 500 km")
    @Column(name = "search_radius_km", nullable = false)
    private Integer searchRadiusKm;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 500, message = "L'adresse ne peut pas dépasser 500 caractères")
    @Column(name = "hospital_address", nullable = false, length = 500)
    private String hospitalAddress;
    
    @NotBlank(message = "Le nom de l'hôpital est obligatoire")
    @Size(max = 200, message = "Le nom de l'hôpital ne peut pas dépasser 200 caractères")
    @Column(name = "hospital_name", nullable = false, length = 200)
    private String hospitalName;
    
    @NotBlank(message = "Le numéro de contact est obligatoire")
    @Column(name = "contact_phone", nullable = false)
    private String contactPhone;
    
    @Email(message = "Format d'email invalide")
    @Column(name = "contact_email")
    private String contactEmail;
    
    @NotNull(message = "La date limite est obligatoire")
    @Future(message = "La date limite doit être dans le futur")
    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;
    
    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.ACTIVE;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_user_id", nullable = false)
    private User hospitalUser;
    
    @OneToMany(mappedBy = "bloodRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BloodRequestResponse> responses = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructeurs
    public BloodRequest() {}
    
    public BloodRequest(BloodType bloodType, BigDecimal quantityMl, UrgencyLevel urgencyLevel,
                       String description, BigDecimal latitude, BigDecimal longitude,
                       Integer searchRadiusKm, String hospitalAddress, String hospitalName,
                       String contactPhone, LocalDateTime deadline, User hospitalUser) {
        this.bloodType = bloodType;
        this.quantityMl = quantityMl;
        this.urgencyLevel = urgencyLevel;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.searchRadiusKm = searchRadiusKm;
        this.hospitalAddress = hospitalAddress;
        this.hospitalName = hospitalName;
        this.contactPhone = contactPhone;
        this.deadline = deadline;
        this.hospitalUser = hospitalUser;
    }
    
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
    
    public User getHospitalUser() {
        return hospitalUser;
    }
    
    public void setHospitalUser(User hospitalUser) {
        this.hospitalUser = hospitalUser;
    }
    
    public List<BloodRequestResponse> getResponses() {
        return responses;
    }
    
    public void setResponses(List<BloodRequestResponse> responses) {
        this.responses = responses;
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