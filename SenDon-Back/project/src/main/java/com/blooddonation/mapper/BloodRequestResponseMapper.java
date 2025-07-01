package com.blooddonation.mapper;

import com.blooddonation.dto.BloodRequestResponseResponseDto;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.BloodRequestResponse;
import com.blooddonation.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BloodRequestResponseMapper {
    
    public BloodRequestResponse toEntity(BloodRequestResponseResponseDto dto, BloodRequest bloodRequest, User donorUser) {
        if (dto == null) {
            return null;
        }
        
        BloodRequestResponse response = new BloodRequestResponse();
        response.setBloodRequest(bloodRequest);
        response.setDonorUser(donorUser);
        response.setMessage(dto.getMessage());
        
        return response;
    }
    
    public BloodRequestResponseResponseDto toResponseDto(BloodRequestResponse response) {
        if (response == null) {
            return null;
        }
    
        BloodRequestResponseResponseDto dto = new BloodRequestResponseResponseDto(); // ✅ correction ici
        dto.setId(response.getId());
        dto.setStatus(response.getStatus());
        dto.setMessage(response.getMessage());
        dto.setResponseDate(response.getResponseDate());
        dto.setCreatedAt(response.getCreatedAt());
        dto.setUpdatedAt(response.getUpdatedAt());
    
        if (response.getBloodRequest() != null) {
            dto.setBloodRequestId(response.getBloodRequest().getId());
            dto.setBloodRequestDescription(response.getBloodRequest().getDescription());
            dto.setHospitalName(response.getBloodRequest().getHospitalName());
        }
    
        if (response.getDonorUser() != null) {
            dto.setDonorUserId(response.getDonorUser().getId());
            dto.setDonorUserName(response.getDonorUser().getFirstName() + " " + 
                                 response.getDonorUser().getLastName());
            dto.setDonorUserEmail(response.getDonorUser().getEmail());
            dto.setDonorUserPhone(response.getDonorUser().getPhoneNumber());
        }
    
        return dto;
    }
    
}
