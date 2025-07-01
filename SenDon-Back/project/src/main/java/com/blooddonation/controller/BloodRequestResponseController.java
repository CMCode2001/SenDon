package com.blooddonation.controller;

import com.blooddonation.dto.BloodRequestResponseResponseDto;
import com.blooddonation.service.BloodRequestResponseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-request-responses")
@CrossOrigin(origins = "*")
public class BloodRequestResponseController {
    
    @Autowired
    private BloodRequestResponseService responseService;
    
    // Endpoints pour les donneurs
    @PostMapping("/request/{requestId}/donor/{donorUserId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BloodRequestResponseResponseDto> respondToBloodRequest(
            @PathVariable Long requestId,
            @PathVariable Long donorUserId,
            @Valid @RequestBody BloodRequestResponseResponseDto responseDto) {
        BloodRequestResponseResponseDto response = responseService.respondToBloodRequest(requestId, donorUserId, responseDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/donor/{donorUserId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BloodRequestResponseResponseDto>> getDonorResponses(
            @PathVariable Long donorUserId) {
        List<BloodRequestResponseResponseDto> responses = responseService.getDonorResponses(donorUserId);
        return ResponseEntity.ok(responses);
    }
    
    @DeleteMapping("/{responseId}/donor/{donorUserId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> cancelDonorResponse(
            @PathVariable Long responseId,
            @PathVariable Long donorUserId) {
        responseService.cancelDonorResponse(responseId, donorUserId);
        return ResponseEntity.noContent().build();
    }
    
    // Endpoints pour les hôpitaux
    @GetMapping("/request/{requestId}/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<List<BloodRequestResponseResponseDto>> getResponsesForBloodRequest(
            @PathVariable Long requestId,
            @PathVariable Long hospitalUserId) {
        List<BloodRequestResponseResponseDto> responses = responseService.getResponsesForBloodRequest(requestId, hospitalUserId);
        return ResponseEntity.ok(responses);
    }
    
    @PutMapping("/{responseId}/accept/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<Void> acceptDonorResponse(
            @PathVariable Long responseId,
            @PathVariable Long hospitalUserId) {
        responseService.acceptDonorResponse(responseId, hospitalUserId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{responseId}/decline/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<Void> declineDonorResponse(
            @PathVariable Long responseId,
            @PathVariable Long hospitalUserId) {
        responseService.declineDonorResponse(responseId, hospitalUserId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{responseId}/complete/hospital/{hospitalUserId}")
    @PreAuthorize("hasRole('HOSPITAL')")
    public ResponseEntity<Void> completeDonorResponse(
            @PathVariable Long responseId,
            @PathVariable Long hospitalUserId) {
        responseService.completeDonorResponse(responseId, hospitalUserId);
        return ResponseEntity.noContent().build();
    }
}
