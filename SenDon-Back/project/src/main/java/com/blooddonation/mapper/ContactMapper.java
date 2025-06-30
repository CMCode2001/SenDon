package com.blooddonation.mapper;

import com.blooddonation.dto.ContactDto;
import com.blooddonation.dto.ContactResponseDto;
import com.blooddonation.entity.Contact;
import com.blooddonation.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {
    
    public Contact toEntity(ContactDto dto, User user) {
        if (dto == null) {
            return null;
        }
        
        Contact contact = new Contact();
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setEmail(dto.getEmail());
        contact.setPhoneNumber(dto.getPhoneNumber());
        contact.setBirthDate(dto.getBirthDate());
        contact.setBloodType(dto.getBloodType());
        contact.setRelationship(dto.getRelationship());
        contact.setAddress(dto.getAddress());
        contact.setCity(dto.getCity());
        contact.setPostalCode(dto.getPostalCode());
        contact.setNotes(dto.getNotes());
        contact.setUser(user);
        
        return contact;
    }
    
    public ContactResponseDto toResponseDto(Contact contact) {
        if (contact == null) {
            return null;
        }
        
        ContactResponseDto dto = new ContactResponseDto();
        dto.setId(contact.getId());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setEmail(contact.getEmail());
        dto.setPhoneNumber(contact.getPhoneNumber());
        dto.setBirthDate(contact.getBirthDate());
        dto.setBloodType(contact.getBloodType());
        dto.setRelationship(contact.getRelationship());
        dto.setAddress(contact.getAddress());
        dto.setCity(contact.getCity());
        dto.setPostalCode(contact.getPostalCode());
        dto.setNotes(contact.getNotes());
        dto.setCreatedAt(contact.getCreatedAt());
        dto.setUpdatedAt(contact.getUpdatedAt());
        
        return dto;
    }
    
    public void updateEntityFromDto(Contact contact, ContactDto dto) {
        if (dto == null || contact == null) {
            return;
        }
        
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setEmail(dto.getEmail());
        contact.setPhoneNumber(dto.getPhoneNumber());
        contact.setBirthDate(dto.getBirthDate());
        contact.setBloodType(dto.getBloodType());
        contact.setRelationship(dto.getRelationship());
        contact.setAddress(dto.getAddress());
        contact.setCity(dto.getCity());
        contact.setPostalCode(dto.getPostalCode());
        contact.setNotes(dto.getNotes());
    }
}