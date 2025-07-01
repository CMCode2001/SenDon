package com.blooddonation.controller;

import com.blooddonation.dto.BloodRequestDto;
import com.blooddonation.dto.BloodRequestResponseDto;
import com.blooddonation.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {
    
    @Autowired
    private BloodRequestService bloodRequestService;
    
    // Endpoints pour les hôpitaux/admins
    @PostMapping("/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<BloodRequestResponseDto> createBloodRequest(
            @PathVariable Long hospitalUserId,
            @Valid @RequestBody BloodRequestDto requestDto) {
        BloodRequestResponseDto response = bloodRequestService.createBloodRequest(hospitalUserId, requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getBloodRequestsByHospitalUser(
            @PathVariable Long hospitalUserId) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getBloodRequestsByHospitalUser(hospitalUserId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/hospital/{hospitalUserId}/active")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getActiveBloodRequestsByHospitalUser(
            @PathVariable Long hospitalUserId) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getActiveBloodRequestsByHospitalUser(hospitalUserId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('USER') or hasRole('HOSPITAL')")
    public ResponseEntity<BloodRequestResponseDto> getBloodRequestById(@PathVariable Long requestId) {
        BloodRequestResponseDto request = bloodRequestService.getBloodRequestById(requestId);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{requestId}/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<BloodRequestResponseDto> updateBloodRequest(
            @PathVariable Long requestId,
            @PathVariable Long hospitalUserId,
            @Valid @RequestBody BloodRequestDto requestDto) {
        BloodRequestResponseDto updatedRequest = bloodRequestService.updateBloodRequest(requestId, requestDto, hospitalUserId);
        return ResponseEntity.ok(updatedRequest);
    }
    
    @PutMapping("/{requestId}/cancel/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<Void> cancelBloodRequest(
            @PathVariable Long requestId,
            @PathVariable Long hospitalUserId) {
        bloodRequestService.cancelBloodRequest(requestId, hospitalUserId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{requestId}/complete/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<Void> completeBloodRequest(
            @PathVariable Long requestId,
            @PathVariable Long hospitalUserId) {
        bloodRequestService.completeBloodRequest(requestId, hospitalUserId);
        return ResponseEntity.noContent().build();
    }
    
    // Endpoints pour les donneurs - ACCÈS SIMPLIFIÉ
    @GetMapping("/active")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BloodRequestResponseDto>> getAllActiveBloodRequests() {
        List<BloodRequestResponseDto> requests = bloodRequestService.getAllActiveBloodRequests();
        return ResponseEntity.ok(requests);
    }
    
    // Endpoints pour les hôpitaux/admins - RECHERCHE ET FILTRAGE
    @GetMapping("/search/blood-type/{bloodType}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getBloodRequestsByBloodType(
            @PathVariable com.blooddonation.enums.BloodType bloodType) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getBloodRequestsByBloodType(bloodType);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/search/urgency/{urgencyLevel}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getBloodRequestsByUrgencyLevel(
            @PathVariable com.blooddonation.enums.UrgencyLevel urgencyLevel) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getBloodRequestsByUrgencyLevel(urgencyLevel);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/search/nearby")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getNearbyBloodRequests(
            @RequestParam java.math.BigDecimal latitude,
            @RequestParam java.math.BigDecimal longitude,
            @RequestParam com.blooddonation.enums.BloodType bloodType) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getNearbyBloodRequests(latitude, longitude, bloodType);
        return ResponseEntity.ok(requests);
    }
    
    // Endpoint pour voir toutes les demandes (pour les hôpitaux/admins)
    @GetMapping("/all")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseDto>> getAllBloodRequests() {
        List<BloodRequestResponseDto> requests = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(requests);
    }
}