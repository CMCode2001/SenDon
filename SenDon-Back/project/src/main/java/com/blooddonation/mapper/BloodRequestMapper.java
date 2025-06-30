package com.blooddonation.mapper;

import com.blooddonation.dto.BloodRequestDto;
import com.blooddonation.dto.BloodRequestResponseDto;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.User;
import com.blooddonation.enums.ResponseStatus;
import org.springframework.stereotype.Component;

@Component
public class BloodRequestMapper {
    
    public BloodRequest toEntity(BloodRequestDto dto, User hospitalUser) {
        if (dto == null) {
            return null;
        }
        
        BloodRequest request = new BloodRequest();
        request.setBloodType(dto.getBloodType());
        request.setQuantityMl(dto.getQuantityMl());
        request.setUrgencyLevel(dto.getUrgencyLevel());
        request.setDescription(dto.getDescription());
        request.setLatitude(dto.getLatitude());
        request.setLongitude(dto.getLongitude());
        request.setSearchRadiusKm(dto.getSearchRadiusKm());
        request.setHospitalAddress(dto.getHospitalAddress());
        request.setHospitalName(dto.getHospitalName());
        request.setContactPhone(dto.getContactPhone());
        request.setContactEmail(dto.getContactEmail());
        request.setDeadline(dto.getDeadline());
        request.setNotes(dto.getNotes());
        request.setHospitalUser(hospitalUser);
        
        return request;
    }
    
    public BloodRequestResponseDto toResponseDto(BloodRequest request) {
        if (request == null) {
            return null;
        }
        
        BloodRequestResponseDto dto = new BloodRequestResponseDto();
        dto.setId(request.getId());
        dto.setBloodType(request.getBloodType());
        dto.setQuantityMl(request.getQuantityMl());
        dto.setUrgencyLevel(request.getUrgencyLevel());
        dto.setDescription(request.getDescription());
        dto.setLatitude(request.getLatitude());
        dto.setLongitude(request.getLongitude());
        dto.setSearchRadiusKm(request.getSearchRadiusKm());
        dto.setHospitalAddress(request.getHospitalAddress());
        dto.setHospitalName(request.getHospitalName());
        dto.setContactPhone(request.getContactPhone());
        dto.setContactEmail(request.getContactEmail());
        dto.setDeadline(request.getDeadline());
        dto.setStatus(request.getStatus());
        dto.setNotes(request.getNotes());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        
        if (request.getHospitalUser() != null) {
            dto.setHospitalUserId(request.getHospitalUser().getId());
            dto.setHospitalUserName(request.getHospitalUser().getFirstName() + " " + 
                                   request.getHospitalUser().getLastName());
        }
        
        // Calculer les statistiques des réponses
        if (request.getResponses() != null) {
            dto.setResponseCount(request.getResponses().size());
            dto.setPendingResponseCount((int) request.getResponses().stream()
                    .filter(r -> r.getStatus() == ResponseStatus.PENDING)
                    .count());
            dto.setAcceptedResponseCount((int) request.getResponses().stream()
                    .filter(r -> r.getStatus() == ResponseStatus.ACCEPTED)
                    .count());
        } else {
            dto.setResponseCount(0);
            dto.setPendingResponseCount(0);
            dto.setAcceptedResponseCount(0);
        }
        
        return dto;
    }
    
    public void updateEntityFromDto(BloodRequest request, BloodRequestDto dto) {
        if (dto == null || request == null) {
            return;
        }
        
        request.setBloodType(dto.getBloodType());
        request.setQuantityMl(dto.getQuantityMl());
        request.setUrgencyLevel(dto.getUrgencyLevel());
        request.setDescription(dto.getDescription());
        request.setLatitude(dto.getLatitude());
        request.setLongitude(dto.getLongitude());
        request.setSearchRadiusKm(dto.getSearchRadiusKm());
        request.setHospitalAddress(dto.getHospitalAddress());
        request.setHospitalName(dto.getHospitalName());
        request.setContactPhone(dto.getContactPhone());
        request.setContactEmail(dto.getContactEmail());
        request.setDeadline(dto.getDeadline());
        request.setNotes(dto.getNotes());
    }
}