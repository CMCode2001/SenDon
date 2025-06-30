package com.blooddonation.service;

import com.blooddonation.dto.ContactDto;
import com.blooddonation.dto.ContactResponseDto;
import com.blooddonation.entity.Contact;
import com.blooddonation.entity.User;
import com.blooddonation.enums.BloodType;
import com.blooddonation.exception.ContactNotFoundException;
import com.blooddonation.exception.UserNotFoundException;
import com.blooddonation.repository.ContactRepository;
import com.blooddonation.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public ContactResponseDto addContact(Long userId, ContactDto contactDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Contact contact = modelMapper.map(contactDto, Contact.class);
        contact.setUser(user);
        
        Contact savedContact = contactRepository.save(contact);
        return modelMapper.map(savedContact, ContactResponseDto.class);
    }
    
    public List<ContactResponseDto> getContactsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId);
        }
        
        List<Contact> contacts = contactRepository.findByUserId(userId);
        return contacts.stream()
                .map(contact -> modelMapper.map(contact, ContactResponseDto.class))
                .collect(Collectors.toList());
    }
    
    public List<ContactResponseDto> getContactsWithSameBloodType(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId);
        }
        
        List<Contact> contacts = contactRepository.findContactsWithSameBloodTypeAsUserById(userId);
        return contacts.stream()
                .map(contact -> modelMapper.map(contact, ContactResponseDto.class))
                .collect(Collectors.toList());
    }
    
    public List<ContactResponseDto> getContactsByUserIdAndBloodType(Long userId, BloodType bloodType) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId);
        }
        
        List<Contact> contacts = contactRepository.findByUserIdAndBloodType(userId, bloodType);
        return contacts.stream()
                .map(contact -> modelMapper.map(contact, ContactResponseDto.class))
                .collect(Collectors.toList());
    }
    
    public ContactResponseDto getContactById(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException("Contact non trouvé avec l'ID : " + contactId));
        return modelMapper.map(contact, ContactResponseDto.class);
    }
    
    public ContactResponseDto updateContact(Long contactId, ContactDto contactDto) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException("Contact non trouvé avec l'ID : " + contactId));
        
        // Mettre à jour les champs
        contact.setFirstName(contactDto.getFirstName());
        contact.setLastName(contactDto.getLastName());
        contact.setEmail(contactDto.getEmail());
        contact.setPhoneNumber(contactDto.getPhoneNumber());
        contact.setBirthDate(contactDto.getBirthDate());
        contact.setBloodType(contactDto.getBloodType());
        contact.setRelationship(contactDto.getRelationship());
        contact.setAddress(contactDto.getAddress());
        contact.setCity(contactDto.getCity());
        contact.setPostalCode(contactDto.getPostalCode());
        contact.setNotes(contactDto.getNotes());
        
        Contact updatedContact = contactRepository.save(contact);
        return modelMapper.map(updatedContact, ContactResponseDto.class);
    }
    
    public void deleteContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException("Contact non trouvé avec l'ID : " + contactId));
        contactRepository.delete(contact);
    }
}