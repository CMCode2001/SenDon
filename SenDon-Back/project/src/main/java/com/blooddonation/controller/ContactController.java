package com.blooddonation.controller;

import com.blooddonation.dto.ContactDto;
import com.blooddonation.dto.ContactResponseDto;
import com.blooddonation.enums.BloodType;
import com.blooddonation.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ContactResponseDto> addContact(@PathVariable Long userId, 
                                                        @Valid @RequestBody ContactDto contactDto) {
        ContactResponseDto contact = contactService.addContact(userId, contactDto);
        return new ResponseEntity<>(contact, HttpStatus.CREATED);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ContactResponseDto>> getContactsByUserId(@PathVariable Long userId) {
        List<ContactResponseDto> contacts = contactService.getContactsByUserId(userId);
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/user/{userId}/same-blood-type")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ContactResponseDto>> getContactsWithSameBloodType(@PathVariable Long userId) {
        List<ContactResponseDto> contacts = contactService.getContactsWithSameBloodType(userId);
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/user/{userId}/blood-type/{bloodType}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ContactResponseDto>> getContactsByUserIdAndBloodType(
            @PathVariable Long userId, 
            @PathVariable BloodType bloodType) {
        List<ContactResponseDto> contacts = contactService.getContactsByUserIdAndBloodType(userId, bloodType);
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/{contactId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ContactResponseDto> getContactById(@PathVariable Long contactId) {
        ContactResponseDto contact = contactService.getContactById(contactId);
        return ResponseEntity.ok(contact);
    }
    
    @PutMapping("/{contactId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ContactResponseDto> updateContact(@PathVariable Long contactId, 
                                                           @Valid @RequestBody ContactDto contactDto) {
        ContactResponseDto updatedContact = contactService.updateContact(contactId, contactDto);
        return ResponseEntity.ok(updatedContact);
    }
    
    @DeleteMapping("/{contactId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.noContent().build();
    }
}