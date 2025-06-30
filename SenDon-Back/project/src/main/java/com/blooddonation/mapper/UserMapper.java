package com.blooddonation.mapper;

import com.blooddonation.dto.UserRegistrationDto;
import com.blooddonation.dto.UserResponseDto;
import com.blooddonation.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public User toEntity(UserRegistrationDto dto) {
        if (dto == null) {
            return null;
        }
        
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Sera encodé dans le service
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setBirthDate(dto.getBirthDate());
        user.setBloodType(dto.getBloodType());
        user.setRole(dto.getRole());
        user.setAddress(dto.getAddress());
        user.setCity(dto.getCity());
        user.setPostalCode(dto.getPostalCode());
        user.setHospitalName(dto.getHospitalName());
        user.setLicenseNumber(dto.getLicenseNumber());
        
        return user;
    }
    
    public UserResponseDto toResponseDto(User user) {
        if (user == null) {
            return null;
        }
        
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBirthDate(user.getBirthDate());
        dto.setBloodType(user.getBloodType());
        dto.setRole(user.getRole());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setPostalCode(user.getPostalCode());
        dto.setHospitalName(user.getHospitalName());
        dto.setLicenseNumber(user.getLicenseNumber());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        return dto;
    }
    
    public void updateEntityFromDto(User user, UserRegistrationDto dto) {
        if (dto == null || user == null) {
            return;
        }
        
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setBirthDate(dto.getBirthDate());
        user.setBloodType(dto.getBloodType());
        user.setRole(dto.getRole());
        user.setAddress(dto.getAddress());
        user.setCity(dto.getCity());
        user.setPostalCode(dto.getPostalCode());
        user.setHospitalName(dto.getHospitalName());
        user.setLicenseNumber(dto.getLicenseNumber());
    }
}